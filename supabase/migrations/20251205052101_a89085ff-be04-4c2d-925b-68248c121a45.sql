-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on playlists
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- Playlists policies
CREATE POLICY "Users can view their own playlists"
ON public.playlists FOR SELECT
USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own playlists"
ON public.playlists FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists"
ON public.playlists FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists"
ON public.playlists FOR DELETE
USING (auth.uid() = user_id);

-- Create liked_songs table
CREATE TABLE public.liked_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- Enable RLS on liked_songs
ALTER TABLE public.liked_songs ENABLE ROW LEVEL SECURITY;

-- Liked songs policies
CREATE POLICY "Users can view their own liked songs"
ON public.liked_songs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add liked songs"
ON public.liked_songs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove liked songs"
ON public.liked_songs FOR DELETE
USING (auth.uid() = user_id);

-- Create playlist_tracks table (junction table)
CREATE TABLE public.playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(playlist_id, track_id)
);

-- Enable RLS on playlist_tracks
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Playlist tracks policies (check via playlist ownership)
CREATE POLICY "Users can view tracks in their playlists"
ON public.playlist_tracks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.playlists
    WHERE playlists.id = playlist_tracks.playlist_id
    AND (playlists.user_id = auth.uid() OR playlists.is_public = true)
  )
);

CREATE POLICY "Users can add tracks to their playlists"
ON public.playlist_tracks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.playlists
    WHERE playlists.id = playlist_tracks.playlist_id
    AND playlists.user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove tracks from their playlists"
ON public.playlist_tracks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.playlists
    WHERE playlists.id = playlist_tracks.playlist_id
    AND playlists.user_id = auth.uid()
  )
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email));
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
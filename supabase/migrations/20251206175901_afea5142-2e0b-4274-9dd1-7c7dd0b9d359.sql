-- Create tracks table for user-uploaded songs
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  duration INTEGER NOT NULL DEFAULT 0,
  cover_url TEXT,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- RLS policies for tracks
CREATE POLICY "Users can view all tracks" 
ON public.tracks 
FOR SELECT 
USING (true);

CREATE POLICY "Users can upload their own tracks" 
ON public.tracks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracks" 
ON public.tracks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracks" 
ON public.tracks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_tracks_updated_at
BEFORE UPDATE ON public.tracks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create album-covers bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('album-covers', 'album-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Make song bucket public for playback
UPDATE storage.buckets SET public = true WHERE id = 'song';

-- Storage policies for song bucket
CREATE POLICY "Anyone can view songs"
ON storage.objects FOR SELECT
USING (bucket_id = 'song');

CREATE POLICY "Authenticated users can upload songs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'song' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own songs"
ON storage.objects FOR DELETE
USING (bucket_id = 'song' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for album-covers bucket
CREATE POLICY "Anyone can view album covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'album-covers');

CREATE POLICY "Authenticated users can upload album covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'album-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own album covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'album-covers' AND auth.uid()::text = (storage.foldername(name))[1]);
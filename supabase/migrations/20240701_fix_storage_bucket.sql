-- Drop existing bucket if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Delete existing bucket if it exists
DELETE FROM storage.buckets WHERE id = 'notes';

-- Create a storage bucket for notes
INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', true);

-- Enable public access to the notes bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'notes');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'notes' AND auth.role() = 'authenticated');

-- Allow users to update and delete their own files
CREATE POLICY "Users can update their own files" ON storage.objects 
FOR UPDATE USING (bucket_id = 'notes' AND owner = auth.uid());

CREATE POLICY "Users can delete their own files" ON storage.objects 
FOR DELETE USING (bucket_id = 'notes' AND owner = auth.uid());
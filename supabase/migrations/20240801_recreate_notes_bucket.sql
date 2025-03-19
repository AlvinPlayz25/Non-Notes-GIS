-- Recreate the notes bucket if it doesn't exist
DO $$
BEGIN
    -- Check if the bucket exists
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE name = 'notes'
    ) THEN
        -- Create the bucket
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('notes', 'notes', true);
        
        -- Create policy to allow authenticated users to upload files
        INSERT INTO storage.policies (name, definition, bucket_id)
        VALUES (
            'Allow authenticated uploads',
            'CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = ''notes'' AND auth.uid() = owner);',
            'notes'
        );
        
        -- Create policy to allow public read access
        INSERT INTO storage.policies (name, definition, bucket_id)
        VALUES (
            'Allow public read access',
            'CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (bucket_id = ''notes'');',
            'notes'
        );
    END IF;
END
$$;
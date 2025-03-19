-- Create a deleted_notes table to store deleted notes
CREATE TABLE IF NOT EXISTS deleted_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  grade INTEGER NOT NULL,
  subject TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE deleted_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their deleted notes" ON deleted_notes;
CREATE POLICY "Users can view their deleted notes"
  ON deleted_notes FOR SELECT
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table deleted_notes;

-- Create function to move deleted notes to trash
CREATE OR REPLACE FUNCTION move_note_to_trash()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO deleted_notes (
    original_id, title, description, file_url, grade, subject, 
    is_verified, likes, views, user_id, created_at
  ) VALUES (
    OLD.id, OLD.title, OLD.description, OLD.file_url, OLD.grade, 
    OLD.subject, OLD.is_verified, OLD.likes, OLD.views, OLD.user_id, OLD.created_at
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for moving deleted notes to trash
DROP TRIGGER IF EXISTS move_note_to_trash_trigger ON notes;
CREATE TRIGGER move_note_to_trash_trigger
BEFORE DELETE ON notes
FOR EACH ROW
EXECUTE FUNCTION move_note_to_trash();

-- Create storage bucket for trash if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('trash', 'trash', false)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for trash bucket
DROP POLICY IF EXISTS "Users can view their own trash" ON storage.objects;
CREATE POLICY "Users can view their own trash"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'trash' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Users can upload to trash" ON storage.objects;
CREATE POLICY "Users can upload to trash"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'trash' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Users can update their trash" ON storage.objects;
CREATE POLICY "Users can update their trash"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'trash' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Users can delete from trash" ON storage.objects;
CREATE POLICY "Users can delete from trash"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'trash' AND auth.uid() = owner);
-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  grade INTEGER NOT NULL,
  subject TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Notes are viewable by everyone" ON notes;
CREATE POLICY "Notes are viewable by everyone"
  ON notes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
CREATE POLICY "Users can insert their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;
CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table notes;

-- Create saved_notes table for users to save notes they like
CREATE TABLE IF NOT EXISTS saved_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, note_id)
);

-- Enable RLS
ALTER TABLE saved_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their saved notes" ON saved_notes;
CREATE POLICY "Users can view their saved notes"
  ON saved_notes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their saved notes" ON saved_notes;
CREATE POLICY "Users can insert their saved notes"
  ON saved_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their saved notes" ON saved_notes;
CREATE POLICY "Users can delete their saved notes"
  ON saved_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table saved_notes;

-- Create likes table to track user likes on notes
CREATE TABLE IF NOT EXISTS note_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, note_id)
);

-- Enable RLS
ALTER TABLE note_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their likes" ON note_likes;
CREATE POLICY "Users can view their likes"
  ON note_likes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their likes" ON note_likes;
CREATE POLICY "Users can insert their likes"
  ON note_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their likes" ON note_likes;
CREATE POLICY "Users can delete their likes"
  ON note_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table note_likes;

-- Create function to update note likes count
CREATE OR REPLACE FUNCTION update_note_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE notes SET likes = likes + 1 WHERE id = NEW.note_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE notes SET likes = likes - 1 WHERE id = OLD.note_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for likes count
DROP TRIGGER IF EXISTS update_note_likes_count_trigger ON note_likes;
CREATE TRIGGER update_note_likes_count_trigger
AFTER INSERT OR DELETE ON note_likes
FOR EACH ROW
EXECUTE FUNCTION update_note_likes_count();

-- Create function to update note views count
CREATE OR REPLACE FUNCTION increment_note_views(note_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE notes SET views = views + 1 WHERE id = note_uuid;
END;
$$ LANGUAGE plpgsql;

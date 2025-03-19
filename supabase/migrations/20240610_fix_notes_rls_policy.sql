-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public notes access" ON notes;

-- Create a policy that allows anyone to read notes
CREATE POLICY "Public notes access"
ON notes FOR SELECT
USING (true);

-- Make sure RLS is enabled on the notes table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Add the table to realtime publication
alter publication supabase_realtime add table notes;

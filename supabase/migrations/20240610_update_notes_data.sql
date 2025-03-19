-- Update the existing notes with the test PDF URL
UPDATE notes
SET file_url = 'https://drive.google.com/uc?id=1_g_0IBdyU8WKhyN_7qUDUjPZWZ14DmOk'
WHERE id IN (
  SELECT id FROM notes
  LIMIT 6
);

-- Insert specific notes with the test PDF URL if they don't exist
INSERT INTO notes (title, description, grade, subject, is_verified, likes, views, file_url)
SELECT 
  'CLASS 8 MATHS ANNUAL 2024-25',
  'Comprehensive annual mathematics examination paper for Class 8 students covering all topics from the academic year 2024-25.',
  8,
  'Math',
  TRUE,
  325,
  1580,
  'https://drive.google.com/uc?id=1_g_0IBdyU8WKhyN_7qUDUjPZWZ14DmOk'
WHERE NOT EXISTS (
  SELECT 1 FROM notes WHERE title = 'CLASS 8 MATHS ANNUAL 2024-25'
);

INSERT INTO notes (title, description, grade, subject, is_verified, likes, views, file_url)
SELECT 
  'CLASS 8 ENGLISH PERIODIC 1 2024-25',
  'First periodic assessment for Class 8 English covering grammar, comprehension, and writing skills for the academic year 2024-25.',
  8,
  'English',
  TRUE,
  210,
  980,
  'https://drive.google.com/uc?id=1_g_0IBdyU8WKhyN_7qUDUjPZWZ14DmOk'
WHERE NOT EXISTS (
  SELECT 1 FROM notes WHERE title = 'CLASS 8 ENGLISH PERIODIC 1 2024-25'
);

INSERT INTO notes (title, description, grade, subject, is_verified, likes, views, file_url)
SELECT 
  'CLASS5 MATHS ANNUAL 2023-24',
  'Annual mathematics examination paper for Class 5 students covering all topics from the academic year 2023-24.',
  5,
  'Math',
  TRUE,
  185,
  920,
  'https://drive.google.com/uc?id=1_g_0IBdyU8WKhyN_7qUDUjPZWZ14DmOk'
WHERE NOT EXISTS (
  SELECT 1 FROM notes WHERE title = 'CLASS5 MATHS ANNUAL 2023-24'
);

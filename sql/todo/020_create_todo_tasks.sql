CREATE TABLE IF NOT EXISTS public.todo_tasks (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100 AND title = btrim(title)),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT id, title, is_completed, created_at FROM public.todo_tasks ORDER BY id;

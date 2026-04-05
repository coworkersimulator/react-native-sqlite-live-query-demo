PRAGMA journal_mode = 'wal';
PRAGMA auto_vacuum = INCREMENTAL;

CREATE TABLE IF NOT EXISTS fruit (
  id TEXT PRIMARY KEY,
  at TEXT NOT NULL DEFAULT (datetime('now'))
) STRICT;

CREATE INDEX IF NOT EXISTS fruit_idx ON fruit (at);

CREATE TABLE IF NOT EXISTS click (
  id TEXT PRIMARY KEY,
  "on" TEXT NOT NULL REFERENCES fruit(id),
  at TEXT NOT NULL DEFAULT (datetime('now'))
) STRICT;

CREATE INDEX IF NOT EXISTS click_idx ON click ("on", at);

INSERT INTO fruit (id)
VALUES
  ('🍇'),
  ('🍈'),
  ('🍉'),
  ('🍊'),
  ('🍋'),
  ('🍋‍🟩'),
  ('🍌'),
  ('🍍'),
  ('🍎'),
  ('🍏'),
  ('🍐'),
  ('🍑'),
  ('🍒'),
  ('🍓'),
  ('🥝'),
  ('🥥'),
  ('🥭'),
  ('🫐')
ON CONFLICT(id) DO NOTHING;

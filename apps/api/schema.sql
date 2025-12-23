PRAGMA foreign_keys = ON;

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Recipients table
CREATE TABLE IF NOT EXISTS recipients (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  reply TEXT,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_recipients_campaign ON recipients (campaign_id);

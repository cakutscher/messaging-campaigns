import { nowIso, sqlite } from "../db/index.js";
import type { Campaign, CampaignStatus } from "../domain/types.js";

type CampaignRow = {
  id: string;
  name: string;
  content: string;
  status: string;
  created_at: string;
};

function mapStatus(value: string): CampaignStatus {
  if (
    value === "draft" ||
    value === "ready" ||
    value === "running" ||
    value === "completed" ||
    value === "cancelled"
  ) {
    return value;
  }
  return "draft";
}

function mapCampaign(row: CampaignRow): Campaign {
  return {
    id: row.id,
    name: row.name,
    content: row.content,
    status: mapStatus(row.status),
    createdAt: row.created_at,
  };
}

const qCreate = sqlite.prepare(`
  INSERT INTO campaigns (id, name, content, status, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

const qList = sqlite.prepare(`
  SELECT id, name, content, status, created_at
  FROM campaigns
  ORDER BY created_at DESC
`);

const qGet = sqlite.prepare(`
  SELECT id, name, content, status, created_at
  FROM campaigns
  WHERE id = ?
`);

const qSetStatus = sqlite.prepare(`
  UPDATE campaigns
  SET status = ?
  WHERE id = ?
`);

export function createCampaign(input: {
  id: string;
  name: string;
  content: string;
}): Campaign {
  const createdAt = nowIso();
  const name = input.name.trim();
  const content = input.content.trim();

  qCreate.run(input.id, name, content, "draft", createdAt);

  return {
    id: input.id,
    name,
    content,
    status: "draft",
    createdAt,
  };
}

export function listCampaigns(): Campaign[] {
  const rows = qList.all() as CampaignRow[];
  return rows.map(mapCampaign);
}

export function getCampaign(id: string): Campaign | null {
  const row = qGet.get(id) as CampaignRow | undefined;
  return row ? mapCampaign(row) : null;
}

export function setCampaignStatus(id: string, status: CampaignStatus) {
  qSetStatus.run(status, id);
}

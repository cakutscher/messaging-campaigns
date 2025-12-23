import cors from "cors";
import express from "express";

import { campaignsRouter } from "./routes/campaigns.js";
// import { webhooksRouter } from "./routes/webhooks.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/campaigns", campaignsRouter);
// app.use("/api/webhooks", webhooksRouter);

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
});


import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE =
  "https://star-info-api.lovable.app/functions/v1/info-api";

app.get("/api/player", async (req, res) => {
  const uid = String(req.query.uid || "").trim();

  if (!/^\d{5,15}$/.test(uid)) {
    return res.status(400).json({
      error: "Invalid Free Fire UID"
    });
  }

  try {
    const response = await fetch(
      `${API_BASE}/accinfo?uid=${encodeURIComponent(uid)}`,
      { signal: AbortSignal.timeout(20000) }
    );

    const data = await response.json();

    return res.status(response.ok ? 200 : 502).json(data);

  } catch (error) {
    return res.status(502).json({
      error: "Player API connection failed",
      details: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("DIDAR DIAMOND STORE API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("DIDAR DIAMOND STORE API running");
});

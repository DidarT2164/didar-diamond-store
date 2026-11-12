import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/player", async (req, res) => {
  const uid = String(req.query.uid || "").trim();

  if (!/^\d{5,15}$/.test(uid)) {
    return res.status(400).json({
      error: "Enter a valid Free Fire UID"
    });
  }

  try {
    const url = new URL(
      "https://api2.nftoken.info/player-info"
    );

    url.searchParams.set("uid", uid);

    const response = await fetch(url, {
      signal: AbortSignal.timeout(20000)
    });

    const body = await response.text();

    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return res.status(502).json({
        error: "Invalid response from player API"
      });
    }

    if (!response.ok) {
      return res.status(502).json({
        error: "Player API request failed",
        upstreamStatus: response.status,
        details: data
      });
    }

    const playerName = data?.AccountInfo?.AccountName;

    if (!playerName) {
      return res.status(404).json({
        error: "Player name not found",
        details: data
      });
    }

    return res.json({
      success: true,
      uid,
      playerName,
      region: data.AccountInfo.AccountRegion || null
    });

  } catch (error) {
    return res.status(502).json({
      error: "Player lookup failed",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("DIDAR DIAMOND STORE API running");
});

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/player", async (req, res) => {
  const { uid, region } = req.query;

  if (!uid || !region) {
    return res.status(400).json({
      error: "UID and region are required"
    });
  }

  try {
    const url = new URL("https://api2.nftoken.info/get");
    url.searchParams.set("uid", uid);
    url.searchParams.set("region", region);

    const response = await fetch(url);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({
      error: "Player lookup service unavailable"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("DIDAR DIAMOND STORE API running");
});

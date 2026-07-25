import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

import express from "express";
import path from "path";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Configure Multer for file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Sistem Rekap & Dokumen Online API", time: new Date().toISOString() });
});

// Handle file upload
app.post("/api/documents/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File tidak ditemukan dalam permintaan." });
    }

    const { title, docNumber, category, description, uploader, tags, status } = req.body;
    const fileBuffer = req.file.buffer;
    const base64Data = `data:${req.file.mimetype};base64,${fileBuffer.toString("base64")}`;

    const newDoc = {
      id: `doc-${Date.now()}`,
      title: title || req.file.originalname,
      docNumber: docNumber || "",
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      category: category || "Lainnya",
      description: description || "",
      uploader: uploader || "Pengguna Sistem",
      uploadDate: new Date().toISOString().split("T")[0],
      tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      downloadUrl: base64Data,
      status: status || "Aktif",
      isSyncedToDrive: false,
    };

    res.json({ success: true, document: newDoc });
  } catch (error: any) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: "Gagal memproses unggahan berkas." });
  }
});

// Google Drive integration proxy route
app.get("/api/drive/list", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Membutuhkan token otentikasi Google." });
    }

    const token = authHeader.substring(7);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const response = await drive.files.list({
      pageSize: 30,
      fields: "nextPageToken, files(id, name, mimeType, size, webViewLink, iconLink, modifiedTime, thumbnailLink)",
      q: "trashed = false",
      orderBy: "folder,modifiedTime desc",
    });

    res.json({ files: response.data.files || [] });
  } catch (error: any) {
    console.error("Error listing Drive files:", error);
    res.status(500).json({ error: error.message || "Gagal mengambil daftar file dari Google Drive." });
  }
});

app.get("/api/test-db", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS waktu");
    res.json(rows);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

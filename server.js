// server.js

const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 8000;
const HLS_DIRECTORY = "./hls";

// CORS設定
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// HLSファイルの提供
app.get("/stream/:roomId/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    HLS_DIRECTORY,
    req.params.roomId,
    req.params.filename
  );
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "file not found" });
  }
});

// 各roomの状態を保持L
const rooms = new Map();

function sendRandomMessage(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  const randomMessage = {
    type: "random",
    message: `開発用ランダムコメント:${Math.floor(Math.random() * 10000)}`,
  };

  room.messageHistory.push(randomMessage);

  for (const client of room.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(randomMessage));
    }
  }
}

// ランダムメッセージ送信間隔管理
function startRandomMessages(roomId) {
  const interval = setInterval(() => {
    sendRandomMessage(roomId);
  }, 5000);
  rooms.get(roomId).interval = interval;
}

wss.on("connection", (ws, req) => {
  const urlParts = req.url.split("/");
  const roomId = urlParts[urlParts.length - 1];

  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      clients: [],
      messageHistory: [],
      interval: null,
    });
  }

  const room = rooms.get(roomId);
  room.clients.push(ws);

  // 接続時に履歴を送信
  room.messageHistory.forEach((message) => {
    ws.send(JSON.stringify(message));
  });

  // ランダムメッセージ送信を開始（まだなら）
  if (!room.interval) {
    startRandomMessages(roomId);
  }

  ws.on("error", (err) => {
    console.error(`WebSocket error in room ${roomId}:`, err);
  });

  ws.on("message", (data) => {
    const messageData = JSON.parse(data);
    room.messageHistory.push(messageData);

    for (const client of room.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageData));
      }
    }
  });

  ws.on("close", () => {
    room.clients = room.clients.filter((client) => client !== ws);
    // ルーム内のクライアントが0人になったらランダム送信を停止して、ルームを削除
    if (room.clients.length === 0) {
      clearInterval(room.interval);
      rooms.delete(roomId);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

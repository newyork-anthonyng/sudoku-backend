const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET"],
  },
});
const routes = require("./routes")(io);
const cors = require("cors");

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});
app.use("/games", routes);

const port = process.env.PORT || 3001;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

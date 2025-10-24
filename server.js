require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const PORT = 3000;

const allowedOrigins = ["http://localhost:3001", "http://127.0.0.1:3001"];

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Origin not allowed by CORS"));
		}
	},
	methods: ["GET", "POST"],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: allowedOrigins,
		methods: ["GET", "POST"],
	},
});

app.get("/", (req, res) => {
	res.json({ message: "CORS and Socket.io working fine ✅" });
});

require("./app/routes/index")(app, io);

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

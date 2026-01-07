import express from "express"; // server framework
import cors from "cors"; // allows frontend to talk to backend
import dotenv from "dotenv"; // environment variables


dotenv.config();

console.log("Environment:", process.env.NODE_ENV);
console.log("Port:", process.env.PORT);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/contact", async (req, res) => {
  // Setup contact endpoint
});

app.get("/", (req, res) => {
  res.json({
    message: "Contact API is running",
    environment: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

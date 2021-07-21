import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

console.log(process.env.COOKIE_SECRET, process.env.DB_URL);
const PORT = 4000;

const handleOpen = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(4000, handleOpen);

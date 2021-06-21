import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 4000;

const handleOpen = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(4000, handleOpen);

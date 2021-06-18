import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(express.urlencoded({ extended: true }));
app.use(logger); // 로그 확인
app.use("/videos", videoRouter); //비디오 라우터 활성화
app.use("/users", userRouter); //유저 라우터 활성화
app.use("/", globalRouter); //글로벌 라우터 활성화

export default app;

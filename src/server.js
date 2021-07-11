import express from "express";
import morgan from "morgan";
import session from "express-session";
import Mongostore from "connect-mongo";
import globalRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { PromiseProvider } from "mongoose";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(express.urlencoded({ extended: true })); //POST 또는 PUT을 통해 전송된 encode된 데이터들을 parse하여 읽을 수 있도록 해주는 미들웨어이다. extended:true이면 npm qs의 라이브러리를 사용할 수 있도록 헤준다.
app.use(logger); // 로그 확인
app.use(
  session({
    secret: "Hello!",
    resave: false,
    saveUninitialized: false,
    store: Mongostore.create({ mongoUrl: process.env.DB_URL }),
    cookie: {
      maxAge: 6000000,
    },
  })
);

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets")); //첫번째는 url주소, 두번째는 실제 directory
app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  return res.send(`${req.session.id}\n${req.session.potato}`);
});

app.use("/videos", videoRouter); //비디오 라우터 활성화
app.use("/users", userRouter); //유저 라우터 활성화
app.use("/", globalRouter); //글로벌 라우터 활성화
app.use("/api", apiRouter);

export default app;

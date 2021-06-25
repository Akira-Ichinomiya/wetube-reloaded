import express from "express";
import {
  remove,
  edit,
  logout,
  account,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router(); // 유저 라우터

userRouter.get("/edit", edit);
userRouter.get("/logout", logout);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;

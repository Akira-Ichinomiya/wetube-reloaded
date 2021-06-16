import express from "express";
import { remove, edit, logout, account } from "../controllers/userController";

const userRouter = express.Router(); // 유저 라우터

userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/:id", account);
userRouter.get("/logout", logout);

export default userRouter;

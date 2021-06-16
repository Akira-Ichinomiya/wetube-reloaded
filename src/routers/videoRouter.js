import express from "express";
import { see, edit, upload, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router(); // 비디오 라우터

videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", upload);

export default videoRouter;

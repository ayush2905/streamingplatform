import express from "express";
import { addVideo, addView, deleteVideo, getByTag, getVideo, random, search, sub, trend, updateVideo } from '../controllers/video.js'
import { verifyToken } from "../verifyToken.js";


const router = express.Router();


//create videos
router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.put("/view/:id",addView);     //to update the view count each time the page is refreshed
router.get("/trend", trend);
router.get("/random", random);
router.get("/sub", verifyToken, sub);
router.get("/tags", getByTag);
router.get("/search", search);
export default router;
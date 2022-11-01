import express from "express";
import { update, deleteUser, like, dislike, subscribe, unsubscribe, getUser } from '../controllers/user.js'
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//update a user
router.put("/:id",verifyToken, update);

//delete a user
router.delete("/:id", verifyToken, deleteUser);

//get a user
router.get("/find/:id", getUser);

//suscribe a user
router.put("/sub/:id", verifyToken, subscribe);  //id of the channel to suscribe

//unsuscribe a user
router.put("/unsub/:id", verifyToken, unsubscribe);

//like  a video
router.put("/like/:videoId", verifyToken, like);

//dislike a video
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;
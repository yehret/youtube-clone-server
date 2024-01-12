import express from "express";
import { addVideo, deleteVideo, getVideo, updateVideo } from "../controllers/video.js";

const router = express.Router();

// create a video
router.post('/', verifyToken, addVideo)
router.put('/:id', verifyToken, updateVideo)
router.delete('/:id', verifyToken, deleteVideo)
router.get('/find/:id', getVideo)

export default router
import express from "express";
import { generateFacts } from "../controllers/aiController.js";

const router = express.Router();

router.get("/facts", generateFacts);

export default router;

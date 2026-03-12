const express = require("express");
const { generateFacts } = require("../controllers/aiController");

const router = express.Router();

router.get("/facts", generateFacts);

module.exports = router;

const express = require("express");
const router = express.Router();

const { searchHandler } = require("../../controllers/search/search.controller");

router.get("/search", searchHandler);

module.exports = router;

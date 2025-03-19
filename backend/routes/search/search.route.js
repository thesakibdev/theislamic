const express = require("express");

const { search } = require("../../controllers/search/search.controller");

const router = express.Router();

router.get("/search", search);

module.exports = router;

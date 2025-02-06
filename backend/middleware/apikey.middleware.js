function checkHardcodedApiKey(req, res, next) {
  const clientApiKey = req.header("api_key"); 
  if (!clientApiKey) {
    return res.status(401).json({ error: "API Key missing" });
  }

  if (clientApiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API Key" });
  }

  next(); 
}

module.exports = checkHardcodedApiKey;

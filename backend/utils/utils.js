const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// Function to invalidate the entire cache
const invalidateCache = () => {
  console.log("🛑 Cache invalidated!");
  cache.flushAll();
};

// Function to set cache (if needed in future)
const setCache = (key, data, ttl = 600) => {
  cache.set(key, data, ttl);
};

// Function to get cached data
const getCache = (key) => {
  return cache.get(key);
};

module.exports = { invalidateCache, setCache, getCache };

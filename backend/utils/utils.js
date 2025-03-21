const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// Function to invalidate the entire cache
const invalidateCache = () => {
  console.log("Invalidating entire cache");
  cache.flushAll();
};

// Function to set cache properly
const setCache = (key, value, ttl = 600) => {
  console.log(`Caching response for key: ${key} with TTL: ${ttl}`);
  cache.set(key, value, ttl);
};

// Function to get cached data
const getCache = (key) => {
  console.log(`Checking cache for key: ${key}`);
  return cache.get(key) || null;
};

module.exports = { invalidateCache, setCache, getCache };

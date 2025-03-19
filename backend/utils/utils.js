const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// Function to invalidate the entire cache
const invalidateCache = () => {
  cache.flushAll();
};

// Function to set cache (if needed in future)
const setCache = (key, value, ttl) => {
  console.log(`Caching response for key: ${key} with TTL: ${ttl}`);
  cache[key] = value;
  setTimeout(() => {
    delete cache[key];
  }, ttl * 1000);
};

// Function to get cached data
const getCache = (key) => {
  console.log(`Checking cache for key: ${key}`);
  return cache[key] || null;
};

module.exports = { invalidateCache, setCache, getCache };

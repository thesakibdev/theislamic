// middleware/trackVisits.js
const Visit = require("./../models/counter.model");

const trackVisits = async (req, res, next) => {
  if (!req.path.startsWith("/admin")) {
    const ip = req.ip || req.connection.remoteAddress;
    const existingVisitor = await Visit.findOne({ ip });
    if (!existingVisitor) {
      const visitor = new Visit({ ip });
      await visitor.save();
    }
  }
  next();
};

module.exports = trackVisits;

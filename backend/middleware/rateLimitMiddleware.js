const rateLimit = require("express-rate-limit");

const limiter = (count) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: count,
    handler: function (req, res, next) {
      res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    },
  });
module.exports = limiter;

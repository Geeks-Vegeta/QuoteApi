const useragent = require("express-useragent");

module.exports = {
  enableUserAgentTracking,
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function enableUserAgentTracking(req, res, next) {
  const source = req.headers["x-forwarded-for"] || ":";
  const sourceIP = source.split(":")[0];
  const sourcePort = source.split(":")[1];
  const headerUA = req.headers["user-agent"];
  if (headerUA) {
    const ua = useragent.parse(headerUA);
    req.useragent = {
      browser: ua.browser,
      version: ua.version,
      os: ua.os,
      platform: ua.platform,
      source: ua.source,
      sourceIP: sourceIP,
      sourcePort: sourcePort,
      bot: ua.isBot,
      viaMobile: ua.isMobile,
      viaTablet: ua.isTablet,
      viaDesktop: ua.isDesktop,
    };
  } else {
    req.useragent = {
      sourceIP: sourceIP,
      sourcePort: sourcePort,
    };
  }

  next();
}

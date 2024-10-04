const sendResponse = require('../response/send_response');
const NoResponseError = require('./no_response_error');
const Status = require('./status_mode');

module.exports = function handleError(err, req, res, next) {
  if (err instanceof NoResponseError) {
    // do not send any response to clients
    return;
  } else {
    return sendResponse(req, res, next, {}, new Status(err.status || 500,
      err.message, err.description));
  }
};

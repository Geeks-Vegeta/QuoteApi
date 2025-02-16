const sessionModel = require("../models/sessionModel");

/**
 *
 * @param {*} payload
 * @returns
 */
async function addSession(payload) {
  try {
    const session = new sessionModel({ ...payload });
    await session.save();
    return session;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  addSession,
};

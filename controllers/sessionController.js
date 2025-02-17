const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const sendResponse = require("../responses/send-response");
const logger = require("../utils/logger");
const sessionService = require("../services/sessionService");
const Pagination = require("../utils/pagination");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getUserSession(req, res, next) {
  try {
    const pageIndex = Number(req.query.pageIndex) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const offset = (pageIndex - 1) * pageSize;
    const { sortColumn, sortDirection, filter } = req.body;
    let sortData = {};
    let filterData = {};
    const pipeline = [];
    let direction = sortDirection === "asc" ? 1 : -1;
    const { user_id } = req.user;

    switch (sortColumn) {
      case "date":
        sortData["createdAt"] = direction; // most recent
        break;
      default:
        sortData["createdAt"] = -1;
    }

    filterData.user = new ObjectId(user_id);

    if (Object.keys(filter).length > 0) {
      //   if ("tag" in filter) {
      //     filterData["tags"] = { $in: [filter.tag] }; // tags
      //   }
    }

    pipeline.push({
      $match: filterData,
    });

    pipeline.push({
      $project: {
        _id: 1,
        user: 1,
        useragent: 1,
        createdAt: 1,
        token: 1,
        valid: 1,
      },
    });
    pipeline.push({
      $sort: sortData,
    });
    pipeline.push({
      $skip: offset,
    });
    pipeline.push({ $limit: pageSize });
    const totalSessionCount = await sessionService.sessionDocumentCount(
      filterData
    );
    const sessionList = await sessionService.sessionAggregate(pipeline);

    const pagination = new Pagination(
      sortColumn,
      sortDirection,
      totalSessionCount,
      pageSize,
      pageIndex
    );

    return sendResponse(req, res, next, sessionList, undefined, pagination);
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
}

module.exports = {
  getUserSession,
};

const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const sendResponse = require("../responses/send-response");
const logger = require("../utils/logger");
const validator = require("../validator/quoteValidator");
const likeService = require("../services/likeService");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.likePost = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { postId } = req.body;

    const post = await likeService.checkPostLikeExists(postId, user_id);
    if (post) {
      throw new ClientError(400, "Already Like");
    }
    await likeService.giveLike(postId, user_id);
    return sendResponse(req, res, next, { message: "post liked" });
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

exports.unLike = async (req, res, next) => {
  try {
    let { user_id } = req.user;
    let { quoteId } = req.body;

    const post = await likeService.checkPostLikeExists(quoteId, user_id);
    if (!post) {
      throw new ClientError(400, "you did not like this post");
    }
    await likeService.giveLike(postId, userId);
    return sendResponse(req, res, next, { message: "post liked" });
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

/*

const Post = require('./models/Post');

// Function to unlike a post
async function unlikePost(req, res) {
  const { postId, userId } = req.body; // postId is the ID of the post, userId is the user unliking it

  try {
    // Check if the user has already liked the post
    const post = await Post.findOne({ _id: postId, "likes.userId": userId });

    if (!post) {
      return res.status(400).json({ message: "You haven't liked this post yet." });
    }

    // Remove the like from the post
    await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          likes: { userId: userId }, // Pull the like object by userId
        },
      },
      { new: true }
    );

    return res.status(200).json({ message: "Post unliked successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}


*/

const quoteModel = require("../models/quoteModel");

// object
var ObjectId = require("mongoose").Types.ObjectId;

const { client } = require("../redis-connection/connection_redis");

// create post
exports.createPost = async (req, res) => {
  let { quote, tags } = req.body;

  const _id = req.name.id;

  // title validation
  const isQuotePresent = await quoteModel.findOne({ quote: quote });
  if (isQuotePresent) return res.json({ message: "Quote Already Present" });

  const new_post = quoteModel({
    quote: quote,
    tags: tags,
    user: _id,
  });

  try {
    await new_post.save();
    res.send(new_post);
  } catch (error) {
    console.log(error);
  }
};

// delete post
exports.deletePost = async (req, res) => {
  let { id } = req.params;
  let user_id = req.name.id;

  const isValidPost = await quoteModel.findOne({ _id: id });

  if (!isValidPost) return res.json({ message: "This post does not exists" });

  try {
    if (user_id == isValidPost.user) {
      await quoteModel.deleteOne({ _id: id });
      res.json({ message: "deleted successfully" });
    } else {
      res.status(404).json({ message: "can't delete" });
    }
  } catch (error) {
    console.log(error);
  }
};

// update post
exports.updatePost = async (req, res) => {
  let { id } = req.params;
  let user_id = req.name.id;

  const isValidPost = await quoteModel.findOne({ _id: id });

  if (!isValidPost) return res.json({ message: "This post does not exists" });

  try {
    if (user_id == isValidPost.user) {
      const update_post = await quoteModel.findByIdAndUpdate(
        { _id: isValidPost._id },
        req.body,
        { new: true }
      );
      res.send(update_post);
    } else {
      res.status(404).json({ message: "can't delete" });
    }
  } catch (error) {
    console.log(error);
  }
};

// get user post by id
exports.getUserPostsById = async (req, res) => {
  let { id } = req.params;

  try {
    const userdata = await quoteModel
      .find({ user: id })
      .sort({ postDateUpdate: -1 });
    res.status(200).send(userdata);
  } catch (error) {
    console.log(error);
  }
};

// most liked posts
exports.getMostLikedPosts = async (req, res) => {
  try {
    const allposts = await quoteModel.find().limit(4).sort({ like: -1 });
    res.send(allposts);
  } catch (error) {
    console.log(error);
  }
};

exports.getMostCommentedPosts = async (req, res) => {
  try {
    const allposts = await quoteModel.find().limit(4).sort({ comments: -1 });
    res.send(allposts);
  } catch (error) {
    console.log(error);
  }
};

exports.getSingleRandomPosts = async (req, res) => {
  try {
    const allposts = await quoteModel.find().populate("user").limit(4);
    res.send(allposts);
  } catch (error) {
    console.log(error);
  }
};

exports.getRandomPosts = async (req, res) => {
  try {
    let randnumber = Math.floor(Math.random() * 10);
    const allposts = await quoteModel.find().limit(20).skip(randnumber);
    const getRes = await client.get("randompost");
    if (getRes) {
      return res.send(JSON.parse(getRes));
    } else {
      await client.set("randompost", JSON.stringify(allposts), "EX", 3600);
      return res.status(200).send(allposts);
    }
  } catch (error) {
    console.log(error);
  }
};

// getAllRecentPosts
exports.getAllRecentPosts = async (req, res) => {
  try {
    const allposts = await quoteModel
      .find()
      .populate("user")
      .sort({ postDateUpdate: -1 });
    // const getRes = await client.get("recentposts");
    // if (getRes){
    //     return res.send(JSON.parse(getRes));
    // }else{
    //     await client.set("recentposts", JSON.stringify(allposts),'EX',3600);
    return res.status(200).send(allposts);
    // }
  } catch (error) {
    console.log(error);
  }
};

// getall usersPost

exports.getAllCurrentUserPosts = async (req, res) => {
  try {
    let user_id = req.name.id;
    const allposts = await quoteModel
      .find({ user: user_id })
      .sort({ postDateUpdate: -1 });
    const getRes = await client.get("currentuserquotes");
    if (getRes) {
      return res.send(JSON.parse(getRes));
    } else {
      await client.set("currentuserquotes", JSON.stringify(allposts));
      return res.status(200).send(allposts);
    }
  } catch (error) {
    console.log(error);
  }
};

// get post by title
exports.getPostByTitle = async (req, res) => {
  let { _id } = req.query;

  try {
    const allpost = await quoteModel
      .findOne({ _id: _id })
      .populate("user")
      .populate({
        path: "comments",
        options: {
          sort: {
            commentDateUpdate: -1,
          },
          populate: {
            path: "user",
          },
        },
      });
    res.status(200).send(allpost);
  } catch (error) {
    console.log(error);
  }
};

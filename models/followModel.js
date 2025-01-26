const mongoose = require("mongoose");

const followSchema = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: "User", required: true },
  following: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: Number,
});

// Create a unique index to avoid duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);
module.exports = Follow;

/*
const followUser = async (followerId, followingId) => {
  try {
    // Check if the user is already following
    const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
    
    if (existingFollow) {
      console.log('You are already following this user.');
      return;
    }

    // Create a new follow record
    const follow = new Follow({
      follower: followerId,
      following: followingId,
    });

    await follow.save();
    console.log('User followed successfully.');
  } catch (err) {
    console.error('Error following user:', err);
  }
};

 */

/*

const unfollowUser = async (followerId, followingId) => {
  try {
    await Follow.deleteOne({ follower: followerId, following: followingId });
    console.log('User unfollowed successfully.');
  } catch (err) {
    console.error('Error unfollowing user:', err);
  }
};
*/

/*

// Get all followers of a user
const getFollowers = async (userId) => {
  const followers = await Follow.find({ following: userId }).populate('follower', 'username email');
  return followers;
};

// Get all users a user is following
const getFollowing = async (userId) => {
  const following = await Follow.find({ follower: userId }).populate('following', 'username email');
  return following;
};
*/

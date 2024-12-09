// models/MessageModels/MessageSchema.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    // Optional attachment support
    attachment: {
      url: String,
      type: {
        type: String,
        enum: ["image", "file"],
      },
    },
  },
  { timestamps: true }
);

// Indexes for performance
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, read: 1 });

// Get conversation between two users
messageSchema.statics.getConversation = async function (
  userOneId,
  userTwoId,
  limit = 50
) {
  const messages = await this.find({
    $or: [
      { sender: userOneId, receiver: userTwoId },
      { sender: userTwoId, receiver: userOneId },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("sender", "username name avatarUrl")
    .populate("receiver", "username name avatarUrl");

  return messages;
};

// Get all conversations for a user
messageSchema.statics.getUserConversations = async function (userId) {
  const conversations = await this.aggregate([
    {
      $match: {
        $or: [
          { sender: new mongoose.Types.ObjectId(userId) },
          { receiver: new mongoose.Types.ObjectId(userId) },
        ],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
            then: "$receiver",
            else: "$sender",
          },
        },
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiver", new mongoose.Types.ObjectId(userId)] },
                  { $eq: ["$read", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "otherUser",
      },
    },
    {
      $unwind: "$otherUser",
    },
    {
      $project: {
        otherUser: {
          _id: 1,
          username: 1,
          name: 1,
          avatarUrl: 1,
        },
        lastMessage: 1,
        unreadCount: 1,
      },
    },
  ]);

  return conversations;
};

// Mark messages as read
messageSchema.statics.markAsRead = async function (senderId, receiverId) {
  const result = await this.updateMany(
    {
      sender: senderId,
      receiver: receiverId,
      read: false,
    },
    {
      $set: { read: true },
    }
  );

  return result;
};

// Delete a message
messageSchema.methods.deleteMessage = async function () {
  await this.deleteOne();
};

const Message = mongoose.model("Message", messageSchema, "messages");

export default Message;

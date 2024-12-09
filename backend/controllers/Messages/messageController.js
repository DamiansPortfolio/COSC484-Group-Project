import Message from "../../models/MessageModels/MessageSchema.js"
import User from "../../models/UserModels/UserSchema.js"

// Time window for message deletion (5 minutes)
const MESSAGE_DELETE_WINDOW = 5 * 60 * 1000

const messageController = {
  // Get all conversations for a user
  getUserConversations: async (req, res) => {
    try {
      const conversations = await Message.getUserConversations(req.user.id)
      res.status(200).json(conversations)
    } catch (error) {
      console.error("Get conversations error:", error)
      res.status(500).json({ message: "Failed to get conversations" })
    }
  },

  // Get conversation with specific user
  getConversation: async (req, res) => {
    try {
      const otherUserId = req.params.userId

      // Verify other user exists
      const otherUser = await User.findById(otherUserId)
      if (!otherUser) {
        return res.status(404).json({ message: "User not found" })
      }

      const messages = await Message.getConversation(req.user.id, otherUserId)

      // Mark messages from other user as read when fetching conversation
      await Message.markAsRead(otherUserId, req.user.id)

      res.status(200).json(messages)
    } catch (error) {
      console.error("Get conversation error:", error)
      res.status(500).json({ message: "Failed to get conversation" })
    }
  },

  // Send a new message
  sendMessage: async (req, res) => {
    try {
      const { receiverId, content, attachment } = req.body

      // Validate content
      if (!content?.trim()) {
        return res.status(400).json({ message: "Message content is required" })
      }

      // Verify receiver exists
      const receiver = await User.findById(receiverId)
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" })
      }

      // Create and populate message
      const message = await Message.create({
        sender: req.user.id,
        receiver: receiverId,
        content: content.trim(),
        attachment,
      })

      // Populate sender and receiver details
      await message.populate([
        { path: "sender", select: "username name avatarUrl" },
        { path: "receiver", select: "username name avatarUrl" },
      ])

      res.status(201).json(message)
    } catch (error) {
      console.error("Send message error:", error)
      res.status(500).json({ message: "Failed to send message" })
    }
  },

  // Delete a message
  deleteMessage: async (req, res) => {
    try {
      const message = await Message.findById(req.params.messageId)

      if (!message) {
        return res.status(404).json({ message: "Message not found" })
      }

      // Check if user owns the message
      if (message.sender.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Cannot delete messages from other users" })
      }

      // Instead of soft delete, actually delete the message
      await Message.deleteOne({ _id: message._id })
      res.status(200).json({ message: "Message deleted successfully" })
    } catch (error) {
      console.error("Delete message error:", error)
      res.status(500).json({ message: "Failed to delete message" })
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (req, res) => {
    try {
      const senderId = req.params.senderId

      // Mark messages as read
      await Message.markAsRead(senderId, req.user.id)

      // Get updated conversations to reflect new read status
      const conversations = await Message.getUserConversations(req.user.id)

      res.status(200).json({
        success: true,
        conversations,
      })
    } catch (error) {
      console.error("Mark as read error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to mark messages as read",
      })
    }
  },
}

export default messageController

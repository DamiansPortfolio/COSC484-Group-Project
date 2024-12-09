// routes/MessageRoutes/messageRoutes.js
import express from "express";
import messageController from "../../controllers/Messages/messageController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Protect all message routes with authentication
router.use(verifyToken);

// Define routes with their handlers
router.get("/conversations", messageController.getUserConversations);
router.get("/conversation/:userId", messageController.getConversation);
router.post("/send", messageController.sendMessage);
router.delete("/:messageId", messageController.deleteMessage);
router.post("/mark-read/:senderId", messageController.markMessagesAsRead);

export default router;

import { catchAsync } from "../../shared/catchAsync.js";
import { chatService } from "./chat.service.js";
import { sendResponse } from "../../shared/sendResponse.js";
import status from "http-status";
const startConversation = catchAsync(async (req, res) => {
    const result = await chatService.startConversation(req.user.userId, req.body.eventId);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Conversation started successfully",
        data: result,
    });
});
const getMyConversations = catchAsync(async (req, res) => {
    const result = await chatService.getMyConversations(req.user.userId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Conversations retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getMessages = catchAsync(async (req, res) => {
    const result = await chatService.getMessages(req.params.conversationId, req.user.userId, req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Messages retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const sendMessage = catchAsync(async (req, res) => {
    const result = await chatService.sendMessage(req.params.conversationId, req.user.userId, req.body.content);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Message sent successfully",
        data: result,
    });
});
const markMessagesAsRead = catchAsync(async (req, res) => {
    const count = await chatService.markMessagesAsRead(req.params.conversationId, req.user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: `${count} messages marked as read`,
    });
});
export const chatController = {
    startConversation,
    getMyConversations,
    getMessages,
    sendMessage,
    markMessagesAsRead,
};
//# sourceMappingURL=chat.controller.js.map
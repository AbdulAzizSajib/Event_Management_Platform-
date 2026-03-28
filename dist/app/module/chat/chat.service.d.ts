import { Conversation, Message } from "../../../generated/prisma/client";
import { IQueryParams, IQueryResult } from "../../interfaces/query.interface";
export declare const chatService: {
    startConversation: (userId: string, eventId: string) => Promise<Conversation>;
    getMyConversations: (userId: string, query: IQueryParams) => Promise<IQueryResult<Conversation>>;
    getMessages: (conversationId: string, userId: string, query: IQueryParams) => Promise<IQueryResult<Message>>;
    sendMessage: (conversationId: string, senderId: string, content: string) => Promise<Message>;
    markMessagesAsRead: (conversationId: string, userId: string) => Promise<number>;
};
//# sourceMappingURL=chat.service.d.ts.map
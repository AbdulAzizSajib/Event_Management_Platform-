import { Request, Response } from "express";
export declare const chatController: {
    startConversation: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyConversations: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMessages: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    sendMessage: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    markMessagesAsRead: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=chat.controller.d.ts.map
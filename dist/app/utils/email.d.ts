interface ISendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, unknown>;
    attachments?: {
        filename: string;
        content: Buffer;
        contentType: string;
    }[];
}
export declare const sendEmail: (options: ISendEmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=email.d.ts.map
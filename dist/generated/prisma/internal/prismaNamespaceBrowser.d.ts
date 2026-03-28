import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client/runtime/client").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client/runtime/client").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client/runtime/client").AnyNullClass;
export declare const ModelName: {
    readonly Admin: "Admin";
    readonly User: "User";
    readonly Session: "Session";
    readonly Account: "Account";
    readonly Verification: "Verification";
    readonly Category: "Category";
    readonly Conversation: "Conversation";
    readonly Message: "Message";
    readonly Event: "Event";
    readonly Invitation: "Invitation";
    readonly Participant: "Participant";
    readonly Payment: "Payment";
    readonly Review: "Review";
    readonly SavedEvent: "SavedEvent";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const AdminScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly profilePhoto: "profilePhoto";
    readonly contactNumber: "contactNumber";
    readonly address: "address";
    readonly gender: "gender";
    readonly isDeleted: "isDeleted";
    readonly deletedAt: "deletedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly userId: "userId";
};
export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly emailVerified: "emailVerified";
    readonly image: "image";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly role: "role";
    readonly phone: "phone";
    readonly status: "status";
    readonly needPasswordChange: "needPasswordChange";
    readonly isDeleted: "isDeleted";
    readonly deletedAt: "deletedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: "id";
    readonly expiresAt: "expiresAt";
    readonly token: "token";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly ipAddress: "ipAddress";
    readonly userAgent: "userAgent";
    readonly userId: "userId";
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const AccountScalarFieldEnum: {
    readonly id: "id";
    readonly accountId: "accountId";
    readonly providerId: "providerId";
    readonly userId: "userId";
    readonly accessToken: "accessToken";
    readonly refreshToken: "refreshToken";
    readonly idToken: "idToken";
    readonly accessTokenExpiresAt: "accessTokenExpiresAt";
    readonly refreshTokenExpiresAt: "refreshTokenExpiresAt";
    readonly scope: "scope";
    readonly password: "password";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];
export declare const VerificationScalarFieldEnum: {
    readonly id: "id";
    readonly identifier: "identifier";
    readonly value: "value";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly icon: "icon";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const ConversationScalarFieldEnum: {
    readonly id: "id";
    readonly eventId: "eventId";
    readonly userId: "userId";
    readonly organizerId: "organizerId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum];
export declare const MessageScalarFieldEnum: {
    readonly id: "id";
    readonly conversationId: "conversationId";
    readonly senderId: "senderId";
    readonly content: "content";
    readonly isRead: "isRead";
    readonly createdAt: "createdAt";
};
export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum];
export declare const EventScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly date: "date";
    readonly time: "time";
    readonly venue: "venue";
    readonly eventLink: "eventLink";
    readonly type: "type";
    readonly fee: "fee";
    readonly maxAttendees: "maxAttendees";
    readonly image: "image";
    readonly isFeatured: "isFeatured";
    readonly categoryId: "categoryId";
    readonly organizerId: "organizerId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum];
export declare const InvitationScalarFieldEnum: {
    readonly id: "id";
    readonly status: "status";
    readonly eventId: "eventId";
    readonly inviterId: "inviterId";
    readonly inviteeId: "inviteeId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InvitationScalarFieldEnum = (typeof InvitationScalarFieldEnum)[keyof typeof InvitationScalarFieldEnum];
export declare const ParticipantScalarFieldEnum: {
    readonly id: "id";
    readonly status: "status";
    readonly eventId: "eventId";
    readonly userId: "userId";
    readonly joinedAt: "joinedAt";
    readonly updatedAt: "updatedAt";
};
export type ParticipantScalarFieldEnum = (typeof ParticipantScalarFieldEnum)[keyof typeof ParticipantScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly amount: "amount";
    readonly method: "method";
    readonly status: "status";
    readonly transactionId: "transactionId";
    readonly stripeEventId: "stripeEventId";
    readonly gatewayData: "gatewayData";
    readonly userId: "userId";
    readonly eventId: "eventId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const ReviewScalarFieldEnum: {
    readonly id: "id";
    readonly rating: "rating";
    readonly comment: "comment";
    readonly eventId: "eventId";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum];
export declare const SavedEventScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly eventId: "eventId";
    readonly savedAt: "savedAt";
};
export type SavedEventScalarFieldEnum = (typeof SavedEventScalarFieldEnum)[keyof typeof SavedEventScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client/runtime/client").DbNullClass;
    readonly JsonNull: import("@prisma/client/runtime/client").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client/runtime/client").DbNullClass;
    readonly JsonNull: import("@prisma/client/runtime/client").JsonNullClass;
    readonly AnyNull: import("@prisma/client/runtime/client").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map
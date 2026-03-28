
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app/server.ts
import { createServer } from "http";

// src/app/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP, oAuthProxy } from "better-auth/plugins";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Admin {\n  id String @id @default(uuid(7))\n\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n  gender        Gender?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // relation with User as Admin\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([email], name: "idx_admin_email")\n  @@index([isDeleted], name: "idx_admin_isDeleted")\n  @@map("admins")\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  // additional fields\n  role               Role       @default(USER)\n  phone              String?\n  status             UserStatus @default(ACTIVE)\n  needPasswordChange Boolean    @default(false)\n  isDeleted          Boolean    @default(false)\n  deletedAt          DateTime?\n\n  // relation with Admin\n  admin Admin?\n\n  // relations with Event Management models\n  organizedEvents        Event[]        @relation("OrganizerEvents")\n  participants           Participant[]\n  payments               Payment[]\n  invitations            Invitation[]   @relation("InviterRelation")\n  invitedTo              Invitation[]   @relation("InviteeRelation")\n  reviews                Review[]\n  savedEvents            SavedEvent[]\n  userConversations      Conversation[] @relation("UserConversations")\n  organizerConversations Conversation[] @relation("OrganizerConversations")\n  sentMessages           Message[]      @relation("SentMessages")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id   String  @id @default(uuid())\n  name String  @unique\n  icon String? // optional icon URL\n\n  events Event[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("categories")\n}\n\nmodel Conversation {\n  id String @id @default(uuid())\n\n  eventId String\n  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  userId String // The user who initiated the chat\n  user   User   @relation("UserConversations", fields: [userId], references: [id], onDelete: Cascade)\n\n  organizerId String // Event organizer\n  organizer   User   @relation("OrganizerConversations", fields: [organizerId], references: [id], onDelete: Cascade)\n\n  messages Message[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([eventId, userId]) // One conversation per user per event\n  @@map("conversations")\n}\n\nmodel Message {\n  id String @id @default(uuid())\n\n  conversationId String\n  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)\n\n  senderId String\n  sender   User   @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)\n\n  content String\n  isRead  Boolean @default(false)\n\n  createdAt DateTime @default(now())\n\n  @@index([conversationId])\n  @@map("messages")\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  USER\n}\n\nenum UserStatus {\n  BLOCKED\n  DELETED\n  ACTIVE\n}\n\nenum Gender {\n  MALE\n  FEMALE\n}\n\nenum EventType {\n  PUBLIC\n  PRIVATE\n}\n\nenum ParticipantStatus {\n  PENDING // Payment done / request sent \u2014 waiting for host approval\n  APPROVED // Host approved\n  REJECTED // Host rejected\n  BANNED // Host banned this participant\n}\n\nenum PaymentStatus {\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nenum PaymentMethod {\n  STRIPE\n  SSLCOMMERZ\n  SHURJOPAY\n}\n\nenum InvitationStatus {\n  PENDING\n  ACCEPTED\n  DECLINED\n}\n\nmodel Event {\n  id           String    @id @default(uuid())\n  title        String\n  description  String\n  date         DateTime\n  time         String // e.g. "10:00 AM"\n  venue        String? // Physical location (nullable if online)\n  eventLink    String? // Online meeting link (nullable if physical)\n  type         EventType @default(PUBLIC)\n  fee          Decimal   @default(0) @db.Decimal(10, 2) // 0 = Free\n  maxAttendees Int? // null = unlimited\n  image        String? // Event banner/cover image URL\n  isFeatured   Boolean   @default(false) // Admin selects for homepage hero\n\n  categoryId String?\n  category   Category? @relation(fields: [categoryId], references: [id])\n\n  organizerId String\n  organizer   User   @relation("OrganizerEvents", fields: [organizerId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n  participants  Participant[]\n  payments      Payment[]\n  invitations   Invitation[]\n  reviews       Review[]\n  savedBy       SavedEvent[]\n  conversations Conversation[]\n\n  @@map("events")\n}\n\nmodel Invitation {\n  id     String           @id @default(uuid())\n  status InvitationStatus @default(PENDING)\n\n  eventId String\n  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  inviterId String\n  inviter   User   @relation("InviterRelation", fields: [inviterId], references: [id], onDelete: Cascade)\n\n  inviteeId String\n  invitee   User   @relation("InviteeRelation", fields: [inviteeId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // One user can only be invited once per event\n  @@unique([eventId, inviteeId])\n  @@map("invitations")\n}\n\nmodel Participant {\n  id     String            @id @default(uuid())\n  status ParticipantStatus @default(PENDING)\n\n  eventId String\n  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  joinedAt  DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // One user can only have one participation record per event\n  @@unique([eventId, userId])\n  @@map("participants")\n}\n\nmodel Payment {\n  id            String        @id @default(uuid())\n  amount        Decimal       @db.Decimal(10, 2)\n  method        PaymentMethod\n  status        PaymentStatus @default(PENDING)\n  transactionId String?       @unique // Stripe session ID\n  stripeEventId String?       @unique // Stripe event ID for idempotency\n  gatewayData   Json? // Raw response from gateway (optional)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  eventId String\n  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("payments")\n}\n\nmodel Review {\n  id      String @id @default(uuid())\n  rating  Int // 1 to 5\n  comment String\n\n  eventId String\n  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // One user can only review an event once\n  @@unique([eventId, userId])\n  @@map("reviews")\n}\n\nmodel SavedEvent {\n  id      String @id @default(uuid())\n  userId  String\n  eventId String\n\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  savedAt DateTime @default(now())\n\n  @@unique([userId, eventId])\n  @@index([userId])\n  @@index([eventId])\n  @@map("saved_events")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admins"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"organizedEvents","kind":"object","type":"Event","relationName":"OrganizerEvents"},{"name":"participants","kind":"object","type":"Participant","relationName":"ParticipantToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"InviterRelation"},{"name":"invitedTo","kind":"object","type":"Invitation","relationName":"InviteeRelation"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"savedEvents","kind":"object","type":"SavedEvent","relationName":"SavedEventToUser"},{"name":"userConversations","kind":"object","type":"Conversation","relationName":"UserConversations"},{"name":"organizerConversations","kind":"object","type":"Conversation","relationName":"OrganizerConversations"},{"name":"sentMessages","kind":"object","type":"Message","relationName":"SentMessages"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"events","kind":"object","type":"Event","relationName":"CategoryToEvent"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"Conversation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"ConversationToEvent"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserConversations"},{"name":"organizerId","kind":"scalar","type":"String"},{"name":"organizer","kind":"object","type":"User","relationName":"OrganizerConversations"},{"name":"messages","kind":"object","type":"Message","relationName":"ConversationToMessage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"conversations"},"Message":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"conversationId","kind":"scalar","type":"String"},{"name":"conversation","kind":"object","type":"Conversation","relationName":"ConversationToMessage"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"sender","kind":"object","type":"User","relationName":"SentMessages"},{"name":"content","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"messages"},"Event":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"time","kind":"scalar","type":"String"},{"name":"venue","kind":"scalar","type":"String"},{"name":"eventLink","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"EventType"},{"name":"fee","kind":"scalar","type":"Decimal"},{"name":"maxAttendees","kind":"scalar","type":"Int"},{"name":"image","kind":"scalar","type":"String"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToEvent"},{"name":"organizerId","kind":"scalar","type":"String"},{"name":"organizer","kind":"object","type":"User","relationName":"OrganizerEvents"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"participants","kind":"object","type":"Participant","relationName":"EventToParticipant"},{"name":"payments","kind":"object","type":"Payment","relationName":"EventToPayment"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"EventToInvitation"},{"name":"reviews","kind":"object","type":"Review","relationName":"EventToReview"},{"name":"savedBy","kind":"object","type":"SavedEvent","relationName":"EventToSavedEvent"},{"name":"conversations","kind":"object","type":"Conversation","relationName":"ConversationToEvent"}],"dbName":"events"},"Invitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToInvitation"},{"name":"inviterId","kind":"scalar","type":"String"},{"name":"inviter","kind":"object","type":"User","relationName":"InviterRelation"},{"name":"inviteeId","kind":"scalar","type":"String"},{"name":"invitee","kind":"object","type":"User","relationName":"InviteeRelation"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"invitations"},"Participant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ParticipantStatus"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToParticipant"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ParticipantToUser"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"participants"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"gatewayData","kind":"scalar","type":"Json"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToReview"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"SavedEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SavedEventToUser"},{"name":"event","kind":"object","type":"Event","relationName":"EventToSavedEvent"},{"name":"savedAt","kind":"scalar","type":"DateTime"}],"dbName":"saved_events"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","admin","events","_count","category","organizer","event","participants","payments","inviter","invitee","invitations","reviews","savedBy","conversation","sender","messages","conversations","organizedEvents","invitedTo","savedEvents","userConversations","organizerConversations","sentMessages","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Conversation.findUnique","Conversation.findUniqueOrThrow","Conversation.findFirst","Conversation.findFirstOrThrow","Conversation.findMany","Conversation.createOne","Conversation.createMany","Conversation.createManyAndReturn","Conversation.updateOne","Conversation.updateMany","Conversation.updateManyAndReturn","Conversation.upsertOne","Conversation.deleteOne","Conversation.deleteMany","Conversation.groupBy","Conversation.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","Event.findUnique","Event.findUniqueOrThrow","Event.findFirst","Event.findFirstOrThrow","Event.findMany","Event.createOne","Event.createMany","Event.createManyAndReturn","Event.updateOne","Event.updateMany","Event.updateManyAndReturn","Event.upsertOne","Event.deleteOne","Event.deleteMany","_avg","_sum","Event.groupBy","Event.aggregate","Invitation.findUnique","Invitation.findUniqueOrThrow","Invitation.findFirst","Invitation.findFirstOrThrow","Invitation.findMany","Invitation.createOne","Invitation.createMany","Invitation.createManyAndReturn","Invitation.updateOne","Invitation.updateMany","Invitation.updateManyAndReturn","Invitation.upsertOne","Invitation.deleteOne","Invitation.deleteMany","Invitation.groupBy","Invitation.aggregate","Participant.findUnique","Participant.findUniqueOrThrow","Participant.findFirst","Participant.findFirstOrThrow","Participant.findMany","Participant.createOne","Participant.createMany","Participant.createManyAndReturn","Participant.updateOne","Participant.updateMany","Participant.updateManyAndReturn","Participant.upsertOne","Participant.deleteOne","Participant.deleteMany","Participant.groupBy","Participant.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","SavedEvent.findUnique","SavedEvent.findUniqueOrThrow","SavedEvent.findFirst","SavedEvent.findFirstOrThrow","SavedEvent.findMany","SavedEvent.createOne","SavedEvent.createMany","SavedEvent.createManyAndReturn","SavedEvent.updateOne","SavedEvent.updateMany","SavedEvent.updateManyAndReturn","SavedEvent.upsertOne","SavedEvent.deleteOne","SavedEvent.deleteMany","SavedEvent.groupBy","SavedEvent.aggregate","AND","OR","NOT","id","userId","eventId","savedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","rating","comment","createdAt","updatedAt","amount","PaymentMethod","method","PaymentStatus","status","transactionId","stripeEventId","gatewayData","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","ParticipantStatus","joinedAt","InvitationStatus","inviterId","inviteeId","title","description","date","time","venue","eventLink","EventType","type","fee","maxAttendees","image","isFeatured","categoryId","organizerId","conversationId","senderId","content","isRead","name","icon","every","some","none","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","Role","role","phone","UserStatus","needPasswordChange","isDeleted","deletedAt","profilePhoto","contactNumber","address","Gender","gender","eventId_userId","userId_eventId","eventId_inviteeId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "9wd74AEQAwAA5AMAIIUCAAD8AwAwhgIAAAsAEIcCAAD8AwAwiAIBAAAAAYkCAQAAAAGZAkAAvgMAIZoCQAC-AwAhwAIBAMIDACHUAgEAAAAB2wIgANADACHcAkAA0wMAId0CAQC9AwAh3gIBAL0DACHfAgEAvQMAIeECAAD9A-ECIwEAAAABACAMAwAA5AMAIIUCAAD_AwAwhgIAAAMAEIcCAAD_AwAwiAIBAMIDACGJAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHHAkAAvgMAIdECAQDCAwAh0gIBAL0DACHTAgEAvQMAIQMDAAD3BgAg0gIAAJMEACDTAgAAkwQAIAwDAADkAwAghQIAAP8DADCGAgAAAwAQhwIAAP8DADCIAgEAAAABiQIBAMIDACGZAkAAvgMAIZoCQAC-AwAhxwJAAL4DACHRAgEAAAAB0gIBAL0DACHTAgEAvQMAIQMAAAADACABAAAEADACAAAFACARAwAA5AMAIIUCAAD-AwAwhgIAAAcAEIcCAAD-AwAwiAIBAMIDACGJAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHIAgEAwgMAIckCAQDCAwAhygIBAL0DACHLAgEAvQMAIcwCAQC9AwAhzQJAANMDACHOAkAA0wMAIc8CAQC9AwAh0AIBAL0DACEIAwAA9wYAIMoCAACTBAAgywIAAJMEACDMAgAAkwQAIM0CAACTBAAgzgIAAJMEACDPAgAAkwQAINACAACTBAAgEQMAAOQDACCFAgAA_gMAMIYCAAAHABCHAgAA_gMAMIgCAQAAAAGJAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHIAgEAwgMAIckCAQDCAwAhygIBAL0DACHLAgEAvQMAIcwCAQC9AwAhzQJAANMDACHOAkAA0wMAIc8CAQC9AwAh0AIBAL0DACEDAAAABwAgAQAACAAwAgAACQAgEAMAAOQDACCFAgAA_AMAMIYCAAALABCHAgAA_AMAMIgCAQDCAwAhiQIBAMIDACGZAkAAvgMAIZoCQAC-AwAhwAIBAMIDACHUAgEAwgMAIdsCIADQAwAh3AJAANMDACHdAgEAvQMAId4CAQC9AwAh3wIBAL0DACHhAgAA_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_AiAA0AMAIQMAAAAtACABAAAuADACAAAvACABAAAALQAgAQAAABUAIAEAAAAZACABAAAAHQAgAQAAACEAIAEAAAAlACABAAAAKQAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAZACABAAAaADACAAAbACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAAAhACABAAAiADACAAAjACADAAAAJQAgAQAAJgAwAgAAJwAgAwAAACkAIAEAACoAMAIAACsAIAMAAAApACABAAAqADACAAArACADAAAALQAgAQAALgAwAgAALwAgAQAAAAMAIAEAAAAHACABAAAADQAgAQAAABUAIAEAAAAZACABAAAAHQAgAQAAAB0AIAEAAAAhACABAAAAJQAgAQAAACkAIAEAAAApACABAAAALQAgAQAAAAEAIAYDAAD3BgAg3AIAAJMEACDdAgAAkwQAIN4CAACTBAAg3wIAAJMEACDhAgAAkwQAIAMAAAALACABAABOADACAAABACADAAAACwAgAQAATgAwAgAAAQAgAwAAAAsAIAEAAE4AMAIAAAEAIA0DAAD2BgAgiAIBAAAAAYkCAQAAAAGZAkAAAAABmgJAAAAAAcACAQAAAAHUAgEAAAAB2wIgAAAAAdwCQAAAAAHdAgEAAAAB3gIBAAAAAd8CAQAAAAHhAgAAAOECAwEiAABSACAMiAIBAAAAAYkCAQAAAAGZAkAAAAABmgJAAAAAAcACAQAAAAHUAgEAAAAB2wIgAAAAAdwCQAAAAAHdAgEAAAAB3gIBAAAAAd8CAQAAAAHhAgAAAOECAwEiAABUADABIgAAVAAwDQMAAPUGACCIAgEAgwQAIYkCAQCDBAAhmQJAAIQEACGaAkAAhAQAIcACAQCDBAAh1AIBAIMEACHbAiAAugQAIdwCQADJBQAh3QIBAJwEACHeAgEAnAQAId8CAQCcBAAh4QIAAMIG4QIjAgAAAAEAICIAAFcAIAyIAgEAgwQAIYkCAQCDBAAhmQJAAIQEACGaAkAAhAQAIcACAQCDBAAh1AIBAIMEACHbAiAAugQAIdwCQADJBQAh3QIBAJwEACHeAgEAnAQAId8CAQCcBAAh4QIAAMIG4QIjAgAAAAsAICIAAFkAIAIAAAALACAiAABZACADAAAAAQAgKQAAUgAgKgAAVwAgAQAAAAEAIAEAAAALACAICAAA8gYAIC8AAPQGACAwAADzBgAg3AIAAJMEACDdAgAAkwQAIN4CAACTBAAg3wIAAJMEACDhAgAAkwQAIA-FAgAA3gMAMIYCAABgABCHAgAA3gMAMIgCAQCMAwAhiQIBAIwDACGZAkAAjQMAIZoCQACNAwAhwAIBAIwDACHUAgEAjAMAIdsCIACyAwAh3AJAAMQDACHdAgEAmwMAId4CAQCbAwAh3wIBAJsDACHhAgAA3wPhAiMDAAAACwAgAQAAXwAwLgAAYAAgAwAAAAsAIAEAAE4AMAIAAAEAIB0EAADUAwAgBQAA1QMAIAYAANYDACAMAADXAwAgDQAA2AMAIBAAANkDACARAADaAwAgFwAAvwMAIBgAANkDACAZAADbAwAgGgAA3AMAIBsAANwDACAcAADdAwAghQIAAM8DADCGAgAAZgAQhwIAAM8DADCIAgEAAAABmQJAAL4DACGaAkAAvgMAIZ8CAADSA9oCIrgCAQC9AwAhwAIBAMIDACHUAgEAAAAB1QIgANADACHXAgAA0QPXAiLYAgEAvQMAIdoCIADQAwAh2wIgANADACHcAkAA0wMAIQEAAABjACABAAAAYwAgHQQAANQDACAFAADVAwAgBgAA1gMAIAwAANcDACANAADYAwAgEAAA2QMAIBEAANoDACAXAAC_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-AwAhxQIBAMIDACHGAgEAwgMAIccCQAC-AwAhAQAAAKgBACABAAAAqAEAIAmFAgAAwQMAMIYCAACrAQAQhwIAAMEDADCIAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHFAgEAwgMAIcYCAQDCAwAhxwJAAL4DACEAAwAAAKsBACABAACsAQAwAgAAqAEAIAMAAACrAQAgAQAArAEAMAIAAKgBACADAAAAqwEAIAEAAKwBADACAACoAQAgBogCAQAAAAGZAkAAAAABmgJAAAAAAcUCAQAAAAHGAgEAAAABxwJAAAAAAQEiAACwAQAgBogCAQAAAAGZAkAAAAABmgJAAAAAAcUCAQAAAAHGAgEAAAABxwJAAAAAAQEiAACyAQAwASIAALIBADAGiAIBAIMEACGZAkAAhAQAIZoCQACEBAAhxQIBAIMEACHGAgEAgwQAIccCQACEBAAhAgAAAKgBACAiAAC1AQAgBogCAQCDBAAhmQJAAIQEACGaAkAAhAQAIcUCAQCDBAAhxgIBAIMEACHHAkAAhAQAIQIAAACrAQAgIgAAtwEAIAIAAACrAQAgIgAAtwEAIAMAAACoAQAgKQAAsAEAICoAALUBACABAAAAqAEAIAEAAACrAQAgAwgAAMMFACAvAADFBQAgMAAAxAUAIAmFAgAAwAMAMIYCAAC-AQAQhwIAAMADADCIAgEAjAMAIZkCQACNAwAhmgJAAI0DACHFAgEAjAMAIcYCAQCMAwAhxwJAAI0DACEDAAAAqwEAIAEAAL0BADAuAAC-AQAgAwAAAKsBACABAACsAQAwAgAAqAEAIAkHAAC_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_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_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_AIAMAEiAAD8AgAwBgMAAIUEACALAACGBAAgiAIBAIMEACGJAgEAgwQAIYoCAQCDBAAhiwJAAIQEACECAAAAJwAgIgAA_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_AiAAsgMAIQmFAgAAugMAMIYCAADsAQAQhwIAALoDADCIAgEAjAMAIYkCAQCMAwAhigIBAIwDACGZAkAAjQMAIZoCQACNAwAhuwIBAIwDACEIhQIAALsDADCGAgAA1gEAEIcCAAC7AwAwiAIBAIwDACGZAkAAjQMAIZoCQACNAwAhwAIBAIwDACHBAgEAmwMAIQkHAAC_AwAghQIAALwDADCGAgAAEQAQhwIAALwDADCIAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHAAgEAwgMAIcECAQC9AwAhC4wCAQAAAAGNAgEAAAAFjgIBAAAABY8CAQAAAAGQAgEAAAABkQIBAAAAAZICAQAAAAGTAgEAoAMAIZQCAQAAAAGVAgEAAAABlgIBAAAAAQiMAkAAAAABjQJAAAAABI4CQAAAAASPAkAAAAABkAJAAAAAAZECQAAAAAGSAkAAAAABkwJAAJADACEDwgIAAA0AIMMCAAANACDEAgAADQAgCYUCAADAAwAwhgIAAL4BABCHAgAAwAMAMIgCAQCMAwAhmQJAAI0DACGaAkAAjQMAIcUCAQCMAwAhxgIBAIwDACHHAkAAjQMAIQmFAgAAwQMAMIYCAACrAQAQhwIAAMEDADCIAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHFAgEAwgMAIcYCAQDCAwAhxwJAAL4DACELjAIBAAAAAY0CAQAAAASOAgEAAAAEjwIBAAAAAZACAQAAAAGRAgEAAAABkgIBAAAAAZMCAQCSAwAhlAIBAAAAAZUCAQAAAAGWAgEAAAABEIUCAADDAwAwhgIAAKUBABCHAgAAwwMAMIgCAQCMAwAhiQIBAIwDACGZAkAAjQMAIZoCQACNAwAhyAIBAIwDACHJAgEAjAMAIcoCAQCbAwAhywIBAJsDACHMAgEAmwMAIc0CQADEAwAhzgJAAMQDACHPAgEAmwMAIdACAQCbAwAhCwgAAJ0DACAvAADGAwAgMAAAxgMAIIwCQAAAAAGNAkAAAAAFjgJAAAAABY8CQAAAAAGQAkAAAAABkQJAAAAAAZICQAAAAAGTAkAAxQMAIQsIAACdAwAgLwAAxgMAIDAAAMYDACCMAkAAAAABjQJAAAAABY4CQAAAAAWPAkAAAAABkAJAAAAAAZECQAAAAAGSAkAAAAABkwJAAMUDACEIjAJAAAAAAY0CQAAAAAWOAkAAAAAFjwJAAAAAAZACQAAAAAGRAkAAAAABkgJAAAAAAZMCQADGAwAhC4UCAADHAwAwhgIAAI8BABCHAgAAxwMAMIgCAQCMAwAhiQIBAIwDACGZAkAAjQMAIZoCQACNAwAhxwJAAI0DACHRAgEAjAMAIdICAQCbAwAh0wIBAJsDACEQhQIAAMgDADCGAgAAeQAQhwIAAMgDADCIAgEAjAMAIZkCQACNAwAhmgJAAI0DACGfAgAAygPaAiK4AgEAmwMAIcACAQCMAwAh1AIBAIwDACHVAiAAsgMAIdcCAADJA9cCItgCAQCbAwAh2gIgALIDACHbAiAAsgMAIdwCQADEAwAhBwgAAI8DACAvAADOAwAgMAAAzgMAIIwCAAAA1wICjQIAAADXAgiOAgAAANcCCJMCAADNA9cCIgcIAACPAwAgLwAAzAMAIDAAAMwDACCMAgAAANoCAo0CAAAA2gIIjgIAAADaAgiTAgAAywPaAiIHCAAAjwMAIC8AAMwDACAwAADMAwAgjAIAAADaAgKNAgAAANoCCI4CAAAA2gIIkwIAAMsD2gIiBIwCAAAA2gICjQIAAADaAgiOAgAAANoCCJMCAADMA9oCIgcIAACPAwAgLwAAzgMAIDAAAM4DACCMAgAAANcCAo0CAAAA1wIIjgIAAADXAgiTAgAAzQPXAiIEjAIAAADXAgKNAgAAANcCCI4CAAAA1wIIkwIAAM4D1wIiHQQAANQDACAFAADVAwAgBgAA1gMAIAwAANcDACANAADYAwAgEAAA2QMAIBEAANoDACAXAAC_AwAgGAAA2QMAIBkAANsDACAaAADcAwAgGwAA3AMAIBwAAN0DACCFAgAAzwMAMIYCAABmABCHAgAAzwMAMIgCAQDCAwAhmQJAAL4DACGaAkAAvgMAIZ8CAADSA9oCIrgCAQC9AwAhwAIBAMIDACHUAgEAwgMAIdUCIADQAwAh1wIAANED1wIi2AIBAL0DACHaAiAA0AMAIdsCIADQAwAh3AJAANMDACECjAIgAAAAAZMCIAC0AwAhBIwCAAAA1wICjQIAAADXAgiOAgAAANcCCJMCAADOA9cCIgSMAgAAANoCAo0CAAAA2gIIjgIAAADaAgiTAgAAzAPaAiIIjAJAAAAAAY0CQAAAAAWOAkAAAAAFjwJAAAAAAZACQAAAAAGRAkAAAAABkgJAAAAAAZMCQADGAwAhA8ICAAADACDDAgAAAwAgxAIAAAMAIAPCAgAABwAgwwIAAAcAIMQCAAAHACASAwAA5AMAIIUCAAD8AwAwhgIAAAsAEIcCAAD8AwAwiAIBAMIDACGJAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHAAgEAwgMAIdQCAQDCAwAh2wIgANADACHcAkAA0wMAId0CAQC9AwAh3gIBAL0DACHfAgEAvQMAIeECAAD9A-ECI-UCAAALACDmAgAACwAgA8ICAAAVACDDAgAAFQAgxAIAABUAIAPCAgAAGQAgwwIAABkAIMQCAAAZACADwgIAAB0AIMMCAAAdACDEAgAAHQAgA8ICAAAhACDDAgAAIQAgxAIAACEAIAPCAgAAJQAgwwIAACUAIMQCAAAlACADwgIAACkAIMMCAAApACDEAgAAKQAgA8ICAAAtACDDAgAALQAgxAIAAC0AIA-FAgAA3gMAMIYCAABgABCHAgAA3gMAMIgCAQCMAwAhiQIBAIwDACGZAkAAjQMAIZoCQACNAwAhwAIBAIwDACHUAgEAjAMAIdsCIACyAwAh3AJAAMQDACHdAgEAmwMAId4CAQCbAwAh3wIBAJsDACHhAgAA3wPhAiMHCAAAnQMAIC8AAOEDACAwAADhAwAgjAIAAADhAgONAgAAAOECCY4CAAAA4QIJkwIAAOAD4QIjBwgAAJ0DACAvAADhAwAgMAAA4QMAIIwCAAAA4QIDjQIAAADhAgmOAgAAAOECCZMCAADgA-ECIwSMAgAAAOECA40CAAAA4QIJjgIAAADhAgmTAgAA4QPhAiMLEwAA4wMAIBQAAOQDACCFAgAA4gMAMIYCAAAtABCHAgAA4gMAMIgCAQDCAwAhmQJAAL4DACG8AgEAwgMAIb0CAQDCAwAhvgIBAMIDACG_AiAA0AMAIQ8DAADkAwAgCgAA5AMAIAsAAOcDACAVAADdAwAghQIAAOYDADCGAgAAKQAQhwIAAOYDADCIAgEAwgMAIYkCAQDCAwAhigIBAMIDACGZAkAAvgMAIZoCQAC-AwAhuwIBAMIDACHlAgAAKQAg5gIAACkAIB8EAADUAwAgBQAA1QMAIAYAANYDACAMAADXAwAgDQAA2AMAIBAAANkDACARAADaAwAgFwAAvwMAIBgAANkDACAZAADbAwAgGgAA3AMAIBsAANwDACAcAADdAwAghQIAAM8DADCGAgAAZgAQhwIAAM8DADCIAgEAwgMAIZkCQAC-AwAhmgJAAL4DACGfAgAA0gPaAiK4AgEAvQMAIcACAQDCAwAh1AIBAMIDACHVAiAA0AMAIdcCAADRA9cCItgCAQC9AwAh2gIgANADACHbAiAA0AMAIdwCQADTAwAh5QIAAGYAIOYCAABmACACiQIBAAAAAYoCAQAAAAENAwAA5AMAIAoAAOQDACALAADnAwAgFQAA3QMAIIUCAADmAwAwhgIAACkAEIcCAADmAwAwiAIBAMIDACGJAgEAwgMAIYoCAQDCAwAhmQJAAL4DACGaAkAAvgMAIbsCAQDCAwAhHQkAAPsDACAKAADkAwAgDAAA1wMAIA0AANgDACAQAADZAwAgEQAA2gMAIBIAANsDACAWAADcAwAghQIAAPgDADCGAgAADQAQhwIAAPgDADCIAgEAwgMAIZkCQAC-AwAhmgJAAL4DACGuAgEAwgMAIa8CAQDCAwAhsAJAAL4DACGxAgEAwgMAIbICAQC9AwAhswIBAL0DACG1AgAA-QO1AiK2AhAA8QMAIbcCAgD6AwAhuAIBAL0DACG5AiAA0AMAIboCAQC9AwAhuwIBAMIDACHlAgAADQAg5gIAAA0AIAKJAgEAAAABigIBAAAAAQkDAADkAwAgCwAA5wMAIIUCAADpAwAwhgIAACUAEIcCAADpAwAwiAIBAMIDACGJAgEAwgMAIYoCAQDCAwAhiwJAAL4DACECiQIBAAAAAYoCAQAAAAEMAwAA5AMAIAsAAOcDACCFAgAA6wMAMIYCAAAhABCHAgAA6wMAMIgCAQDCAwAhiQIBAMIDACGKAgEAwgMAIZcCAgDsAwAhmAIBAMIDACGZAkAAvgMAIZoCQAC-AwAhCIwCAgAAAAGNAgIAAAAEjgICAAAABI8CAgAAAAGQAgIAAAABkQICAAAAAZICAgAAAAGTAgIAjwMAIQKKAgEAAAABrQIBAAAAAQ0LAADnAwAgDgAA5AMAIA8AAOQDACCFAgAA7gMAMIYCAAAdABCHAgAA7gMAMIgCAQDCAwAhigIBAMIDACGZAkAAvgMAIZoCQAC-AwAhnwIAAO8DrAIirAIBAMIDACGtAgEAwgMAIQSMAgAAAKwCAo0CAAAArAIIjgIAAACsAgiTAgAArgOsAiIQAwAA5AMAIAsAAOcDACCFAgAA8AMAMIYCAAAZABCHAgAA8AMAMIgCAQDCAwAhiQIBAMIDACGKAgEAwgMAIZkCQAC-AwAhmgJAAL4DACGbAhAA8QMAIZ0CAADyA50CIp8CAADzA58CIqACAQC9AwAhoQIBAL0DACGiAgAA9AMAIAiMAhAAAAABjQIQAAAABI4CEAAAAASPAhAAAAABkAIQAAAAAZECEAAAAAGSAhAAAAABkwIQAKYDACEEjAIAAACdAgKNAgAAAJ0CCI4CAAAAnQIIkwIAAKQDnQIiBIwCAAAAnwICjQIAAACfAgiOAgAAAJ8CCJMCAACiA58CIgyMAoAAAAABjwKAAAAAAZACgAAAAAGRAoAAAAABkgKAAAAAAZMCgAAAAAGjAgEAAAABpAIBAAAAAaUCAQAAAAGmAoAAAAABpwKAAAAAAagCgAAAAAECiQIBAAAAAYoCAQAAAAELAwAA5AMAIAsAAOcDACCFAgAA9gMAMIYCAAAVABCHAgAA9gMAMIgCAQDCAwAhiQIBAMIDACGKAgEAwgMAIZoCQAC-AwAhnwIAAPcDqgIiqgJAAL4DACEEjAIAAACqAgKNAgAAAKoCCI4CAAAAqgIIkwIAAKoDqgIiGwkAAPsDACAKAADkAwAgDAAA1wMAIA0AANgDACAQAADZAwAgEQAA2gMAIBIAANsDACAWAADcAwAghQIAAPgDADCGAgAADQAQhwIAAPgDADCIAgEAwgMAIZkCQAC-AwAhmgJAAL4DACGuAgEAwgMAIa8CAQDCAwAhsAJAAL4DACGxAgEAwgMAIbICAQC9AwAhswIBAL0DACG1AgAA-QO1AiK2AhAA8QMAIbcCAgD6AwAhuAIBAL0DACG5AiAA0AMAIboCAQC9AwAhuwIBAMIDACEEjAIAAAC1AgKNAgAAALUCCI4CAAAAtQIIkwIAALgDtQIiCIwCAgAAAAGNAgIAAAAFjgICAAAABY8CAgAAAAGQAgIAAAABkQICAAAAAZICAgAAAAGTAgIAnQMAIQsHAAC_AwAghQIAALwDADCGAgAAEQAQhwIAALwDADCIAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHAAgEAwgMAIcECAQC9AwAh5QIAABEAIOYCAAARACAQAwAA5AMAIIUCAAD8AwAwhgIAAAsAEIcCAAD8AwAwiAIBAMIDACGJAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHAAgEAwgMAIdQCAQDCAwAh2wIgANADACHcAkAA0wMAId0CAQC9AwAh3gIBAL0DACHfAgEAvQMAIeECAAD9A-ECIwSMAgAAAOECA40CAAAA4QIJjgIAAADhAgmTAgAA4QPhAiMRAwAA5AMAIIUCAAD-AwAwhgIAAAcAEIcCAAD-AwAwiAIBAMIDACGJAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHIAgEAwgMAIckCAQDCAwAhygIBAL0DACHLAgEAvQMAIcwCAQC9AwAhzQJAANMDACHOAkAA0wMAIc8CAQC9AwAh0AIBAL0DACEMAwAA5AMAIIUCAAD_AwAwhgIAAAMAEIcCAAD_AwAwiAIBAMIDACGJAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHHAkAAvgMAIdECAQDCAwAh0gIBAL0DACHTAgEAvQMAIQAAAAHqAgEAAAABAeoCQAAAAAEFKQAA8AcAICoAAPYHACDnAgAA8QcAIOgCAAD1BwAg7QIAAGMAIAUpAADuBwAgKgAA8wcAIOcCAADvBwAg6AIAAPIHACDtAgAADwAgAykAAPAHACDnAgAA8QcAIO0CAABjACADKQAA7gcAIOcCAADvBwAg7QIAAA8AIAAAAAAABeoCAgAAAAHwAgIAAAAB8QICAAAAAfICAgAAAAHzAgIAAAABBSkAAOYHACAqAADsBwAg5wIAAOcHACDoAgAA6wcAIO0CAAAPACAFKQAA5AcAICoAAOkHACDnAgAA5QcAIOgCAADoBwAg7QIAAGMAIAMpAADmBwAg5wIAAOcHACDtAgAADwAgAykAAOQHACDnAgAA5QcAIO0CAABjACAAAAAAAAAF6gIQAAAAAfACEAAAAAHxAhAAAAAB8gIQAAAAAfMCEAAAAAEB6gIAAACdAgIB6gIAAACfAgIB6gIBAAAAAQUpAADcBwAgKgAA4gcAIOcCAADdBwAg6AIAAOEHACDtAgAAYwAgBSkAANoHACAqAADfBwAg5wIAANsHACDoAgAA3gcAIO0CAAAPACADKQAA3AcAIOcCAADdBwAg7QIAAGMAIAMpAADaBwAg5wIAANsHACDtAgAADwAgAAAAAeoCAAAAqgICBSkAANIHACAqAADYBwAg5wIAANMHACDoAgAA1wcAIO0CAAAPACAFKQAA0AcAICoAANUHACDnAgAA0QcAIOgCAADUBwAg7QIAAGMAIAMpAADSBwAg5wIAANMHACDtAgAADwAgAykAANAHACDnAgAA0QcAIO0CAABjACAAAAAB6gIAAACsAgIFKQAAxQcAICoAAM4HACDnAgAAxgcAIOgCAADNBwAg7QIAAA8AIAUpAADDBwAgKgAAywcAIOcCAADEBwAg6AIAAMoHACDtAgAAYwAgBSkAAMEHACAqAADIBwAg5wIAAMIHACDoAgAAxwcAIO0CAABjACADKQAAxQcAIOcCAADGBwAg7QIAAA8AIAMpAADDBwAg5wIAAMQHACDtAgAAYwAgAykAAMEHACDnAgAAwgcAIO0CAABjACAAAAAAAAHqAgAAALUCAgXqAgIAAAAB8AICAAAAAfECAgAAAAHyAgIAAAAB8wICAAAAAQHqAiAAAAABBykAAKMHACAqAAC_BwAg5wIAAKQHACDoAgAAvgcAIOsCAAARACDsAgAAEQAg7QIAAMEBACAFKQAAoQcAICoAALwHACDnAgAAogcAIOgCAAC7BwAg7QIAAGMAIAspAACTBQAwKgAAmAUAMOcCAACUBQAw6AIAAJUFADDpAgAAlgUAIOoCAACXBQAw6wIAAJcFADDsAgAAlwUAMO0CAACXBQAw7gIAAJkFADDvAgAAmgUAMAspAACHBQAwKgAAjAUAMOcCAACIBQAw6AIAAIkFADDpAgAAigUAIOoCAACLBQAw6wIAAIsFADDsAgAAiwUAMO0CAACLBQAw7gIAAI0FADDvAgAAjgUAMAspAAD7BAAwKgAAgAUAMOcCAAD8BAAw6AIAAP0EADDpAgAA_gQAIOoCAAD_BAAw6wIAAP8EADDsAgAA_wQAMO0CAAD_BAAw7gIAAIEFADDvAgAAggUAMAspAADvBAAwKgAA9AQAMOcCAADwBAAw6AIAAPEEADDpAgAA8gQAIOoCAADzBAAw6wIAAPMEADDsAgAA8wQAMO0CAADzBAAw7gIAAPUEADDvAgAA9gQAMAspAADjBAAwKgAA6AQAMOcCAADkBAAw6AIAAOUEADDpAgAA5gQAIOoCAADnBAAw6wIAAOcEADDsAgAA5wQAMO0CAADnBAAw7gIAAOkEADDvAgAA6gQAMAspAADDBAAwKgAAyAQAMOcCAADEBAAw6AIAAMUEADDpAgAAxgQAIOoCAADHBAAw6wIAAMcEADDsAgAAxwQAMO0CAADHBAAw7gIAAMkEADDvAgAAygQAMAgDAADgBAAgCgAA4QQAIBUAAOIEACCIAgEAAAABiQIBAAAAAZkCQAAAAAGaAkAAAAABuwIBAAAAAQIAAAArACApAADfBAAgAwAAACsAICkAAN8EACAqAADNBAAgASIAALoHADAOAwAA5AMAIAoAAOQDACALAADnAwAgFQAA3QMAIIUCAADmAwAwhgIAACkAEIcCAADmAwAwiAIBAAAAAYkCAQDCAwAhigIBAMIDACGZAkAAvgMAIZoCQAC-AwAhuwIBAMIDACHiAgAA5QMAIAIAAAArACAiAADNBAAgAgAAAMsEACAiAADMBAAgCYUCAADKBAAwhgIAAMsEABCHAgAAygQAMIgCAQDCAwAhiQIBAMIDACGKAgEAwgMAIZkCQAC-AwAhmgJAAL4DACG7AgEAwgMAIQmFAgAAygQAMIYCAADLBAAQhwIAAMoEADCIAgEAwgMAIYkCAQDCAwAhigIBAMIDACGZAkAAvgMAIZoCQAC-AwAhuwIBAMIDACEFiAIBAIMEACGJAgEAgwQAIZkCQACEBAAhmgJAAIQEACG7AgEAgwQAIQgDAADOBAAgCgAAzwQAIBUAANAEACCIAgEAgwQAIYkCAQCDBAAhmQJAAIQEACGaAkAAhAQAIbsCAQCDBAAhBSkAAKwHACAqAAC4BwAg5wIAAK0HACDoAgAAtwcAIO0CAABjACAFKQAAqgcAICoAALUHACDnAgAAqwcAIOgCAAC0BwAg7QIAAGMAIAspAADRBAAwKgAA1gQAMOcCAADSBAAw6AIAANMEADDpAgAA1AQAIOoCAADVBAAw6wIAANUEADDsAgAA1QQAMO0CAADVBAAw7gIAANcEADDvAgAA2AQAMAYUAADeBAAgiAIBAAAAAZkCQAAAAAG9AgEAAAABvgIBAAAAAb8CIAAAAAECAAAALwAgKQAA3QQAIAMAAAAvACApAADdBAAgKgAA2wQAIAEiAACzBwAwCxMAAOMDACAUAADkAwAghQIAAOIDADCGAgAALQAQhwIAAOIDADCIAgEAAAABmQJAAL4DACG8AgEAwgMAIb0CAQDCAwAhvgIBAMIDACG_AiAA0AMAIQIAAAAvACAiAADbBAAgAgAAANkEACAiAADaBAAgCYUCAADYBAAwhgIAANkEABCHAgAA2AQAMIgCAQDCAwAhmQJAAL4DACG8AgEAwgMAIb0CAQDCAwAhvgIBAMIDACG_AiAA0AMAIQmFAgAA2AQAMIYCAADZBAAQhwIAANgEADCIAgEAwgMAIZkCQAC-AwAhvAIBAMIDACG9AgEAwgMAIb4CAQDCAwAhvwIgANADACEFiAIBAIMEACGZAkAAhAQAIb0CAQCDBAAhvgIBAIMEACG_AiAAugQAIQYUAADcBAAgiAIBAIMEACGZAkAAhAQAIb0CAQCDBAAhvgIBAIMEACG_AiAAugQAIQUpAACuBwAgKgAAsQcAIOcCAACvBwAg6AIAALAHACDtAgAAYwAgBhQAAN4EACCIAgEAAAABmQJAAAAAAb0CAQAAAAG-AgEAAAABvwIgAAAAAQMpAACuBwAg5wIAAK8HACDtAgAAYwAgCAMAAOAEACAKAADhBAAgFQAA4gQAIIgCAQAAAAGJAgEAAAABmQJAAAAAAZoCQAAAAAG7AgEAAAABAykAAKwHACDnAgAArQcAIO0CAABjACADKQAAqgcAIOcCAACrBwAg7QIAAGMAIAQpAADRBAAw5wIAANIEADDpAgAA1AQAIO0CAADVBAAwBAMAAIcEACCIAgEAAAABiQIBAAAAAYsCQAAAAAECAAAAJwAgKQAA7gQAIAMAAAAnACApAADuBAAgKgAA7QQAIAEiAACpBwAwCgMAAOQDACALAADnAwAghQIAAOkDADCGAgAAJQAQhwIAAOkDADCIAgEAAAABiQIBAMIDACGKAgEAwgMAIYsCQAC-AwAh4wIAAOgDACACAAAAJwAgIgAA7QQAIAIAAADrBAAgIgAA7AQAIAeFAgAA6gQAMIYCAADrBAAQhwIAAOoEADCIAgEAwgMAIYkCAQDCAwAhigIBAMIDACGLAkAAvgMAIQeFAgAA6gQAMIYCAADrBAAQhwIAAOoEADCIAgEAwgMAIYkCAQDCAwAhigIBAMIDACGLAkAAvgMAIQOIAgEAgwQAIYkCAQCDBAAhiwJAAIQEACEEAwAAhQQAIIgCAQCDBAAhiQIBAIMEACGLAkAAhAQAIQQDAACHBAAgiAIBAAAAAYkCAQAAAAGLAkAAAAABBwMAAJIEACCIAgEAAAABiQIBAAAAAZcCAgAAAAGYAgEAAAABmQJAAAAAAZoCQAAAAAECAAAAIwAgKQAA-gQAIAMAAAAjACApAAD6BAAgKgAA-QQAIAEiAACoBwAwDQMAAOQDACALAADnAwAghQIAAOsDADCGAgAAIQAQhwIAAOsDADCIAgEAAAABiQIBAMIDACGKAgEAwgMAIZcCAgDsAwAhmAIBAMIDACGZAkAAvgMAIZoCQAC-AwAh4gIAAOoDACACAAAAIwAgIgAA-QQAIAIAAAD3BAAgIgAA-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-wQAMOcCAAD8BAAw6QIAAP4EACDtAgAA_wQAMAQpAADvBAAw5wIAAPAEADDpAgAA8gQAIO0CAADzBAAwBCkAAOMEADDnAgAA5AQAMOkCAADmBAAg7QIAAOcEADAEKQAAwwQAMOcCAADEBAAw6QIAAMYEACDtAgAAxwQAMAAAAAUpAACcBwAgKgAAnwcAIOcCAACdBwAg6AIAAJ4HACDtAgAAKwAgAykAAJwHACDnAgAAnQcAIO0CAAArACAAAAAFKQAAlwcAICoAAJoHACDnAgAAmAcAIOgCAACZBwAg7QIAAA8AIAMpAACXBwAg5wIAAJgHACDtAgAADwAgAAAACykAALUFADAqAAC6BQAw5wIAALYFADDoAgAAtwUAMOkCAAC4BQAg6gIAALkFADDrAgAAuQUAMOwCAAC5BQAw7QIAALkFADDuAgAAuwUAMO8CAAC8BQAwFgoAAKAFACAMAAChBQAgDQAAogUAIBAAAKMFACARAACkBQAgEgAApQUAIBYAAKYFACCIAgEAAAABmQJAAAAAAZoCQAAAAAGuAgEAAAABrwIBAAAAAbACQAAAAAGxAgEAAAABsgIBAAAAAbMCAQAAAAG1AgAAALUCArYCEAAAAAG3AgIAAAABuAIBAAAAAbkCIAAAAAG7AgEAAAABAgAAAA8AICkAAMAFACADAAAADwAgKQAAwAUAICoAAL8FACABIgAAlgcAMBsJAAD7AwAgCgAA5AMAIAwAANcDACANAADYAwAgEAAA2QMAIBEAANoDACASAADbAwAgFgAA3AMAIIUCAAD4AwAwhgIAAA0AEIcCAAD4AwAwiAIBAAAAAZkCQAC-AwAhmgJAAL4DACGuAgEAwgMAIa8CAQDCAwAhsAJAAL4DACGxAgEAwgMAIbICAQC9AwAhswIBAL0DACG1AgAA-QO1AiK2AhAA8QMAIbcCAgD6AwAhuAIBAL0DACG5AiAA0AMAIboCAQC9AwAhuwIBAMIDACECAAAADwAgIgAAvwUAIAIAAAC9BQAgIgAAvgUAIBOFAgAAvAUAMIYCAAC9BQAQhwIAALwFADCIAgEAwgMAIZkCQAC-AwAhmgJAAL4DACGuAgEAwgMAIa8CAQDCAwAhsAJAAL4DACGxAgEAwgMAIbICAQC9AwAhswIBAL0DACG1AgAA-QO1AiK2AhAA8QMAIbcCAgD6AwAhuAIBAL0DACG5AiAA0AMAIboCAQC9AwAhuwIBAMIDACEThQIAALwFADCGAgAAvQUAEIcCAAC8BQAwiAIBAMIDACGZAkAAvgMAIZoCQAC-AwAhrgIBAMIDACGvAgEAwgMAIbACQAC-AwAhsQIBAMIDACGyAgEAvQMAIbMCAQC9AwAhtQIAAPkDtQIitgIQAPEDACG3AgIA-gMAIbgCAQC9AwAhuQIgANADACG6AgEAvQMAIbsCAQDCAwAhD4gCAQCDBAAhmQJAAIQEACGaAkAAhAQAIa4CAQCDBAAhrwIBAIMEACGwAkAAhAQAIbECAQCDBAAhsgIBAJwEACGzAgEAnAQAIbUCAAC4BLUCIrYCEACZBAAhtwICALkEACG4AgEAnAQAIbkCIAC6BAAhuwIBAIMEACEWCgAAvAQAIAwAAL0EACANAAC-BAAgEAAAvwQAIBEAAMAEACASAADBBAAgFgAAwgQAIIgCAQCDBAAhmQJAAIQEACGaAkAAhAQAIa4CAQCDBAAhrwIBAIMEACGwAkAAhAQAIbECAQCDBAAhsgIBAJwEACGzAgEAnAQAIbUCAAC4BLUCIrYCEACZBAAhtwICALkEACG4AgEAnAQAIbkCIAC6BAAhuwIBAIMEACEWCgAAoAUAIAwAAKEFACANAACiBQAgEAAAowUAIBEAAKQFACASAAClBQAgFgAApgUAIIgCAQAAAAGZAkAAAAABmgJAAAAAAa4CAQAAAAGvAgEAAAABsAJAAAAAAbECAQAAAAGyAgEAAAABswIBAAAAAbUCAAAAtQICtgIQAAAAAbcCAgAAAAG4AgEAAAABuQIgAAAAAbsCAQAAAAEEKQAAtQUAMOcCAAC2BQAw6QIAALgFACDtAgAAuQUAMAAAAAAAAAAB6gJAAAAAAQUpAACRBwAgKgAAlAcAIOcCAACSBwAg6AIAAJMHACDtAgAAYwAgAykAAJEHACDnAgAAkgcAIO0CAABjACAAAAAFKQAAjAcAICoAAI8HACDnAgAAjQcAIOgCAACOBwAg7QIAAGMAIAMpAACMBwAg5wIAAI0HACDtAgAAYwAgAAAAAeoCAAAA1wICAeoCAAAA2gICCykAAM8GADAqAADUBgAw5wIAANAGADDoAgAA0QYAMOkCAADSBgAg6gIAANMGADDrAgAA0wYAMOwCAADTBgAw7QIAANMGADDuAgAA1QYAMO8CAADWBgAwCykAAMMGADAqAADIBgAw5wIAAMQGADDoAgAAxQYAMOkCAADGBgAg6gIAAMcGADDrAgAAxwYAMOwCAADHBgAw7QIAAMcGADDuAgAAyQYAMO8CAADKBgAwBykAAL0GACAqAADABgAg5wIAAL4GACDoAgAAvwYAIOsCAAALACDsAgAACwAg7QIAAAEAIAspAAC0BgAwKgAAuAYAMOcCAAC1BgAw6AIAALYGADDpAgAAtwYAIOoCAAC5BQAw6wIAALkFADDsAgAAuQUAMO0CAAC5BQAw7gIAALkGADDvAgAAvAUAMAspAACrBgAwKgAArwYAMOcCAACsBgAw6AIAAK0GADDpAgAArgYAIOoCAACXBQAw6wIAAJcFADDsAgAAlwUAMO0CAACXBQAw7gIAALAGADDvAgAAmgUAMAspAACiBgAwKgAApgYAMOcCAACjBgAw6AIAAKQGADDpAgAApQYAIOoCAACLBQAw6wIAAIsFADDsAgAAiwUAMO0CAACLBQAw7gIAAKcGADDvAgAAjgUAMAspAACZBgAwKgAAnQYAMOcCAACaBgAw6AIAAJsGADDpAgAAnAYAIOoCAAD_BAAw6wIAAP8EADDsAgAA_wQAMO0CAAD_BAAw7gIAAJ4GADDvAgAAggUAMAspAACQBgAwKgAAlAYAMOcCAACRBgAw6AIAAJIGADDpAgAAkwYAIOoCAAD_BAAw6wIAAP8EADDsAgAA_wQAMO0CAAD_BAAw7gIAAJUGADDvAgAAggUAMAspAACHBgAwKgAAiwYAMOcCAACIBgAw6AIAAIkGADDpAgAAigYAIOoCAADzBAAw6wIAAPMEADDsAgAA8wQAMO0CAADzBAAw7gIAAIwGADDvAgAA9gQAMAspAAD-BQAwKgAAggYAMOcCAAD_BQAw6AIAAIAGADDpAgAAgQYAIOoCAADnBAAw6wIAAOcEADDsAgAA5wQAMO0CAADnBAAw7gIAAIMGADDvAgAA6gQAMAspAAD1BQAwKgAA-QUAMOcCAAD2BQAw6AIAAPcFADDpAgAA-AUAIOoCAADHBAAw6wIAAMcEADDsAgAAxwQAMO0CAADHBAAw7gIAAPoFADDvAgAAygQAMAspAADsBQAwKgAA8AUAMOcCAADtBQAw6AIAAO4FADDpAgAA7wUAIOoCAADHBAAw6wIAAMcEADDsAgAAxwQAMO0CAADHBAAw7gIAAPEFADDvAgAAygQAMAspAADjBQAwKgAA5wUAMOcCAADkBQAw6AIAAOUFADDpAgAA5gUAIOoCAADVBAAw6wIAANUEADDsAgAA1QQAMO0CAADVBAAw7gIAAOgFADDvAgAA2AQAMAYTAACrBQAgiAIBAAAAAZkCQAAAAAG8AgEAAAABvgIBAAAAAb8CIAAAAAECAAAALwAgKQAA6wUAIAMAAAAvACApAADrBQAgKgAA6gUAIAEiAACLBwAwAgAAAC8AICIAAOoFACACAAAA2QQAICIAAOkFACAFiAIBAIMEACGZAkAAhAQAIbwCAQCDBAAhvgIBAIMEACG_AiAAugQAIQYTAACqBQAgiAIBAIMEACGZAkAAhAQAIbwCAQCDBAAhvgIBAIMEACG_AiAAugQAIQYTAACrBQAgiAIBAAAAAZkCQAAAAAG8AgEAAAABvgIBAAAAAb8CIAAAAAEIAwAA4AQAIAsAALAFACAVAADiBAAgiAIBAAAAAYkCAQAAAAGKAgEAAAABmQJAAAAAAZoCQAAAAAECAAAAKwAgKQAA9AUAIAMAAAArACApAAD0BQAgKgAA8wUAIAEiAACKBwAwAgAAACsAICIAAPMFACACAAAAywQAICIAAPIFACAFiAIBAIMEACGJAgEAgwQAIYoCAQCDBAAhmQJAAIQEACGaAkAAhAQAIQgDAADOBAAgCwAArwUAIBUAANAEACCIAgEAgwQAIYkCAQCDBAAhigIBAIMEACGZAkAAhAQAIZoCQACEBAAhCAMAAOAEACALAACwBQAgFQAA4gQAIIgCAQAAAAGJAgEAAAABigIBAAAAAZkCQAAAAAGaAkAAAAABCAoAAOEEACALAACwBQAgFQAA4gQAIIgCAQAAAAGKAgEAAAABmQJAAAAAAZoCQAAAAAG7AgEAAAABAgAAACsAICkAAP0FACADAAAAKwAgKQAA_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_gMAMIYCAAAHABCHAgAA_gMAMIgCAQAAAAGJAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHIAgEAwgMAIckCAQDCAwAhygIBAL0DACHLAgEAvQMAIcwCAQC9AwAhzQJAANMDACHOAkAA0wMAIc8CAQC9AwAh0AIBAL0DACECAAAACQAgIgAAzQYAIAIAAADLBgAgIgAAzAYAIBCFAgAAygYAMIYCAADLBgAQhwIAAMoGADCIAgEAwgMAIYkCAQDCAwAhmQJAAL4DACGaAkAAvgMAIcgCAQDCAwAhyQIBAMIDACHKAgEAvQMAIcsCAQC9AwAhzAIBAL0DACHNAkAA0wMAIc4CQADTAwAhzwIBAL0DACHQAgEAvQMAIRCFAgAAygYAMIYCAADLBgAQhwIAAMoGADCIAgEAwgMAIYkCAQDCAwAhmQJAAL4DACGaAkAAvgMAIcgCAQDCAwAhyQIBAMIDACHKAgEAvQMAIcsCAQC9AwAhzAIBAL0DACHNAkAA0wMAIc4CQADTAwAhzwIBAL0DACHQAgEAvQMAIQyIAgEAgwQAIZkCQACEBAAhmgJAAIQEACHIAgEAgwQAIckCAQCDBAAhygIBAJwEACHLAgEAnAQAIcwCAQCcBAAhzQJAAMkFACHOAkAAyQUAIc8CAQCcBAAh0AIBAJwEACEMiAIBAIMEACGZAkAAhAQAIZoCQACEBAAhyAIBAIMEACHJAgEAgwQAIcoCAQCcBAAhywIBAJwEACHMAgEAnAQAIc0CQADJBQAhzgJAAMkFACHPAgEAnAQAIdACAQCcBAAhDIgCAQAAAAGZAkAAAAABmgJAAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAcsCAQAAAAHMAgEAAAABzQJAAAAAAc4CQAAAAAHPAgEAAAAB0AIBAAAAAQeIAgEAAAABmQJAAAAAAZoCQAAAAAHHAkAAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAABAgAAAAUAICkAANoGACADAAAABQAgKQAA2gYAICoAANkGACABIgAAgAcAMAwDAADkAwAghQIAAP8DADCGAgAAAwAQhwIAAP8DADCIAgEAAAABiQIBAMIDACGZAkAAvgMAIZoCQAC-AwAhxwJAAL4DACHRAgEAAAAB0gIBAL0DACHTAgEAvQMAIQIAAAAFACAiAADZBgAgAgAAANcGACAiAADYBgAgC4UCAADWBgAwhgIAANcGABCHAgAA1gYAMIgCAQDCAwAhiQIBAMIDACGZAkAAvgMAIZoCQAC-AwAhxwJAAL4DACHRAgEAwgMAIdICAQC9AwAh0wIBAL0DACELhQIAANYGADCGAgAA1wYAEIcCAADWBgAwiAIBAMIDACGJAgEAwgMAIZkCQAC-AwAhmgJAAL4DACHHAkAAvgMAIdECAQDCAwAh0gIBAL0DACHTAgEAvQMAIQeIAgEAgwQAIZkCQACEBAAhmgJAAIQEACHHAkAAhAQAIdECAQCDBAAh0gIBAJwEACHTAgEAnAQAIQeIAgEAgwQAIZkCQACEBAAhmgJAAIQEACHHAkAAhAQAIdECAQCDBAAh0gIBAJwEACHTAgEAnAQAIQeIAgEAAAABmQJAAAAAAZoCQAAAAAHHAkAAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAABBCkAAM8GADDnAgAA0AYAMOkCAADSBgAg7QIAANMGADAEKQAAwwYAMOcCAADEBgAw6QIAAMYGACDtAgAAxwYAMAMpAAC9BgAg5wIAAL4GACDtAgAAAQAgBCkAALQGADDnAgAAtQYAMOkCAAC3BgAg7QIAALkFADAEKQAAqwYAMOcCAACsBgAw6QIAAK4GACDtAgAAlwUAMAQpAACiBgAw5wIAAKMGADDpAgAApQYAIO0CAACLBQAwBCkAAJkGADDnAgAAmgYAMOkCAACcBgAg7QIAAP8EADAEKQAAkAYAMOcCAACRBgAw6QIAAJMGACDtAgAA_wQAMAQpAACHBgAw5wIAAIgGADDpAgAAigYAIO0CAADzBAAwBCkAAP4FADDnAgAA_wUAMOkCAACBBgAg7QIAAOcEADAEKQAA9QUAMOcCAAD2BQAw6QIAAPgFACDtAgAAxwQAMAQpAADsBQAw5wIAAO0FADDpAgAA7wUAIO0CAADHBAAwBCkAAOMFADDnAgAA5AUAMOkCAADmBQAg7QIAANUEADAAAAYDAAD3BgAg3AIAAJMEACDdAgAAkwQAIN4CAACTBAAg3wIAAJMEACDhAgAAkwQAIAAAAAAAAAAAAAAFKQAA-wYAICoAAP4GACDnAgAA_AYAIOgCAAD9BgAg7QIAAGMAIAMpAAD7BgAg5wIAAPwGACDtAgAAYwAgEAQAAOgGACAFAADpBgAgBgAA6gYAIAwAAOsGACANAADsBgAgEAAA7QYAIBEAAO4GACAXAADCBQAgGAAA7QYAIBkAAO8GACAaAADwBgAgGwAA8AYAIBwAAPEGACC4AgAAkwQAINgCAACTBAAg3AIAAJMEACAEAwAA9wYAIAoAAPcGACALAAD5BgAgFQAA8QYAIA0JAAD6BgAgCgAA9wYAIAwAAOsGACANAADsBgAgEAAA7QYAIBEAAO4GACASAADvBgAgFgAA8AYAILICAACTBAAgswIAAJMEACC3AgAAkwQAILgCAACTBAAgugIAAJMEACACBwAAwgUAIMECAACTBAAgGQQAANsGACAFAADcBgAgDAAA3wYAIA0AAOAGACAQAADhBgAgEQAA4wYAIBcAAN4GACAYAADiBgAgGQAA5AYAIBoAAOUGACAbAADmBgAgHAAA5wYAIIgCAQAAAAGZAkAAAAABmgJAAAAAAZ8CAAAA2gICuAIBAAAAAcACAQAAAAHUAgEAAAAB1QIgAAAAAdcCAAAA1wIC2AIBAAAAAdoCIAAAAAHbAiAAAAAB3AJAAAAAAQIAAABjACApAAD7BgAgAwAAAGYAICkAAPsGACAqAAD_BgAgGwAAAGYAIAQAANYFACAFAADXBQAgDAAA2gUAIA0AANsFACAQAADcBQAgEQAA3gUAIBcAANkFACAYAADdBQAgGQAA3wUAIBoAAOAFACAbAADhBQAgHAAA4gUAICIAAP8GACCIAgEAgwQAIZkCQACEBAAhmgJAAIQEACGfAgAA1QXaAiK4AgEAnAQAIcACAQCDBAAh1AIBAIMEACHVAiAAugQAIdcCAADUBdcCItgCAQCcBAAh2gIgALoEACHbAiAAugQAIdwCQADJBQAhGQQAANYFACAFAADXBQAgDAAA2gUAIA0AANsFACAQAADcBQAgEQAA3gUAIBcAANkFACAYAADdBQAgGQAA3wUAIBoAAOAFACAbAADhBQAgHAAA4gUAIIgCAQCDBAAhmQJAAIQEACGaAkAAhAQAIZ8CAADVBdoCIrgCAQCcBAAhwAIBAIMEACHUAgEAgwQAIdUCIAC6BAAh1wIAANQF1wIi2AIBAJwEACHaAiAAugQAIdsCIAC6BAAh3AJAAMkFACEHiAIBAAAAAZkCQAAAAAGaAkAAAAABxwJAAAAAAdECAQAAAAHSAgEAAAAB0wIBAAAAAQyIAgEAAAABmQJAAAAAAZoCQAAAAAHIAgEAAAAByQIBAAAAAcoCAQAAAAHLAgEAAAABzAIBAAAAAc0CQAAAAAHOAkAAAAABzwIBAAAAAdACAQAAAAEPiAIBAAAAAZkCQAAAAAGaAkAAAAABrgIBAAAAAa8CAQAAAAGwAkAAAAABsQIBAAAAAbICAQAAAAGzAgEAAAABtQIAAAC1AgK2AhAAAAABtwICAAAAAbgCAQAAAAG5AiAAAAABugIBAAAAAQWIAgEAAAABigIBAAAAAZoCQAAAAAGfAgAAAKoCAqoCQAAAAAEKiAIBAAAAAYoCAQAAAAGZAkAAAAABmgJAAAAAAZsCEAAAAAGdAgAAAJ0CAp8CAAAAnwICoAIBAAAAAaECAQAAAAGiAoAAAAABBogCAQAAAAGKAgEAAAABmQJAAAAAAZoCQAAAAAGfAgAAAKwCAq0CAQAAAAEGiAIBAAAAAYoCAQAAAAGZAkAAAAABmgJAAAAAAZ8CAAAArAICrAIBAAAAAQaIAgEAAAABigIBAAAAAZcCAgAAAAGYAgEAAAABmQJAAAAAAZoCQAAAAAEDiAIBAAAAAYoCAQAAAAGLAkAAAAABBYgCAQAAAAGKAgEAAAABmQJAAAAAAZoCQAAAAAG7AgEAAAABBYgCAQAAAAGJAgEAAAABigIBAAAAAZkCQAAAAAGaAkAAAAABBYgCAQAAAAGZAkAAAAABvAIBAAAAAb4CAQAAAAG_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_BAAgEQAAwAQAIBIAAMEEACAiAACbBwAgiAIBAIMEACGZAkAAhAQAIZoCQACEBAAhrgIBAIMEACGvAgEAgwQAIbACQACEBAAhsQIBAIMEACGyAgEAnAQAIbMCAQCcBAAhtQIAALgEtQIitgIQAJkEACG3AgIAuQQAIbgCAQCcBAAhuQIgALoEACG6AgEAnAQAIbsCAQCDBAAhFwkAALsEACAKAAC8BAAgDAAAvQQAIA0AAL4EACAQAAC_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_BAAgEQAAwAQAIBIAAMEEACAWAADCBAAgIgAA4AcAIIgCAQCDBAAhmQJAAIQEACGaAkAAhAQAIa4CAQCDBAAhrwIBAIMEACGwAkAAhAQAIbECAQCDBAAhsgIBAJwEACGzAgEAnAQAIbUCAAC4BLUCIrYCEACZBAAhtwICALkEACG4AgEAnAQAIbkCIAC6BAAhugIBAJwEACG7AgEAgwQAIRcJAAC7BAAgCgAAvAQAIAwAAL0EACAQAAC_BAAgEQAAwAQAIBIAAMEEACAWAADCBAAgiAIBAIMEACGZAkAAhAQAIZoCQACEBAAhrgIBAIMEACGvAgEAgwQAIbACQACEBAAhsQIBAIMEACGyAgEAnAQAIbMCAQCcBAAhtQIAALgEtQIitgIQAJkEACG3AgIAuQQAIbgCAQCcBAAhuQIgALoEACG6AgEAnAQAIbsCAQCDBAAhAwAAAGYAICkAANwHACAqAADjBwAgGwAAAGYAIAQAANYFACAFAADXBQAgBgAA2AUAIAwAANoFACAQAADcBQAgEQAA3gUAIBcAANkFACAYAADdBQAgGQAA3wUAIBoAAOAFACAbAADhBQAgHAAA4gUAICIAAOMHACCIAgEAgwQAIZkCQACEBAAhmgJAAIQEACGfAgAA1QXaAiK4AgEAnAQAIcACAQCDBAAh1AIBAIMEACHVAiAAugQAIdcCAADUBdcCItgCAQCcBAAh2gIgALoEACHbAiAAugQAIdwCQADJBQAhGQQAANYFACAFAADXBQAgBgAA2AUAIAwAANoFACAQAADcBQAgEQAA3gUAIBcAANkFACAYAADdBQAgGQAA3wUAIBoAAOAFACAbAADhBQAgHAAA4gUAIIgCAQCDBAAhmQJAAIQEACGaAkAAhAQAIZ8CAADVBdoCIrgCAQCcBAAhwAIBAIMEACHUAgEAgwQAIdUCIAC6BAAh1wIAANQF1wIi2AIBAJwEACHaAiAAugQAIdsCIAC6BAAh3AJAAMkFACEZBAAA2wYAIAUAANwGACAGAADdBgAgDAAA3wYAIA0AAOAGACAQAADhBgAgFwAA3gYAIBgAAOIGACAZAADkBgAgGgAA5QYAIBsAAOYGACAcAADnBgAgiAIBAAAAAZkCQAAAAAGaAkAAAAABnwIAAADaAgK4AgEAAAABwAIBAAAAAdQCAQAAAAHVAiAAAAAB1wIAAADXAgLYAgEAAAAB2gIgAAAAAdsCIAAAAAHcAkAAAAABAgAAAGMAICkAAOQHACAXCQAAnwUAIAoAAKAFACAMAAChBQAgDQAAogUAIBAAAKMFACASAAClBQAgFgAApgUAIIgCAQAAAAGZAkAAAAABmgJAAAAAAa4CAQAAAAGvAgEAAAABsAJAAAAAAbECAQAAAAGyAgEAAAABswIBAAAAAbUCAAAAtQICtgIQAAAAAbcCAgAAAAG4AgEAAAABuQIgAAAAAboCAQAAAAG7AgEAAAABAgAAAA8AICkAAOYHACADAAAAZgAgKQAA5AcAICoAAOoHACAbAAAAZgAgBAAA1gUAIAUAANcFACAGAADYBQAgDAAA2gUAIA0AANsFACAQAADcBQAgFwAA2QUAIBgAAN0FACAZAADfBQAgGgAA4AUAIBsAAOEFACAcAADiBQAgIgAA6gcAIIgCAQCDBAAhmQJAAIQEACGaAkAAhAQAIZ8CAADVBdoCIrgCAQCcBAAhwAIBAIMEACHUAgEAgwQAIdUCIAC6BAAh1wIAANQF1wIi2AIBAJwEACHaAiAAugQAIdsCIAC6BAAh3AJAAMkFACEZBAAA1gUAIAUAANcFACAGAADYBQAgDAAA2gUAIA0AANsFACAQAADcBQAgFwAA2QUAIBgAAN0FACAZAADfBQAgGgAA4AUAIBsAAOEFACAcAADiBQAgiAIBAIMEACGZAkAAhAQAIZoCQACEBAAhnwIAANUF2gIiuAIBAJwEACHAAgEAgwQAIdQCAQCDBAAh1QIgALoEACHXAgAA1AXXAiLYAgEAnAQAIdoCIAC6BAAh2wIgALoEACHcAkAAyQUAIQMAAAANACApAADmBwAgKgAA7QcAIBkAAAANACAJAAC7BAAgCgAAvAQAIAwAAL0EACANAAC-BAAgEAAAvwQAIBIAAMEEACAWAADCBAAgIgAA7QcAIIgCAQCDBAAhmQJAAIQEACGaAkAAhAQAIa4CAQCDBAAhrwIBAIMEACGwAkAAhAQAIbECAQCDBAAhsgIBAJwEACGzAgEAnAQAIbUCAAC4BLUCIrYCEACZBAAhtwICALkEACG4AgEAnAQAIbkCIAC6BAAhugIBAJwEACG7AgEAgwQAIRcJAAC7BAAgCgAAvAQAIAwAAL0EACANAAC-BAAgEAAAvwQAIBIAAMEEACAWAADCBAAgiAIBAIMEACGZAkAAhAQAIZoCQACEBAAhrgIBAIMEACGvAgEAgwQAIbACQACEBAAhsQIBAIMEACGyAgEAnAQAIbMCAQCcBAAhtQIAALgEtQIitgIQAJkEACG3AgIAuQQAIbgCAQCcBAAhuQIgALoEACG6AgEAnAQAIbsCAQCDBAAhFwkAAJ8FACAKAACgBQAgDAAAoQUAIA0AAKIFACAQAACjBQAgEQAApAUAIBYAAKYFACCIAgEAAAABmQJAAAAAAZoCQAAAAAGuAgEAAAABrwIBAAAAAbACQAAAAAGxAgEAAAABsgIBAAAAAbMCAQAAAAG1AgAAALUCArYCEAAAAAG3AgIAAAABuAIBAAAAAbkCIAAAAAG6AgEAAAABuwIBAAAAAQIAAAAPACApAADuBwAgGQQAANsGACAFAADcBgAgBgAA3QYAIAwAAN8GACANAADgBgAgEAAA4QYAIBEAAOMGACAXAADeBgAgGAAA4gYAIBoAAOUGACAbAADmBgAgHAAA5wYAIIgCAQAAAAGZAkAAAAABmgJAAAAAAZ8CAAAA2gICuAIBAAAAAcACAQAAAAHUAgEAAAAB1QIgAAAAAdcCAAAA1wIC2AIBAAAAAdoCIAAAAAHbAiAAAAAB3AJAAAAAAQIAAABjACApAADwBwAgAwAAAA0AICkAAO4HACAqAAD0BwAgGQAAAA0AIAkAALsEACAKAAC8BAAgDAAAvQQAIA0AAL4EACAQAAC_BAAgEQAAwAQAIBYAAMIEACAiAAD0BwAgiAIBAIMEACGZAkAAhAQAIZoCQACEBAAhrgIBAIMEACGvAgEAgwQAIbACQACEBAAhsQIBAIMEACGyAgEAnAQAIbMCAQCcBAAhtQIAALgEtQIitgIQAJkEACG3AgIAuQQAIbgCAQCcBAAhuQIgALoEACG6AgEAnAQAIbsCAQCDBAAhFwkAALsEACAKAAC8BAAgDAAAvQQAIA0AAL4EACAQAAC_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_0wEGgAHUARKBAdcBOYIB2AE9gwHZAQ2EAdoBDYUB2wENhgHcAQ2HAd0BDYgB3wENiQHhARKKAeIBPosB5AENjAHmARKNAecBP44B6AENjwHpAQ2QAeoBEpEB7QFAkgHuAUSTAe8BDpQB8AEOlQHxAQ6WAfIBDpcB8wEOmAH1AQ6ZAfcBEpoB-AFFmwH6AQ6cAfwBEp0B_QFGngH-AQ6fAf8BDqABgAISoQGDAkeiAYQCS6MBhQIFpAGGAgWlAYcCBaYBiAIFpwGJAgWoAYsCBakBjQISqgGOAkyrAZECBawBkwISrQGUAk2uAZYCBa8BlwIFsAGYAhKzAZsCTrQBnAJUtQGdAgq2AZ4CCrcBnwIKuAGgAgq5AaECCroBowIKuwGlAhK8AaYCVb0BqAIKvgGqAhK_AasCVsABrAIKwQGtAgrCAa4CEsMBsQJXxAGyAlvFAbMCCMYBtAIIxwG1AgjIAbYCCMkBtwIIygG5AgjLAbsCEswBvAJczQG-AgjOAcACEs8BwQJd0AHCAgjRAcMCCNIBxAIS0wHHAl7UAcgCYtUByQIJ1gHKAgnXAcsCCdgBzAIJ2QHNAgnaAc8CCdsB0QIS3AHSAmPdAdQCCd4B1gIS3wHXAmTgAdgCCeEB2QIJ4gHaAhLjAd0CZeQB3gJr5QHfAgvmAeACC-cB4QIL6AHiAgvpAeMCC-oB5QIL6wHnAhLsAegCbO0B6gIL7gHsAhLvAe0CbfAB7gIL8QHvAgvyAfACEvMB8wJu9AH0AnT1AfUCDPYB9gIM9wH3Agz4AfgCDPkB-QIM-gH7Agz7Af0CEvwB_gJ1_QGAAwz-AYIDEv8BgwN2gAKEAwyBAoUDDIIChgMSgwKJA3eEAooDew"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AdminScalarFieldEnum: () => AdminScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  ConversationScalarFieldEnum: () => ConversationScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  EventScalarFieldEnum: () => EventScalarFieldEnum,
  InvitationScalarFieldEnum: () => InvitationScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  MessageScalarFieldEnum: () => MessageScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  ParticipantScalarFieldEnum: () => ParticipantScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SavedEventScalarFieldEnum: () => SavedEventScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.5.0",
  engine: "280c870be64f457428992c43c1f6d557fab6e29e"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Admin: "Admin",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Category: "Category",
  Conversation: "Conversation",
  Message: "Message",
  Event: "Event",
  Invitation: "Invitation",
  Participant: "Participant",
  Payment: "Payment",
  Review: "Review",
  SavedEvent: "SavedEvent"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AdminScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  address: "address",
  gender: "gender",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  icon: "icon",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ConversationScalarFieldEnum = {
  id: "id",
  eventId: "eventId",
  userId: "userId",
  organizerId: "organizerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MessageScalarFieldEnum = {
  id: "id",
  conversationId: "conversationId",
  senderId: "senderId",
  content: "content",
  isRead: "isRead",
  createdAt: "createdAt"
};
var EventScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  date: "date",
  time: "time",
  venue: "venue",
  eventLink: "eventLink",
  type: "type",
  fee: "fee",
  maxAttendees: "maxAttendees",
  image: "image",
  isFeatured: "isFeatured",
  categoryId: "categoryId",
  organizerId: "organizerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InvitationScalarFieldEnum = {
  id: "id",
  status: "status",
  eventId: "eventId",
  inviterId: "inviterId",
  inviteeId: "inviteeId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ParticipantScalarFieldEnum = {
  id: "id",
  status: "status",
  eventId: "eventId",
  userId: "userId",
  joinedAt: "joinedAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  method: "method",
  status: "status",
  transactionId: "transactionId",
  stripeEventId: "stripeEventId",
  gatewayData: "gatewayData",
  userId: "userId",
  eventId: "eventId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  eventId: "eventId",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SavedEventScalarFieldEnum = {
  id: "id",
  userId: "userId",
  eventId: "eventId",
  savedAt: "savedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER"
};
var UserStatus = {
  BLOCKED: "BLOCKED",
  DELETED: "DELETED",
  ACTIVE: "ACTIVE"
};
var ParticipantStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  BANNED: "BANNED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
};
var PaymentMethod = {
  STRIPE: "STRIPE",
  SSLCOMMERZ: "SSLCOMMERZ",
  SHURJOPAY: "SHURJOPAY"
};
var InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/config/env.ts
import dotenv from "dotenv";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/config/env.ts
import status from "http-status";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVariable = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "ADMIN_NAME",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD"
  ];
  requiredEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status.INTERNAL_SERVER_ERROR,
        `Missing required environment variable: ${variable}`
      );
    }
  });
  return {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    ADMIN_NAME: process.env.ADMIN_NAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
  };
};
var envVars = loadEnvVariables();

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import ejs from "ejs";
import path2 from "path";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: true,
  // true for port 465
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  }
});
var sendEmail = async (options) => {
  const { to, subject, templateName, templateData, attachments } = options;
  const templatePath = path2.resolve(
    process.cwd(),
    `src/app/templates/${templateName}.ejs`
  );
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: `"Event Management Platform" <${envVars.EMAIL_SENDER.SMTP_FROM}>`,
    to,
    subject,
    html,
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
      contentType: a.contentType
    }))
  });
};

// src/app/lib/auth.ts
var auth = betterAuth({
  // baseURL: envVars.BETTER_AUTH_URL,
  // for deployment
  baseURL: process.env.FRONTEND_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  plugins: [
    oAuthProxy(),
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            console.error(`User with email ${email} not found.`);
            return;
          }
          if (user.role === Role.SUPER_ADMIN) {
            console.log(`Super admin ${email} \u2014 skipping OTP.`);
            return;
          }
          if (!user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify Your Email - Event Management Platform",
              templateName: "otp",
              templateData: { name: user.name, otp }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            sendEmail({
              to: email,
              subject: "Password Reset OTP - Event Management Platform",
              templateName: "otp",
              templateData: { name: user.name, otp }
            });
          }
        }
      },
      expiresIn: 2 * 60,
      // 2 minutes
      otpLength: 6
    })
  ],
  emailAndPassword: {
    enabled: true
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent",
      mapProfileToUser: () => {
        return {
          role: Role.USER,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: ""
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  // trustedOrigins: [
  //   process.env.BETTER_AUTH_URL || "http://localhost:5000",
  //   envVars.FRONTEND_URL,
  // ],
  //  for diployment
  trustedOrigins: [process.env.FRONTEND_URL],
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day in seconds
    }
  },
  // Advance
  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        name: "session_token",
        // Force this exact name
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        name: "session_token",
        // Force this exact name
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/app/app.ts
import { toNodeHandler } from "better-auth/node";
import path3 from "path";
import qs from "qs";

// src/app/module/auth/auth.router.ts
import { Router } from "express";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/module/auth/auth.service.ts
import status2 from "http-status";

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, options) => {
  const token = jwt.sign(
    payload,
    secret,
    options.expiresIn ? { expiresIn: options.expiresIn } : {}
  );
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while verifying the token.",
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  if (!decoded) {
    return {
      success: false,
      message: "Failed to decode token."
    };
  }
  return {
    success: true,
    data: decoded
  };
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    {
      expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN
    }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    {
      expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN
    }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/auth.service.ts
var registerUser = async (payload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
    }
  });
  if (!data.user) {
    throw new AppError_default(status2.BAD_REQUEST, "Failed to register user");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (!data.user.emailVerified) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "Please verify your email before logging in. Check your inbox for the verification code."
    );
  }
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "Your account is blocked. Please contact support."
    );
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(
      status2.FORBIDDEN,
      "Your account has been deleted. Please contact support."
    );
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var getMe = async (user) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: user.userId },
    include: {
      admin: true,
      organizedEvents: true,
      participants: {
        include: {
          event: true
        }
      },
      reviews: true,
      invitations: true,
      invitedTo: true
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  return isUserExist;
};
var getNewToken = async (refreshToken, sessionToken) => {
  let isSessionExits = await prisma.session.findUnique({
    where: { token: sessionToken }
  });
  if (!isSessionExits) {
    try {
      const decoded = decodeURIComponent(sessionToken);
      if (decoded !== sessionToken) {
        isSessionExits = await prisma.session.findUnique({
          where: { token: decoded }
        });
      }
    } catch {
    }
  }
  if (!isSessionExits) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    email: data.email,
    name: data.name,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    email: data.email,
    name: data.name,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const sessionUpdateData = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
      // 30 days
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: sessionUpdateData.token
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var forgetPassword = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status2.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status2.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (isUserExist.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExist.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
  });
};
var resendOTP = async (email, type) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  if (type === "email-verification" && user.emailVerified) {
    throw new AppError_default(status2.BAD_REQUEST, "Email is already verified");
  }
  await auth.api.sendVerificationOTP({
    body: {
      email,
      type
    }
  });
};
var googleLoginSuccess = async (session) => {
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    accessToken,
    refreshToken
  };
};
var authService = {
  registerUser,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  resendOTP,
  googleLoginSuccess
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/module/auth/auth.controller.ts
import status3 from "http-status";
var registerUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.registerUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await authService.getMe(user);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User logged in successfully",
    data: result
  });
});
var getNewToken2 = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new AppError_default(status3.UNAUTHORIZED, "Refresh token is missing");
  }
  if (!betterAuthSessionToken) {
    throw new AppError_default(status3.UNAUTHORIZED, "Session token is missing");
  }
  const result = await authService.getNewToken(
    refreshToken,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "New token generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken,
      token: sessionToken
    }
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.changePassword(
    payload,
    betterAuthSessionToken
  );
  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, result.token);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var logoutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.logoutUser(betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Email verified successfully"
  });
});
var forgetPassword2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Password reset OTP sent to email successfully"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var resendOTP2 = catchAsync(async (req, res) => {
  const { email, type } = req.body;
  await authService.resendOTP(email, type || "email-verification");
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "OTP sent successfully. Please check your email."
  });
});
var googleLogin = catchAsync((req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await authService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var authController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  changePassword: changePassword2,
  logoutUser: logoutUser2,
  verifyEmail: verifyEmail2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  resendOTP: resendOTP2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError
};

// src/app/middleware/checkAuth.ts
import status4 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    if (!sessionToken) {
      throw new Error("Unauthorized access! No session token provided.");
    }
    if (sessionToken) {
      const sessionExits = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExits && sessionExits.user) {
        const user = sessionExits.user;
        const now = /* @__PURE__ */ new Date();
        const expiredAt = new Date(sessionExits.expiresAt);
        const createdAt = new Date(sessionExits.createdAt);
        const sessionLifetime = expiredAt.getTime() - createdAt.getTime();
        const timeRemaining = expiredAt.getTime() - now.getTime();
        const percentRemaining = timeRemaining / sessionLifetime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiredAt.toISOString());
          res.setHeader("X-Time-Remaining", percentRemaining.toString());
          console.log(
            `Session token is nearing expiration. Time remaining: ${percentRemaining.toFixed(2)}%`
          );
        }
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
          throw new AppError_default(
            status4.UNAUTHORIZED,
            "User is not allowed to access this resource."
          );
        }
        if (user.isDeleted) {
          throw new AppError_default(
            status4.UNAUTHORIZED,
            "User account has been deleted."
          );
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new AppError_default(
            status4.FORBIDDEN,
            "You do not have permission to access this resource."
          );
        }
        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role
        };
        return next();
      }
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(
        status4.UNAUTHORIZED,
        "Unauthorized access! No access token provided."
      );
    }
    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      envVars.ACCESS_TOKEN_SECRET
    );
    if (!verifiedToken.success) {
      throw new AppError_default(
        status4.UNAUTHORIZED,
        "Unauthorized access! Invalid access token."
      );
    }
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(
        status4.FORBIDDEN,
        "Forbidden access! You do not have permission to access this resource."
      );
    }
    req.user = {
      userId: verifiedToken.data.userId,
      email: verifiedToken.data.email,
      role: verifiedToken.data.role
    };
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/module/auth/auth.router.ts
var authRouter = Router();
authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);
authRouter.get(
  "/me",
  checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN),
  authController.getMe
);
authRouter.post("/refresh-token", authController.getNewToken);
authRouter.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN),
  authController.changePassword
);
authRouter.post(
  "/logout",
  checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN),
  authController.logoutUser
);
authRouter.post("/verify-email", authController.verifyEmail);
authRouter.post("/resend-otp", authController.resendOTP);
authRouter.post("/forget-password", authController.forgetPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.get("/login/google", authController.googleLogin);
authRouter.get("/google/success", authController.googleLoginSuccess);
authRouter.get("/oauth/error", authController.handleOAuthError);
var auth_router_default = authRouter;

// src/app/module/user/user.router.ts
import { Router as Router2 } from "express";

// src/app/module/user/user.service.ts
import status6 from "http-status";

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status5 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var uploadFileToCloudinary = async (buffer, fileName) => {
  if (!buffer || !fileName) {
    throw new AppError_default(
      status5.BAD_REQUEST,
      "File buffer and file name are required for upload"
    );
  }
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        public_id: `event-management/images/${uniqueName}`,
        folder: "event-management/images"
      },
      (error, result) => {
        if (error) {
          return reject(
            new AppError_default(
              status5.INTERNAL_SERVER_ERROR,
              "Failed to upload image to Cloudinary"
            )
          );
        }
        resolve(result);
      }
    ).end(buffer);
  });
};
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
      });
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(
      status5.INTERNAL_SERVER_ERROR,
      "Failed to delete file from Cloudinary"
    );
  }
};

// src/app/module/user/user.service.ts
var createAdmin = async (payload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email
    }
  });
  if (userExists) {
    throw new AppError_default(status6.CONFLICT, "User with this email already exists");
  }
  const { admin, role, password } = payload;
  const userData = await auth.api.signUpEmail({
    body: {
      ...admin,
      password,
      role,
      needPasswordChange: true
    }
  });
  try {
    const adminData = await prisma.admin.create({
      data: {
        userId: userData.user.id,
        ...admin
      }
    });
    return adminData;
  } catch (error) {
    console.log(error);
    await prisma.user.delete({
      where: { id: userData.user.id }
    });
    throw new Error("Failed to create admin", { cause: error });
  }
};
var updateProfile = async (userId, payload, file) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError_default(status6.NOT_FOUND, "User not found");
  }
  const updateData = {
    ...payload
  };
  if (file) {
    if (user.image) {
      await deleteFileFromCloudinary(user.image);
    }
    const uploaded = await uploadFileToCloudinary(file.buffer, file.originalname);
    updateData.image = uploaded.secure_url;
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData
  });
  return updatedUser;
};
var getMyDashboard = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError_default(status6.NOT_FOUND, "User not found");
  }
  const now = /* @__PURE__ */ new Date();
  const [
    // Counts
    organizedCount,
    participationCount,
    pendingInvitations,
    reviewCount,
    savedCount,
    totalSpent,
    // Participation status breakdown
    pendingParticipations,
    approvedParticipations,
    rejectedParticipations,
    // Upcoming events (organized by me)
    upcomingOrganized,
    // Upcoming events (participating in)
    upcomingParticipating,
    // Recent data
    recentOrganizedEvents,
    recentParticipations,
    recentInvitations,
    recentReviews,
    recentSavedEvents
  ] = await Promise.all([
    // Counts
    prisma.event.count({ where: { organizerId: userId } }),
    prisma.participant.count({ where: { userId } }),
    prisma.invitation.count({ where: { inviteeId: userId, status: "PENDING" } }),
    prisma.review.count({ where: { userId } }),
    prisma.savedEvent.count({ where: { userId } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { userId, status: "SUCCESS" }
    }),
    // Participation status breakdown
    prisma.participant.count({ where: { userId, status: "PENDING" } }),
    prisma.participant.count({ where: { userId, status: "APPROVED" } }),
    prisma.participant.count({ where: { userId, status: "REJECTED" } }),
    // Upcoming events I organized
    prisma.event.count({
      where: { organizerId: userId, date: { gte: now } }
    }),
    // Upcoming events I'm participating in
    prisma.participant.count({
      where: { userId, status: "APPROVED", event: { date: { gte: now } } }
    }),
    // Recent organized events
    prisma.event.findMany({
      where: { organizerId: userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        date: true,
        type: true,
        fee: true,
        isFeatured: true,
        _count: {
          select: { participants: true, reviews: true }
        }
      }
    }),
    // Recent participations
    prisma.participant.findMany({
      where: { userId },
      take: 5,
      orderBy: { joinedAt: "desc" },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            type: true,
            venue: true
          }
        }
      }
    }),
    // Pending invitations
    prisma.invitation.findMany({
      where: { inviteeId: userId, status: "PENDING" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          select: { id: true, title: true, date: true }
        },
        inviter: {
          select: { id: true, name: true }
        }
      }
    }),
    // Recent reviews
    prisma.review.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          select: { id: true, title: true }
        }
      }
    }),
    // Recent saved events
    prisma.savedEvent.findMany({
      where: { userId },
      take: 5,
      orderBy: { savedAt: "desc" },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            type: true,
            fee: true,
            venue: true
          }
        }
      }
    })
  ]);
  return {
    counts: {
      organizedEvents: organizedCount,
      participations: participationCount,
      pendingInvitations,
      reviews: reviewCount,
      savedEvents: savedCount,
      totalSpent: Number(totalSpent._sum.amount || 0)
    },
    upcoming: {
      organizedEvents: upcomingOrganized,
      participatingEvents: upcomingParticipating
    },
    participationBreakdown: {
      pending: pendingParticipations,
      approved: approvedParticipations,
      rejected: rejectedParticipations
    },
    recentOrganizedEvents,
    recentParticipations,
    pendingInvitations: recentInvitations,
    recentReviews,
    recentSavedEvents
  };
};
var userService = {
  createAdmin,
  updateProfile,
  getMyDashboard
};

// src/app/module/user/user.controller.ts
import status7 from "http-status";
var createAdmin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await userService.createAdmin(payload);
  sendResponse(res, {
    httpStatusCode: status7.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result
  });
});
var updateProfile2 = catchAsync(async (req, res) => {
  const result = await userService.updateProfile(req.user.userId, req.body, req.file);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var getMyDashboard2 = catchAsync(async (req, res) => {
  const result = await userService.getMyDashboard(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Dashboard data retrieved successfully",
    data: result
  });
});
var userController = {
  createAdmin: createAdmin2,
  updateProfile: updateProfile2,
  getMyDashboard: getMyDashboard2
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/module/user/user.validation.ts
import z from "zod";
var createAdminZodSchema = z.object({
  password: z.string("Password is required").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  admin: z.object({
    name: z.string("Name is required and must be string").min(5, "Name must be at least 5 characters").max(30, "Name must be at most 30 characters"),
    email: z.email("Invalid email address"),
    contactNumber: z.string("Contact number is required").min(11, "Contact number must be at least 11 characters").max(14, "Contact number must be at most 15 characters").optional(),
    profilePhoto: z.url("Profile photo must be a valid URL").optional()
  }),
  role: z.enum(
    ["ADMIN", "SUPER_ADMIN"],
    "Role must be either ADMIN or SUPER_ADMIN"
  )
});
var updateProfileZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters").optional(),
  phone: z.string().min(11, "Phone must be at least 11 characters").max(14, "Phone must be at most 14 characters").optional()
});
var UserValidation = {
  createAdminZodSchema,
  updateProfileZodSchema
};

// src/app/config/multer.config.ts
import multer from "multer";
var storage = multer.memoryStorage();
var multerUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"));
    }
  }
});

// src/app/module/user/user.router.ts
var userRouter = Router2();
userRouter.get(
  "/dashboard",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  userController.getMyDashboard
);
userRouter.patch(
  "/profile",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("image"),
  validateRequest(UserValidation.updateProfileZodSchema),
  userController.updateProfile
);
userRouter.post(
  "/create-admin",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(UserValidation.createAdminZodSchema),
  userController.createAdmin
);
var user_router_default = userRouter;

// src/app/module/event/event.router.ts
import { Router as Router3 } from "express";

// src/app/module/event/event.service.ts
import status8 from "http-status";
var EVENT_SEARCHABLE_FIELDS = ["title", "description", "venue"];
var EVENT_FILTERABLE_FIELDS = ["type", "isFeatured", "organizerId", "categoryId"];
var createEvent = async (organizerId, payload, file) => {
  let imageUrl = null;
  if (file) {
    const uploaded = await uploadFileToCloudinary(file.buffer, file.originalname);
    imageUrl = uploaded.secure_url;
  }
  const data = {
    title: payload.title,
    description: payload.description,
    date: new Date(payload.date),
    time: payload.time,
    venue: payload.venue ?? null,
    eventLink: payload.eventLink ?? null,
    image: imageUrl,
    organizerId,
    categoryId: payload.categoryId ?? null
  };
  if (payload.type) data.type = payload.type;
  if (payload.fee !== void 0) data.fee = payload.fee;
  if (payload.maxAttendees !== void 0) data.maxAttendees = payload.maxAttendees;
  const event = await prisma.event.create({
    data,
    include: {
      category: true,
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return event;
};
var getAllEvents = async (query) => {
  const {
    searchTerm,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
    ...filters
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: EVENT_SEARCHABLE_FIELDS.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive"
        }
      }))
    });
  }
  for (const key of Object.keys(filters)) {
    if (EVENT_FILTERABLE_FIELDS.includes(key) && filters[key]) {
      const value = filters[key];
      if (key === "isFeatured") {
        andConditions.push({ [key]: value === "true" });
      } else {
        andConditions.push({ [key]: value });
      }
    }
  }
  if (filters.startDate || filters.endDate) {
    const dateFilter = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) dateFilter.lte = new Date(filters.endDate);
    andConditions.push({ date: dateFilter });
  }
  if (filters.minFee || filters.maxFee) {
    const feeFilter = {};
    if (filters.minFee) feeFilter.gte = Number(filters.minFee);
    if (filters.maxFee) feeFilter.lte = Number(filters.maxFee);
    andConditions.push({ fee: feeFilter });
  }
  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: {
            participants: true,
            reviews: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.event.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var getEventById = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      category: true,
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      },
      _count: {
        select: {
          participants: true,
          reviews: true
        }
      }
    }
  });
  if (!event) {
    throw new AppError_default(status8.NOT_FOUND, "Event not found");
  }
  return event;
};
var getMyEvents = async (organizerId, query) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = { organizerId };
  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        _count: {
          select: {
            participants: true,
            reviews: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.event.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var updateEvent = async (eventId, userId, userRole, payload, file) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status8.NOT_FOUND, "Event not found");
  }
  if (event.organizerId !== userId && userRole === Role.USER) {
    throw new AppError_default(
      status8.FORBIDDEN,
      "You are not authorized to update this event"
    );
  }
  const updateData = { ...payload };
  if (payload.date) {
    updateData.date = new Date(payload.date);
  }
  if (file) {
    if (event.image) {
      await deleteFileFromCloudinary(event.image);
    }
    const uploaded = await uploadFileToCloudinary(file.buffer, file.originalname);
    updateData.image = uploaded.secure_url;
  }
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: updateData,
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return updatedEvent;
};
var deleteEvent = async (eventId, userId, userRole) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status8.NOT_FOUND, "Event not found");
  }
  if (event.organizerId !== userId && userRole === Role.USER) {
    throw new AppError_default(
      status8.FORBIDDEN,
      "You are not authorized to delete this event"
    );
  }
  if (event.image) {
    await deleteFileFromCloudinary(event.image);
  }
  const deletedEvent = await prisma.event.delete({
    where: { id: eventId }
  });
  return deletedEvent;
};
var toggleFeatured = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status8.NOT_FOUND, "Event not found");
  }
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: { isFeatured: !event.isFeatured }
  });
  return updatedEvent;
};
var getPlatformStats = async () => {
  const [totalUsers, totalEvents, totalTicketsSold, ratingResult] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.event.count(),
    prisma.participant.count({ where: { status: "APPROVED" } }),
    prisma.review.aggregate({ _avg: { rating: true } })
  ]);
  return {
    totalUsers,
    totalEvents,
    totalTicketsSold,
    avgRating: ratingResult._avg.rating ? Number(ratingResult._avg.rating.toFixed(1)) : 0
  };
};
var eventService = {
  createEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
  updateEvent,
  deleteEvent,
  toggleFeatured,
  getPlatformStats
};

// src/app/module/event/event.controller.ts
import status9 from "http-status";
var createEvent2 = catchAsync(async (req, res) => {
  const result = await eventService.createEvent(
    req.user.userId,
    req.body,
    req.file
  );
  sendResponse(res, {
    httpStatusCode: status9.CREATED,
    success: true,
    message: "Event created successfully",
    data: result
  });
});
var getAllEvents2 = catchAsync(async (req, res) => {
  const result = await eventService.getAllEvents(req.query);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Events retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getEventById2 = catchAsync(async (req, res) => {
  const result = await eventService.getEventById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Event retrieved successfully",
    data: result
  });
});
var getMyEvents2 = catchAsync(async (req, res) => {
  const result = await eventService.getMyEvents(
    req.user.userId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "My events retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var updateEvent2 = catchAsync(async (req, res) => {
  const result = await eventService.updateEvent(
    req.params.id,
    req.user.userId,
    req.user.role,
    req.body,
    req.file
  );
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Event updated successfully",
    data: result
  });
});
var deleteEvent2 = catchAsync(async (req, res) => {
  await eventService.deleteEvent(
    req.params.id,
    req.user.userId,
    req.user.role
  );
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Event deleted successfully"
  });
});
var toggleFeatured2 = catchAsync(async (req, res) => {
  const result = await eventService.toggleFeatured(req.params.id);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: `Event ${result.isFeatured ? "featured" : "unfeatured"} successfully`,
    data: result
  });
});
var getPlatformStats2 = catchAsync(async (req, res) => {
  const result = await eventService.getPlatformStats();
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Platform stats retrieved successfully",
    data: result
  });
});
var eventController = {
  createEvent: createEvent2,
  getAllEvents: getAllEvents2,
  getEventById: getEventById2,
  getMyEvents: getMyEvents2,
  updateEvent: updateEvent2,
  deleteEvent: deleteEvent2,
  toggleFeatured: toggleFeatured2,
  getPlatformStats: getPlatformStats2
};

// src/app/module/event/event.validation.ts
import z2 from "zod";
var createEventZodSchema = z2.object({
  title: z2.string("Title is required").min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  description: z2.string("Description is required").min(10, "Description must be at least 10 characters"),
  date: z2.string("Date is required").datetime("Invalid date format"),
  time: z2.string("Time is required").min(1, "Time is required"),
  venue: z2.string().optional(),
  eventLink: z2.string().url("Event link must be a valid URL").optional(),
  type: z2.enum(["PUBLIC", "PRIVATE"]).optional(),
  fee: z2.coerce.number().min(0, "Fee cannot be negative").optional(),
  maxAttendees: z2.coerce.number().int().min(1, "Max attendees must be at least 1").optional(),
  categoryId: z2.string("Category ID is required").uuid("Invalid category ID")
});
var updateEventZodSchema = z2.object({
  title: z2.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters").optional(),
  description: z2.string().min(10, "Description must be at least 10 characters").optional(),
  date: z2.string().datetime("Invalid date format").optional(),
  time: z2.string().min(1).optional(),
  venue: z2.string().nullable().optional(),
  eventLink: z2.string().url("Event link must be a valid URL").nullable().optional(),
  type: z2.enum(["PUBLIC", "PRIVATE"]).optional(),
  fee: z2.coerce.number().min(0, "Fee cannot be negative").optional(),
  maxAttendees: z2.coerce.number().int().min(1, "Max attendees must be at least 1").nullable().optional(),
  categoryId: z2.string().uuid("Invalid category ID").optional()
});
var EventValidation = {
  createEventZodSchema,
  updateEventZodSchema
};

// src/app/module/event/event.router.ts
var eventRouter = Router3();
eventRouter.get("/", eventController.getAllEvents);
eventRouter.get("/platform-stats", eventController.getPlatformStats);
eventRouter.get(
  "/my-events",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  eventController.getMyEvents
);
eventRouter.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("image"),
  validateRequest(EventValidation.createEventZodSchema),
  eventController.createEvent
);
eventRouter.get("/:id", eventController.getEventById);
eventRouter.patch(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("image"),
  validateRequest(EventValidation.updateEventZodSchema),
  eventController.updateEvent
);
eventRouter.delete(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  eventController.deleteEvent
);
eventRouter.patch(
  "/:id/toggle-featured",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  eventController.toggleFeatured
);
var event_router_default = eventRouter;

// src/app/module/participant/participant.router.ts
import { Router as Router4 } from "express";

// src/app/module/participant/participant.service.ts
import status10 from "http-status";
var joinEvent = async (userId, eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status10.NOT_FOUND, "Event not found");
  }
  if (event.organizerId === userId) {
    throw new AppError_default(
      status10.BAD_REQUEST,
      "You cannot join your own event"
    );
  }
  const existingParticipant = await prisma.participant.findUnique({
    where: {
      eventId_userId: { eventId, userId }
    }
  });
  if (existingParticipant) {
    if (existingParticipant.status === ParticipantStatus.BANNED) {
      throw new AppError_default(
        status10.FORBIDDEN,
        "You have been banned from this event"
      );
    }
    throw new AppError_default(
      status10.CONFLICT,
      "You have already joined this event"
    );
  }
  const autoApprove = event.type === "PUBLIC" && Number(event.fee) === 0;
  const participant = await prisma.participant.create({
    data: {
      eventId,
      userId,
      status: autoApprove ? ParticipantStatus.APPROVED : ParticipantStatus.PENDING
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          type: true,
          fee: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return participant;
};
var getEventParticipants = async (eventId, query) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "joinedAt",
    sortOrder = "desc",
    status: participantStatus
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status10.NOT_FOUND, "Event not found");
  }
  const where = { eventId };
  if (participantStatus) {
    where.status = participantStatus;
  }
  const [data, total] = await Promise.all([
    prisma.participant.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.participant.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var getMyParticipations = async (userId, query) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "joinedAt",
    sortOrder = "desc",
    status: participantStatus
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = { userId };
  if (participantStatus) {
    where.status = participantStatus;
  }
  const [data, total] = await Promise.all([
    prisma.participant.findMany({
      where,
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.participant.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var updateParticipantStatus = async (participantId, userId, newStatus) => {
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      event: true
    }
  });
  if (!participant) {
    throw new AppError_default(status10.NOT_FOUND, "Participant not found");
  }
  if (participant.event.organizerId !== userId) {
    throw new AppError_default(
      status10.FORBIDDEN,
      "Only the event organizer can update participant status"
    );
  }
  if (participant.status === ParticipantStatus.BANNED && newStatus !== ParticipantStatus.APPROVED) {
    throw new AppError_default(
      status10.BAD_REQUEST,
      "Banned participant can only be unbanned (set to APPROVED)"
    );
  }
  const updatedParticipant = await prisma.participant.update({
    where: { id: participantId },
    data: { status: newStatus },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      event: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });
  return updatedParticipant;
};
var cancelParticipation = async (eventId, userId) => {
  const participant = await prisma.participant.findUnique({
    where: {
      eventId_userId: { eventId, userId }
    }
  });
  if (!participant) {
    throw new AppError_default(status10.NOT_FOUND, "Participation not found");
  }
  if (participant.status === ParticipantStatus.BANNED) {
    throw new AppError_default(
      status10.FORBIDDEN,
      "You have been banned from this event and cannot cancel"
    );
  }
  const deletedParticipant = await prisma.participant.delete({
    where: {
      eventId_userId: { eventId, userId }
    }
  });
  return deletedParticipant;
};
var participantService = {
  joinEvent,
  getEventParticipants,
  getMyParticipations,
  updateParticipantStatus,
  cancelParticipation
};

// src/app/module/participant/participant.controller.ts
import status11 from "http-status";
var joinEvent2 = catchAsync(async (req, res) => {
  const result = await participantService.joinEvent(
    req.user.userId,
    req.body.eventId
  );
  sendResponse(res, {
    httpStatusCode: status11.CREATED,
    success: true,
    message: "Successfully joined the event",
    data: result
  });
});
var getEventParticipants2 = catchAsync(
  async (req, res) => {
    const result = await participantService.getEventParticipants(
      req.params.eventId,
      req.query
    );
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Participants retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var getMyParticipations2 = catchAsync(
  async (req, res) => {
    const result = await participantService.getMyParticipations(
      req.user.userId,
      req.query
    );
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "My participations retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var updateParticipantStatus2 = catchAsync(
  async (req, res) => {
    const result = await participantService.updateParticipantStatus(
      req.params.participantId,
      req.user.userId,
      req.body.status
    );
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: `Participant ${req.body.status.toLowerCase()} successfully`,
      data: result
    });
  }
);
var cancelParticipation2 = catchAsync(
  async (req, res) => {
    await participantService.cancelParticipation(
      req.params.eventId,
      req.user.userId
    );
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Participation cancelled successfully"
    });
  }
);
var participantController = {
  joinEvent: joinEvent2,
  getEventParticipants: getEventParticipants2,
  getMyParticipations: getMyParticipations2,
  updateParticipantStatus: updateParticipantStatus2,
  cancelParticipation: cancelParticipation2
};

// src/app/module/participant/participant.validation.ts
import z3 from "zod";
var joinEventZodSchema = z3.object({
  eventId: z3.string("Event ID is required").uuid("Invalid event ID")
});
var updateParticipantStatusZodSchema = z3.object({
  status: z3.enum(
    ["APPROVED", "REJECTED", "BANNED"],
    "Status must be APPROVED, REJECTED, or BANNED"
  )
});
var ParticipantValidation = {
  joinEventZodSchema,
  updateParticipantStatusZodSchema
};

// src/app/module/participant/participant.router.ts
var participantRouter = Router4();
participantRouter.post(
  "/join",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ParticipantValidation.joinEventZodSchema),
  participantController.joinEvent
);
participantRouter.get(
  "/my-participations",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  participantController.getMyParticipations
);
participantRouter.get(
  "/event/:eventId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  participantController.getEventParticipants
);
participantRouter.patch(
  "/:participantId/status",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ParticipantValidation.updateParticipantStatusZodSchema),
  participantController.updateParticipantStatus
);
participantRouter.delete(
  "/cancel/:eventId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  participantController.cancelParticipation
);
var participant_router_default = participantRouter;

// src/app/module/payment/payment.router.ts
import { Router as Router5 } from "express";

// src/app/module/payment/payment.service.ts
import status12 from "http-status";

// src/app/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

// src/app/module/payment/payment.service.ts
var createCheckoutSession = async (userId, eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status12.NOT_FOUND, "Event not found");
  }
  if (Number(event.fee) === 0) {
    throw new AppError_default(
      status12.BAD_REQUEST,
      "This is a free event. No payment required."
    );
  }
  if (event.organizerId === userId) {
    throw new AppError_default(
      status12.BAD_REQUEST,
      "You cannot pay for your own event"
    );
  }
  const existingPayment = await prisma.payment.findFirst({
    where: {
      eventId,
      userId,
      status: PaymentStatus.SUCCESS
    }
  });
  if (existingPayment) {
    throw new AppError_default(
      status12.CONFLICT,
      "You have already paid for this event"
    );
  }
  const existingParticipant = await prisma.participant.findUnique({
    where: {
      eventId_userId: { eventId, userId }
    }
  });
  if (existingParticipant?.status === ParticipantStatus.BANNED) {
    throw new AppError_default(
      status12.FORBIDDEN,
      "You have been banned from this event"
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  const payment = await prisma.payment.create({
    data: {
      amount: Number(event.fee),
      method: PaymentMethod.STRIPE,
      status: PaymentStatus.PENDING,
      userId,
      eventId
    }
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: event.title,
            description: event.description.substring(0, 200)
          },
          unit_amount: Math.round(Number(event.fee) * 100)
        },
        quantity: 1
      }
    ],
    metadata: {
      eventId,
      userId,
      paymentId: payment.id
    },
    success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel?event_id=${eventId}`
  });
  await prisma.payment.update({
    where: { id: payment.id },
    data: { transactionId: session.id }
  });
  return {
    sessionId: session.id,
    url: session.url
  };
};
var handleStripeWebhookEvent = async (event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const eventId = session.metadata?.eventId;
      const userId = session.metadata?.userId;
      const paymentId = session.metadata?.paymentId;
      if (!eventId || !userId || !paymentId) {
        console.error("\u26A0\uFE0F Missing metadata in webhook event");
        return { message: "Missing metadata" };
      }
      const eventData = await prisma.event.findUnique({
        where: { id: eventId }
      });
      if (!eventData) {
        console.error(
          `\u26A0\uFE0F Event ${eventId} not found. Payment may be for deleted event.`
        );
        return { message: "Event not found" };
      }
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: session.payment_status === "paid" ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
            gatewayData: session,
            stripeEventId: event.id
          }
        });
        if (session.payment_status === "paid") {
          const existingParticipant = await tx.participant.findUnique({
            where: {
              eventId_userId: { eventId, userId }
            }
          });
          if (existingParticipant) {
            await tx.participant.update({
              where: {
                eventId_userId: { eventId, userId }
              },
              data: { status: ParticipantStatus.APPROVED }
            });
          } else {
            await tx.participant.create({
              data: {
                eventId,
                userId,
                status: ParticipantStatus.APPROVED
              }
            });
          }
        }
      });
      if (session.payment_status === "paid") {
        try {
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user) {
            await sendEmail({
              to: user.email,
              subject: `Payment Confirmed \u2014 ${eventData.title}`,
              templateName: "invoice",
              templateData: {
                userName: user.name,
                paymentId,
                transactionId: session.id || "",
                paymentDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
                eventTitle: eventData.title,
                eventDate: new Date(eventData.date).toLocaleDateString(),
                eventVenue: eventData.venue || null,
                amount: Number(eventData.fee).toFixed(2)
              }
            });
          }
        } catch (emailError) {
          console.error("Failed to send payment receipt email:", emailError);
        }
      }
      console.log(
        `\u2705 Payment ${session.payment_status} for event ${eventId}`
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId;
      if (paymentId) {
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: PaymentStatus.CANCELLED,
            gatewayData: session,
            stripeEventId: event.id
          }
        });
      }
      console.log(
        `Checkout session ${session.id} expired. Payment marked as cancelled.`
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      console.log(
        `Payment intent ${paymentIntent.id} failed. Marking associated payment as failed.`
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};
var getPaymentsByEvent = async (eventId, userId, query) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status12.NOT_FOUND, "Event not found");
  }
  if (event.organizerId !== userId) {
    throw new AppError_default(
      status12.FORBIDDEN,
      "Only the event organizer can view payments"
    );
  }
  const { page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc" } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = { eventId };
  const [data, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.payment.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var getMyPayments = async (userId, query) => {
  const { page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc" } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = { userId };
  const [data, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            venue: true,
            fee: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.payment.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var verifyPayment = async (sessionId, userId) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: sessionId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          time: true,
          venue: true,
          eventLink: true,
          type: true,
          fee: true,
          image: true,
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  if (!payment) {
    throw new AppError_default(status12.NOT_FOUND, "Payment not found");
  }
  if (payment.userId !== userId) {
    throw new AppError_default(
      status12.FORBIDDEN,
      "You are not authorized to view this payment"
    );
  }
  const participant = await prisma.participant.findUnique({
    where: {
      eventId_userId: { eventId: payment.eventId, userId }
    },
    select: {
      status: true,
      joinedAt: true
    }
  });
  return {
    // Payment info
    paymentId: payment.id,
    transactionId: payment.transactionId,
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    paidAt: payment.createdAt,
    // Ticket/Participant info
    ticket: {
      participantStatus: participant?.status || null,
      joinedAt: participant?.joinedAt || null
    },
    // Event info
    event: payment.event,
    // User info
    user: payment.user
  };
};
var getPaymentReceipt = async (paymentId, userId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          time: true,
          venue: true,
          eventLink: true,
          type: true,
          fee: true,
          image: true,
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  if (!payment) {
    throw new AppError_default(status12.NOT_FOUND, "Payment not found");
  }
  if (payment.userId !== userId) {
    throw new AppError_default(
      status12.FORBIDDEN,
      "You are not authorized to view this payment"
    );
  }
  const participant = await prisma.participant.findUnique({
    where: {
      eventId_userId: { eventId: payment.eventId, userId }
    },
    select: {
      status: true,
      joinedAt: true
    }
  });
  return {
    paymentId: payment.id,
    transactionId: payment.transactionId,
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    paidAt: payment.createdAt,
    ticket: {
      participantStatus: participant?.status || null,
      joinedAt: participant?.joinedAt || null
    },
    event: payment.event,
    user: payment.user
  };
};
var paymentService = {
  createCheckoutSession,
  handleStripeWebhookEvent,
  getPaymentsByEvent,
  getMyPayments,
  verifyPayment,
  getPaymentReceipt
};

// src/app/module/payment/payment.controller.ts
import status13 from "http-status";
var createCheckoutSession2 = catchAsync(
  async (req, res) => {
    const result = await paymentService.createCheckoutSession(
      req.user.userId,
      req.body.eventId
    );
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "Checkout session created successfully",
      data: result
    });
  }
);
var handleStripeWebhookEvent2 = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      envVars.STRIPE_WEBHOOK_SECRET
    );
    const result = await paymentService.handleStripeWebhookEvent(event);
    res.status(200).json(result);
  } catch {
    res.status(400).json({ error: "Webhook processing failed" });
  }
};
var getPaymentsByEvent2 = catchAsync(
  async (req, res) => {
    const result = await paymentService.getPaymentsByEvent(
      req.params.eventId,
      req.user.userId,
      req.query
    );
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "Payments retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var getMyPayments2 = catchAsync(async (req, res) => {
  const result = await paymentService.getMyPayments(
    req.user.userId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "My payments retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var verifyPayment2 = catchAsync(async (req, res) => {
  const result = await paymentService.verifyPayment(
    req.params.sessionId,
    req.user.userId
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Payment verified successfully",
    data: result
  });
});
var getPaymentReceipt2 = catchAsync(async (req, res) => {
  const result = await paymentService.getPaymentReceipt(
    req.params.paymentId,
    req.user.userId
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Payment receipt retrieved successfully",
    data: result
  });
});
var paymentController = {
  createCheckoutSession: createCheckoutSession2,
  handleStripeWebhookEvent: handleStripeWebhookEvent2,
  getPaymentsByEvent: getPaymentsByEvent2,
  getMyPayments: getMyPayments2,
  verifyPayment: verifyPayment2,
  getPaymentReceipt: getPaymentReceipt2
};

// src/app/module/payment/payment.validation.ts
import z4 from "zod";
var createCheckoutSessionZodSchema = z4.object({
  eventId: z4.string("Event ID is required").uuid("Invalid event ID")
});
var PaymentValidation = {
  createCheckoutSessionZodSchema
};

// src/app/module/payment/payment.router.ts
var paymentRouter = Router5();
paymentRouter.post(
  "/create-checkout-session",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(PaymentValidation.createCheckoutSessionZodSchema),
  paymentController.createCheckoutSession
);
paymentRouter.get(
  "/my-payments",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  paymentController.getMyPayments
);
paymentRouter.get(
  "/verify/:sessionId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  paymentController.verifyPayment
);
paymentRouter.get(
  "/receipt/:paymentId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  paymentController.getPaymentReceipt
);
paymentRouter.get(
  "/event/:eventId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  paymentController.getPaymentsByEvent
);
var payment_router_default = paymentRouter;

// src/app/module/invitation/invitation.router.ts
import { Router as Router6 } from "express";

// src/app/module/invitation/invitation.service.ts
import status14 from "http-status";
var sendInvitation = async (inviterId, eventId, inviteeId) => {
  if (inviterId === inviteeId) {
    throw new AppError_default(status14.BAD_REQUEST, "You cannot invite yourself");
  }
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status14.NOT_FOUND, "Event not found");
  }
  if (event.organizerId !== inviterId) {
    throw new AppError_default(
      status14.FORBIDDEN,
      "Only the event organizer can send invitations"
    );
  }
  const invitee = await prisma.user.findUnique({
    where: { id: inviteeId }
  });
  if (!invitee) {
    throw new AppError_default(status14.NOT_FOUND, "Invitee user not found");
  }
  const existingInvitation = await prisma.invitation.findUnique({
    where: {
      eventId_inviteeId: { eventId, inviteeId }
    }
  });
  if (existingInvitation) {
    throw new AppError_default(
      status14.CONFLICT,
      "This user has already been invited to this event"
    );
  }
  const existingParticipant = await prisma.participant.findUnique({
    where: {
      eventId_userId: { eventId, userId: inviteeId }
    }
  });
  if (existingParticipant) {
    throw new AppError_default(
      status14.CONFLICT,
      "This user is already a participant of this event"
    );
  }
  const invitation = await prisma.invitation.create({
    data: {
      eventId,
      inviterId,
      inviteeId
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          type: true,
          fee: true,
          date: true,
          time: true,
          venue: true
        }
      },
      invitee: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      inviter: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  try {
    await sendEmail({
      to: invitee.email,
      subject: `You're invited to "${invitation.event.title}"`,
      templateName: "invitation",
      templateData: {
        inviteeName: invitee.name,
        inviterName: invitation.inviter.name,
        eventTitle: invitation.event.title,
        eventDate: new Date(invitation.event.date).toLocaleDateString(),
        eventTime: invitation.event.time,
        eventVenue: invitation.event.venue || null,
        eventFee: invitation.event.fee,
        dashboardUrl: `${envVars.FRONTEND_URL}/dashboard/invitations`
      }
    });
  } catch (error) {
    console.error(`Failed to send invitation email to ${invitee.email}:`, error);
  }
  return invitation;
};
var respondToInvitation = async (invitationId, userId, responseStatus) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: {
      event: true
    }
  });
  if (!invitation) {
    throw new AppError_default(status14.NOT_FOUND, "Invitation not found");
  }
  if (invitation.inviteeId !== userId) {
    throw new AppError_default(
      status14.FORBIDDEN,
      "Only the invited user can respond to this invitation"
    );
  }
  if (invitation.status !== InvitationStatus.PENDING) {
    throw new AppError_default(
      status14.BAD_REQUEST,
      `Invitation has already been ${invitation.status.toLowerCase()}`
    );
  }
  if (responseStatus === "ACCEPTED") {
    const isFreeEvent = Number(invitation.event.fee) === 0;
    await prisma.$transaction(async (tx) => {
      await tx.invitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.ACCEPTED }
      });
      const existingParticipant = await tx.participant.findUnique({
        where: {
          eventId_userId: {
            eventId: invitation.eventId,
            userId
          }
        }
      });
      if (!existingParticipant) {
        await tx.participant.create({
          data: {
            eventId: invitation.eventId,
            userId,
            status: isFreeEvent ? ParticipantStatus.APPROVED : ParticipantStatus.PENDING
          }
        });
      }
    });
  } else {
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.DECLINED }
    });
  }
  const updatedInvitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          type: true,
          fee: true
        }
      },
      inviter: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return updatedInvitation;
};
var getMyInvitations = async (userId, query) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
    status: invitationStatus
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = { inviteeId: userId };
  if (invitationStatus) {
    where.status = invitationStatus;
  }
  const [data, total] = await Promise.all([
    prisma.invitation.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            type: true,
            fee: true,
            date: true,
            time: true,
            venue: true
          }
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.invitation.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var getSentInvitations = async (userId, eventId, query) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status14.NOT_FOUND, "Event not found");
  }
  if (event.organizerId !== userId) {
    throw new AppError_default(
      status14.FORBIDDEN,
      "Only the event organizer can view sent invitations"
    );
  }
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
    status: invitationStatus
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = {
    eventId,
    inviterId: userId
  };
  if (invitationStatus) {
    where.status = invitationStatus;
  }
  const [data, total] = await Promise.all([
    prisma.invitation.findMany({
      where,
      include: {
        invitee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.invitation.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var cancelInvitation = async (invitationId, userId) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: {
      event: true
    }
  });
  if (!invitation) {
    throw new AppError_default(status14.NOT_FOUND, "Invitation not found");
  }
  if (invitation.inviterId !== userId) {
    throw new AppError_default(
      status14.FORBIDDEN,
      "Only the event organizer can cancel invitations"
    );
  }
  if (invitation.status !== InvitationStatus.PENDING) {
    throw new AppError_default(
      status14.BAD_REQUEST,
      `Cannot cancel an invitation that has been ${invitation.status.toLowerCase()}`
    );
  }
  const deletedInvitation = await prisma.invitation.delete({
    where: { id: invitationId }
  });
  return deletedInvitation;
};
var invitationService = {
  sendInvitation,
  respondToInvitation,
  getMyInvitations,
  getSentInvitations,
  cancelInvitation
};

// src/app/module/invitation/invitation.controller.ts
import status15 from "http-status";
var sendInvitation2 = catchAsync(async (req, res) => {
  const result = await invitationService.sendInvitation(
    req.user.userId,
    req.body.eventId,
    req.body.inviteeId
  );
  sendResponse(res, {
    httpStatusCode: status15.CREATED,
    success: true,
    message: "Invitation sent successfully",
    data: result
  });
});
var respondToInvitation2 = catchAsync(async (req, res) => {
  const result = await invitationService.respondToInvitation(
    req.params.invitationId,
    req.user.userId,
    req.body.status
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: `Invitation ${req.body.status.toLowerCase()} successfully`,
    data: result
  });
});
var getMyInvitations2 = catchAsync(async (req, res) => {
  const result = await invitationService.getMyInvitations(
    req.user.userId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Invitations retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getSentInvitations2 = catchAsync(async (req, res) => {
  const result = await invitationService.getSentInvitations(
    req.user.userId,
    req.params.eventId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Sent invitations retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var cancelInvitation2 = catchAsync(async (req, res) => {
  await invitationService.cancelInvitation(
    req.params.invitationId,
    req.user.userId
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Invitation cancelled successfully"
  });
});
var invitationController = {
  sendInvitation: sendInvitation2,
  respondToInvitation: respondToInvitation2,
  getMyInvitations: getMyInvitations2,
  getSentInvitations: getSentInvitations2,
  cancelInvitation: cancelInvitation2
};

// src/app/module/invitation/invitation.validation.ts
import z5 from "zod";
var sendInvitationZodSchema = z5.object({
  eventId: z5.string("Event ID is required").uuid("Invalid event ID"),
  inviteeId: z5.string("Invitee ID is required")
});
var respondInvitationZodSchema = z5.object({
  status: z5.enum(["ACCEPTED", "DECLINED"], "Status must be ACCEPTED or DECLINED")
});
var InvitationValidation = {
  sendInvitationZodSchema,
  respondInvitationZodSchema
};

// src/app/module/invitation/invitation.router.ts
var invitationRouter = Router6();
invitationRouter.post(
  "/send",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(InvitationValidation.sendInvitationZodSchema),
  invitationController.sendInvitation
);
invitationRouter.get(
  "/my-invitations",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  invitationController.getMyInvitations
);
invitationRouter.get(
  "/event/:eventId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  invitationController.getSentInvitations
);
invitationRouter.patch(
  "/:invitationId/respond",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(InvitationValidation.respondInvitationZodSchema),
  invitationController.respondToInvitation
);
invitationRouter.delete(
  "/:invitationId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  invitationController.cancelInvitation
);
var invitation_router_default = invitationRouter;

// src/app/module/review/review.router.ts
import { Router as Router7 } from "express";

// src/app/module/review/review.service.ts
import status16 from "http-status";
var createReview = async (userId, payload) => {
  const event = await prisma.event.findUnique({
    where: { id: payload.eventId }
  });
  if (!event) {
    throw new AppError_default(status16.NOT_FOUND, "Event not found");
  }
  if (event.organizerId === userId) {
    throw new AppError_default(
      status16.BAD_REQUEST,
      "You cannot review your own event"
    );
  }
  const participant = await prisma.participant.findUnique({
    where: {
      eventId_userId: { eventId: payload.eventId, userId }
    }
  });
  if (!participant || participant.status !== ParticipantStatus.APPROVED) {
    throw new AppError_default(
      status16.FORBIDDEN,
      "Only approved participants can review an event"
    );
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      eventId_userId: { eventId: payload.eventId, userId }
    }
  });
  if (existingReview) {
    throw new AppError_default(
      status16.CONFLICT,
      "You have already reviewed this event"
    );
  }
  const review = await prisma.review.create({
    data: {
      eventId: payload.eventId,
      userId,
      rating: payload.rating,
      comment: payload.comment
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      event: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });
  return review;
};
var updateReview = async (reviewId, userId, payload) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) {
    throw new AppError_default(status16.NOT_FOUND, "Review not found");
  }
  if (review.userId !== userId) {
    throw new AppError_default(
      status16.FORBIDDEN,
      "You can only edit your own review"
    );
  }
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: payload,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      event: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });
  return updatedReview;
};
var deleteReview = async (reviewId, userId, userRole) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) {
    throw new AppError_default(status16.NOT_FOUND, "Review not found");
  }
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
  if (review.userId !== userId && !isAdmin) {
    throw new AppError_default(
      status16.FORBIDDEN,
      "You can only delete your own review"
    );
  }
  const deletedReview = await prisma.review.delete({
    where: { id: reviewId }
  });
  return deletedReview;
};
var getEventReviews = async (eventId, query) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status16.NOT_FOUND, "Event not found");
  }
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = { eventId };
  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.review.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var getMyReviews = async (userId, query) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = { userId };
  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            venue: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.review.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var getFeaturedReviews = async (limit = 10) => {
  return prisma.review.findMany({
    where: { rating: { gte: 4 } },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      event: {
        select: {
          id: true,
          title: true,
          image: true
        }
      }
    }
  });
};
var reviewService = {
  createReview,
  updateReview,
  deleteReview,
  getEventReviews,
  getMyReviews,
  getFeaturedReviews
};

// src/app/module/review/review.controller.ts
import status17 from "http-status";
var createReview2 = catchAsync(async (req, res) => {
  const result = await reviewService.createReview(req.user.userId, req.body);
  sendResponse(res, {
    httpStatusCode: status17.CREATED,
    success: true,
    message: "Review created successfully",
    data: result
  });
});
var updateReview2 = catchAsync(async (req, res) => {
  const result = await reviewService.updateReview(
    req.params.reviewId,
    req.user.userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Review updated successfully",
    data: result
  });
});
var deleteReview2 = catchAsync(async (req, res) => {
  await reviewService.deleteReview(
    req.params.reviewId,
    req.user.userId,
    req.user.role
  );
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Review deleted successfully"
  });
});
var getEventReviews2 = catchAsync(async (req, res) => {
  const result = await reviewService.getEventReviews(
    req.params.eventId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Event reviews retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getMyReviews2 = catchAsync(async (req, res) => {
  const result = await reviewService.getMyReviews(
    req.user.userId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "My reviews retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getFeaturedReviews2 = catchAsync(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const result = await reviewService.getFeaturedReviews(limit);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Featured reviews retrieved successfully",
    data: result
  });
});
var reviewController = {
  createReview: createReview2,
  updateReview: updateReview2,
  deleteReview: deleteReview2,
  getEventReviews: getEventReviews2,
  getMyReviews: getMyReviews2,
  getFeaturedReviews: getFeaturedReviews2
};

// src/app/module/review/review.validation.ts
import z6 from "zod";
var createReviewZodSchema = z6.object({
  eventId: z6.string("Event ID is required").uuid("Invalid event ID"),
  rating: z6.number("Rating is required").int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z6.string("Comment is required").min(1, "Comment cannot be empty").max(1e3, "Comment cannot exceed 1000 characters")
});
var updateReviewZodSchema = z6.object({
  rating: z6.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
  comment: z6.string().min(1, "Comment cannot be empty").max(1e3, "Comment cannot exceed 1000 characters").optional()
});
var ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema
};

// src/app/module/review/review.router.ts
var reviewRouter = Router7();
reviewRouter.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ReviewValidation.createReviewZodSchema),
  reviewController.createReview
);
reviewRouter.get(
  "/my-reviews",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  reviewController.getMyReviews
);
reviewRouter.get("/featured", reviewController.getFeaturedReviews);
reviewRouter.get(
  "/event/:eventId",
  reviewController.getEventReviews
);
reviewRouter.patch(
  "/:reviewId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  reviewController.updateReview
);
reviewRouter.delete(
  "/:reviewId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  reviewController.deleteReview
);
var review_router_default = reviewRouter;

// src/app/module/admin/admin.router.ts
import { Router as Router8 } from "express";

// src/app/module/admin/admin.service.ts
import status18 from "http-status";
var getAllUsers = async (query) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
    searchTerm,
    status: userStatus,
    role
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = {};
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (userStatus) {
    where.status = userStatus;
  }
  if (role) {
    where.role = role;
  }
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        phone: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        needPasswordChange: true,
        _count: {
          select: {
            organizedEvents: true,
            participants: true,
            reviews: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.user.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var updateUserStatus = async (userId, newStatus) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError_default(status18.NOT_FOUND, "User not found");
  }
  if (user.role === "SUPER_ADMIN") {
    throw new AppError_default(
      status18.FORBIDDEN,
      "Cannot change status of a Super Admin"
    );
  }
  const updateData = {
    status: newStatus
  };
  if (newStatus === UserStatus.DELETED) {
    updateData.isDeleted = true;
    updateData.deletedAt = /* @__PURE__ */ new Date();
  }
  if (newStatus === UserStatus.ACTIVE) {
    updateData.isDeleted = false;
    updateData.deletedAt = null;
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData
  });
  return updatedUser;
};
var getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      admin: true,
      organizedEvents: {
        take: 5,
        orderBy: { createdAt: "desc" }
      },
      participants: {
        take: 5,
        orderBy: { joinedAt: "desc" },
        include: {
          event: {
            select: {
              id: true,
              title: true
            }
          }
        }
      },
      reviews: {
        take: 5,
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!user) {
    throw new AppError_default(status18.NOT_FOUND, "User not found");
  }
  return user;
};
var getAllEventsAdmin = async (query) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
    searchTerm,
    type,
    isFeatured
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = {};
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      { venue: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (type) {
    where.type = type;
  }
  if (isFeatured !== void 0) {
    where.isFeatured = isFeatured === "true";
  }
  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            participants: true,
            reviews: true,
            payments: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.event.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var deleteEvent3 = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status18.NOT_FOUND, "Event not found");
  }
  const deletedEvent = await prisma.event.delete({
    where: { id: eventId }
  });
  return deletedEvent;
};
var getAllReviewsAdmin = async (query) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const [data, total] = await Promise.all([
    prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        event: {
          select: {
            id: true,
            title: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.review.count()
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var deleteReview3 = async (reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) {
    throw new AppError_default(status18.NOT_FOUND, "Review not found");
  }
  const deletedReview = await prisma.review.delete({
    where: { id: reviewId }
  });
  return deletedReview;
};
var getDashboardStats = async () => {
  const [
    totalUsers,
    totalEvents,
    totalReviews,
    totalPayments,
    activeUsers,
    blockedUsers,
    recentEvents,
    recentUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.review.count(),
    prisma.payment.count({ where: { status: "SUCCESS" } }),
    prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { status: UserStatus.BLOCKED } }),
    prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        date: true,
        type: true,
        fee: true,
        isFeatured: true,
        createdAt: true,
        _count: {
          select: { participants: true }
        }
      }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    })
  ]);
  return {
    counts: {
      totalUsers,
      totalEvents,
      totalReviews,
      totalPayments,
      activeUsers,
      blockedUsers
    },
    recentEvents,
    recentUsers
  };
};
var adminService = {
  getAllUsers,
  updateUserStatus,
  getUserById,
  getAllEventsAdmin,
  deleteEvent: deleteEvent3,
  getAllReviewsAdmin,
  deleteReview: deleteReview3,
  getDashboardStats
};

// src/app/module/admin/admin.controller.ts
import status19 from "http-status";
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllUsers(req.query);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getUserById2 = catchAsync(async (req, res) => {
  const result = await adminService.getUserById(req.params.userId);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "User retrieved successfully",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const result = await adminService.updateUserStatus(
    req.params.userId,
    req.body.status
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: `User ${req.body.status.toLowerCase()} successfully`,
    data: result
  });
});
var getAllEventsAdmin2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllEventsAdmin(
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Events retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var deleteEvent4 = catchAsync(async (req, res) => {
  await adminService.deleteEvent(req.params.eventId);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Event deleted successfully"
  });
});
var getAllReviewsAdmin2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllReviewsAdmin(
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var deleteReview4 = catchAsync(async (req, res) => {
  await adminService.deleteReview(req.params.reviewId);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Review deleted successfully"
  });
});
var getDashboardStats2 = catchAsync(async (req, res) => {
  const result = await adminService.getDashboardStats();
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result
  });
});
var adminController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUserStatus: updateUserStatus2,
  getAllEventsAdmin: getAllEventsAdmin2,
  deleteEvent: deleteEvent4,
  getAllReviewsAdmin: getAllReviewsAdmin2,
  deleteReview: deleteReview4,
  getDashboardStats: getDashboardStats2
};

// src/app/module/admin/admin.validation.ts
import z7 from "zod";
var updateUserStatusZodSchema = z7.object({
  status: z7.enum(["ACTIVE", "BLOCKED", "DELETED"], "Status must be ACTIVE, BLOCKED, or DELETED")
});
var AdminValidation = {
  updateUserStatusZodSchema
};

// src/app/module/admin/admin.router.ts
var adminRouter = Router8();
adminRouter.get(
  "/dashboard",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getDashboardStats
);
adminRouter.get(
  "/users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllUsers
);
adminRouter.get(
  "/users/:userId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getUserById
);
adminRouter.patch(
  "/users/:userId/status",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(AdminValidation.updateUserStatusZodSchema),
  adminController.updateUserStatus
);
adminRouter.get(
  "/events",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllEventsAdmin
);
adminRouter.delete(
  "/events/:eventId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.deleteEvent
);
adminRouter.get(
  "/reviews",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllReviewsAdmin
);
adminRouter.delete(
  "/reviews/:reviewId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.deleteReview
);
var admin_router_default = adminRouter;

// src/app/module/category/category.router.ts
import { Router as Router9 } from "express";

// src/app/module/category/category.service.ts
import status20 from "http-status";
var createCategory = async (payload) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name: payload.name }
  });
  if (existingCategory) {
    throw new AppError_default(
      status20.CONFLICT,
      "Category with this name already exists"
    );
  }
  const category = await prisma.category.create({
    data: payload
  });
  return category;
};
var getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { events: true }
      }
    }
  });
  return categories;
};
var updateCategory = async (id, payload) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });
  if (!category) {
    throw new AppError_default(status20.NOT_FOUND, "Category not found");
  }
  if (payload.name && payload.name !== category.name) {
    const existing = await prisma.category.findUnique({
      where: { name: payload.name }
    });
    if (existing) {
      throw new AppError_default(
        status20.CONFLICT,
        "Category with this name already exists"
      );
    }
  }
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: payload
  });
  return updatedCategory;
};
var deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { events: true }
      }
    }
  });
  if (!category) {
    throw new AppError_default(status20.NOT_FOUND, "Category not found");
  }
  if (category._count.events > 0) {
    throw new AppError_default(
      status20.BAD_REQUEST,
      `Cannot delete category. ${category._count.events} events are using this category.`
    );
  }
  const deletedCategory = await prisma.category.delete({
    where: { id }
  });
  return deletedCategory;
};
var categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};

// src/app/module/category/category.controller.ts
import status21 from "http-status";
var createCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.createCategory(req.body);
  sendResponse(res, {
    httpStatusCode: status21.CREATED,
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var getAllCategories2 = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategories();
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: result
  });
});
var updateCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.updateCategory(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Category updated successfully",
    data: result
  });
});
var deleteCategory2 = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Category deleted successfully"
  });
});
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/app/module/category/category.validation.ts
import z8 from "zod";
var createCategoryZodSchema = z8.object({
  name: z8.string("Category name is required").min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  icon: z8.string().url("Icon must be a valid URL").optional()
});
var updateCategoryZodSchema = z8.object({
  name: z8.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters").optional(),
  icon: z8.string().url("Icon must be a valid URL").optional()
});
var CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema
};

// src/app/module/category/category.router.ts
var categoryRouter = Router9();
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(CategoryValidation.createCategoryZodSchema),
  categoryController.createCategory
);
categoryRouter.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  categoryController.updateCategory
);
categoryRouter.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  categoryController.deleteCategory
);
var category_router_default = categoryRouter;

// src/app/module/savedEvent/savedEvent.router.ts
import { Router as Router10 } from "express";

// src/app/module/savedEvent/savedEvent.service.ts
import status22 from "http-status";
var saveEvent = async (userId, eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status22.NOT_FOUND, "Event not found");
  }
  const existing = await prisma.savedEvent.findUnique({
    where: {
      userId_eventId: { userId, eventId }
    }
  });
  if (existing) {
    throw new AppError_default(status22.CONFLICT, "Event already saved");
  }
  const savedEvent = await prisma.savedEvent.create({
    data: { userId, eventId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          venue: true,
          fee: true,
          type: true
        }
      }
    }
  });
  return savedEvent;
};
var unsaveEvent = async (userId, eventId) => {
  const savedEvent = await prisma.savedEvent.findUnique({
    where: {
      userId_eventId: { userId, eventId }
    }
  });
  if (!savedEvent) {
    throw new AppError_default(status22.NOT_FOUND, "Saved event not found");
  }
  const deleted = await prisma.savedEvent.delete({
    where: {
      userId_eventId: { userId, eventId }
    }
  });
  return deleted;
};
var getMySavedEvents = async (userId, query) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "savedAt",
    sortOrder = "desc"
  } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = { userId };
  const [data, total] = await Promise.all([
    prisma.savedEvent.findMany({
      where,
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            },
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.savedEvent.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var isEventSaved = async (userId, eventId) => {
  const savedEvent = await prisma.savedEvent.findUnique({
    where: {
      userId_eventId: { userId, eventId }
    }
  });
  return !!savedEvent;
};
var savedEventService = {
  saveEvent,
  unsaveEvent,
  getMySavedEvents,
  isEventSaved
};

// src/app/module/savedEvent/savedEvent.controller.ts
import status23 from "http-status";
var saveEvent2 = catchAsync(async (req, res) => {
  const result = await savedEventService.saveEvent(
    req.user.userId,
    req.body.eventId
  );
  sendResponse(res, {
    httpStatusCode: status23.CREATED,
    success: true,
    message: "Event saved successfully",
    data: result
  });
});
var unsaveEvent2 = catchAsync(async (req, res) => {
  await savedEventService.unsaveEvent(
    req.user.userId,
    req.params.eventId
  );
  sendResponse(res, {
    httpStatusCode: status23.OK,
    success: true,
    message: "Event unsaved successfully"
  });
});
var getMySavedEvents2 = catchAsync(async (req, res) => {
  const result = await savedEventService.getMySavedEvents(
    req.user.userId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status23.OK,
    success: true,
    message: "Saved events retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var isEventSaved2 = catchAsync(async (req, res) => {
  const result = await savedEventService.isEventSaved(
    req.user.userId,
    req.params.eventId
  );
  sendResponse(res, {
    httpStatusCode: status23.OK,
    success: true,
    message: "Save status retrieved successfully",
    data: { isSaved: result }
  });
});
var savedEventController = {
  saveEvent: saveEvent2,
  unsaveEvent: unsaveEvent2,
  getMySavedEvents: getMySavedEvents2,
  isEventSaved: isEventSaved2
};

// src/app/module/savedEvent/savedEvent.validation.ts
import z9 from "zod";
var saveEventZodSchema = z9.object({
  eventId: z9.string("Event ID is required").uuid("Invalid event ID")
});
var SavedEventValidation = {
  saveEventZodSchema
};

// src/app/module/savedEvent/savedEvent.router.ts
var savedEventRouter = Router10();
savedEventRouter.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(SavedEventValidation.saveEventZodSchema),
  savedEventController.saveEvent
);
savedEventRouter.get(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  savedEventController.getMySavedEvents
);
savedEventRouter.get(
  "/status/:eventId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  savedEventController.isEventSaved
);
savedEventRouter.delete(
  "/:eventId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  savedEventController.unsaveEvent
);
var savedEvent_router_default = savedEventRouter;

// src/app/module/chat/chat.router.ts
import { Router as Router11 } from "express";

// src/app/module/chat/chat.service.ts
import status24 from "http-status";
var startConversation = async (userId, eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });
  if (!event) {
    throw new AppError_default(status24.NOT_FOUND, "Event not found");
  }
  if (event.organizerId === userId) {
    throw new AppError_default(
      status24.BAD_REQUEST,
      "You cannot start a conversation for your own event"
    );
  }
  const existing = await prisma.conversation.findUnique({
    where: {
      eventId_userId: { eventId, userId }
    },
    include: {
      event: {
        select: { id: true, title: true, image: true }
      },
      user: {
        select: { id: true, name: true, image: true }
      },
      organizer: {
        select: { id: true, name: true, image: true }
      },
      _count: { select: { messages: true } }
    }
  });
  if (existing) {
    return existing;
  }
  const conversation = await prisma.conversation.create({
    data: {
      eventId,
      userId,
      organizerId: event.organizerId
    },
    include: {
      event: {
        select: { id: true, title: true, image: true }
      },
      user: {
        select: { id: true, name: true, image: true }
      },
      organizer: {
        select: { id: true, name: true, image: true }
      },
      _count: { select: { messages: true } }
    }
  });
  return conversation;
};
var getMyConversations = async (userId, query) => {
  const { page = "1", limit = "20" } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = {
    OR: [{ userId }, { organizerId: userId }]
  };
  const [data, total] = await Promise.all([
    prisma.conversation.findMany({
      where,
      include: {
        event: {
          select: { id: true, title: true, image: true }
        },
        user: {
          select: { id: true, name: true, image: true }
        },
        organizer: {
          select: { id: true, name: true, image: true }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            isRead: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: userId }
              }
            }
          }
        }
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: limitNum
    }),
    prisma.conversation.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var getMessages = async (conversationId, userId, query) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId }
  });
  if (!conversation) {
    throw new AppError_default(status24.NOT_FOUND, "Conversation not found");
  }
  if (conversation.userId !== userId && conversation.organizerId !== userId) {
    throw new AppError_default(
      status24.FORBIDDEN,
      "You are not a participant of this conversation"
    );
  }
  const { page = "1", limit = "50" } = query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;
  const where = { conversationId };
  const [data, total] = await Promise.all([
    prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limitNum
    }),
    prisma.message.count({ where })
  ]);
  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var sendMessage = async (conversationId, senderId, content) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId }
  });
  if (!conversation) {
    throw new AppError_default(status24.NOT_FOUND, "Conversation not found");
  }
  if (conversation.userId !== senderId && conversation.organizerId !== senderId) {
    throw new AppError_default(
      status24.FORBIDDEN,
      "You are not a participant of this conversation"
    );
  }
  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId,
        senderId,
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: /* @__PURE__ */ new Date() }
    })
  ]);
  return message;
};
var markMessagesAsRead = async (conversationId, userId) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId }
  });
  if (!conversation) {
    throw new AppError_default(status24.NOT_FOUND, "Conversation not found");
  }
  if (conversation.userId !== userId && conversation.organizerId !== userId) {
    throw new AppError_default(
      status24.FORBIDDEN,
      "You are not a participant of this conversation"
    );
  }
  const result = await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      isRead: false
    },
    data: { isRead: true }
  });
  return result.count;
};
var chatService = {
  startConversation,
  getMyConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead
};

// src/app/module/chat/chat.controller.ts
import status25 from "http-status";
var startConversation2 = catchAsync(async (req, res) => {
  const result = await chatService.startConversation(
    req.user.userId,
    req.body.eventId
  );
  sendResponse(res, {
    httpStatusCode: status25.CREATED,
    success: true,
    message: "Conversation started successfully",
    data: result
  });
});
var getMyConversations2 = catchAsync(async (req, res) => {
  const result = await chatService.getMyConversations(
    req.user.userId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: "Conversations retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getMessages2 = catchAsync(async (req, res) => {
  const result = await chatService.getMessages(
    req.params.conversationId,
    req.user.userId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: "Messages retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var sendMessage2 = catchAsync(async (req, res) => {
  const result = await chatService.sendMessage(
    req.params.conversationId,
    req.user.userId,
    req.body.content
  );
  sendResponse(res, {
    httpStatusCode: status25.CREATED,
    success: true,
    message: "Message sent successfully",
    data: result
  });
});
var markMessagesAsRead2 = catchAsync(async (req, res) => {
  const count = await chatService.markMessagesAsRead(
    req.params.conversationId,
    req.user.userId
  );
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: `${count} messages marked as read`
  });
});
var chatController = {
  startConversation: startConversation2,
  getMyConversations: getMyConversations2,
  getMessages: getMessages2,
  sendMessage: sendMessage2,
  markMessagesAsRead: markMessagesAsRead2
};

// src/app/module/chat/chat.validation.ts
import z10 from "zod";
var startConversationZodSchema = z10.object({
  eventId: z10.string("Event ID is required").uuid("Invalid event ID")
});
var sendMessageZodSchema = z10.object({
  content: z10.string("Message content is required").min(1, "Message cannot be empty").max(2e3, "Message must be under 2000 characters")
});
var ChatValidation = {
  startConversationZodSchema,
  sendMessageZodSchema
};

// src/app/module/chat/chat.router.ts
var chatRouter = Router11();
chatRouter.post(
  "/conversations",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ChatValidation.startConversationZodSchema),
  chatController.startConversation
);
chatRouter.get(
  "/conversations",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  chatController.getMyConversations
);
chatRouter.get(
  "/conversations/:conversationId/messages",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  chatController.getMessages
);
chatRouter.post(
  "/conversations/:conversationId/messages",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(ChatValidation.sendMessageZodSchema),
  chatController.sendMessage
);
chatRouter.patch(
  "/conversations/:conversationId/read",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  chatController.markMessagesAsRead
);
var chat_router_default = chatRouter;

// src/app/errorHelpers/handleZodError.ts
import status26 from "http-status";
var handleZodError = (err) => {
  const statusCode = status26.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/middleware/globalErrorHandler.ts
import z11 from "zod";
import { status as status28 } from "http-status";

// src/app/utils/deleteUploadedFilesFromGlobalErrorHandler.ts
var deleteUploadedFilesFromGlobalErrorHandler = async (req) => {
  try {
    const filesToDelete = [];
    if (req.file && req.file.path && req.file.path.startsWith("http")) {
      filesToDelete.push(req.file.path);
    } else if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach((file) => {
            if (file.path && file.path.startsWith("http")) {
              filesToDelete.push(file.path);
            }
          });
        }
      });
    } else if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (file.path && file.path.startsWith("http")) {
          filesToDelete.push(file.path);
        }
      });
    }
    if (filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map((url) => deleteFileFromCloudinary(url))
      );
      console.log(
        `Deleted ${filesToDelete.length} uploaded file(s) from Cloudinary due to error.`
      );
    }
  } catch (error) {
    console.error(
      "Error deleting uploaded files from Global Error Handler:",
      error.message
    );
  }
};

// src/app/errorHelpers/handlePrismaErrors.ts
import status27 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status27.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status27.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status27.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status27.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status27.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status27.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status27.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status27.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status27.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status27.INTERNAL_SERVER_ERROR;
  }
  return status27.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status27.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch?.[1] ?? "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status27.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status27.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [
    {
      path: "Rust Engine Crashed",
      message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
    }
  ];
  return {
    success: false,
    statusCode: status27.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error from Global Error Handler:", err);
  }
  await deleteUploadedFilesFromGlobalErrorHandler(req);
  let errorSources = [];
  let statusCode = status28.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z11.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status28.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status29 from "http-status";
var notFoundMiddleware = (req, res) => {
  res.status(status29.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// src/app/app.ts
var app = express();
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/app/templates`));
app.post(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhookEvent
);
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use("/api/auth", toNodeHandler(auth));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.status(200).send("Server is running...");
});
app.use("/api/v1/auth", auth_router_default);
app.use("/api/v1/users", user_router_default);
app.use("/api/v1/events", event_router_default);
app.use("/api/v1/participants", participant_router_default);
app.use("/api/v1/payments", payment_router_default);
app.use("/api/v1/invitations", invitation_router_default);
app.use("/api/v1/reviews", review_router_default);
app.use("/api/v1/admin", admin_router_default);
app.use("/api/v1/categories", category_router_default);
app.use("/api/v1/saved-events", savedEvent_router_default);
app.use("/api/v1/chat", chat_router_default);
app.use(globalErrorHandler);
app.use(notFoundMiddleware);
var app_default = app;

// src/app/utils/seed.ts
var seedAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.admin.findFirst({
      where: { email: envVars.ADMIN_EMAIL }
    });
    if (isSuperAdminExist) {
      console.log("admin already exists. Skipping seeding admin.");
      return;
    }
    let adminUserId;
    const existingUser = await prisma.user.findUnique({
      where: { email: envVars.ADMIN_EMAIL }
    });
    if (existingUser) {
      adminUserId = existingUser.id;
    } else {
      const adminUser = await auth.api.signUpEmail({
        body: {
          email: envVars.ADMIN_EMAIL,
          password: envVars.ADMIN_PASSWORD,
          name: envVars.ADMIN_NAME,
          role: Role.ADMIN,
          needPasswordChange: false,
          rememberMe: false
        }
      });
      adminUserId = adminUser.user.id;
    }
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: adminUserId },
        data: {
          role: Role.ADMIN,
          emailVerified: true
        }
      });
      await tx.admin.create({
        data: {
          userId: adminUserId,
          name: envVars.ADMIN_NAME,
          email: envVars.ADMIN_EMAIL
        }
      });
    });
    console.log("Admin Created successfully:", envVars.ADMIN_EMAIL);
  } catch (error) {
    console.error("Error seeding admin: ", error);
  }
};

// src/app/lib/socket.ts
import { Server } from "socket.io";
var onlineUsers = /* @__PURE__ */ new Map();
var initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        envVars.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:5000"
      ],
      credentials: true
    }
  });
  io.use(async (socket, next) => {
    try {
      const cookieStr = socket.handshake.headers?.cookie || "";
      const sessionMatch = cookieStr.match(
        /better-auth\.session_token=([^;]+)/
      );
      if (sessionMatch?.[1]) {
        const sessionToken = decodeURIComponent(sessionMatch[1]);
        const session = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: { gt: /* @__PURE__ */ new Date() }
          },
          include: { user: true }
        });
        if (session?.user) {
          socket.userId = session.user.id;
          return next();
        }
      }
      const accessMatch = cookieStr.match(/accessToken=([^;]+)/);
      const accessToken = socket.handshake.auth?.token || (accessMatch?.[1] ? decodeURIComponent(accessMatch[1]) : null);
      if (accessToken) {
        const verified = jwtUtils.verifyToken(
          accessToken,
          envVars.ACCESS_TOKEN_SECRET
        );
        if (verified.success && verified.data) {
          socket.userId = verified.data.userId;
          return next();
        }
      }
      return next(new Error("Authentication required"));
    } catch {
      next(new Error("Authentication failed"));
    }
  });
  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`User ${userId} connected via socket ${socket.id}`);
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, /* @__PURE__ */ new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    socket.on("join-conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${userId} joined room: conversation:${conversationId}`);
    });
    socket.on("leave-conversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });
    socket.on(
      "send-message",
      async (data) => {
        try {
          const message = await chatService.sendMessage(
            data.conversationId,
            userId,
            data.content
          );
          const roomName = `conversation:${data.conversationId}`;
          const room = io.sockets.adapter.rooms.get(roomName);
          console.log(`Room ${roomName} members: ${room?.size || 0}`);
          io.in(roomName).emit("new-message", message);
          const conversation = await prisma.conversation.findUnique({
            where: { id: data.conversationId }
          });
          if (conversation) {
            const recipientId = conversation.userId === userId ? conversation.organizerId : conversation.userId;
            const recipientSockets = onlineUsers.get(recipientId);
            if (recipientSockets) {
              recipientSockets.forEach((socketId) => {
                io.to(socketId).emit("message-notification", {
                  conversationId: data.conversationId,
                  message
                });
              });
            }
          }
        } catch (error) {
          socket.emit("error", {
            message: error instanceof Error ? error.message : "Failed to send message"
          });
        }
      }
    );
    socket.on("mark-read", async (conversationId) => {
      try {
        await chatService.markMessagesAsRead(conversationId, userId);
        io.to(`conversation:${conversationId}`).emit("messages-read", {
          conversationId,
          readBy: userId
        });
      } catch (error) {
        socket.emit("error", {
          message: error instanceof Error ? error.message : "Failed to mark messages as read"
        });
      }
    });
    socket.on("typing", (conversationId) => {
      socket.to(`conversation:${conversationId}`).emit("user-typing", {
        conversationId,
        userId
      });
    });
    socket.on("stop-typing", (conversationId) => {
      socket.to(`conversation:${conversationId}`).emit("user-stop-typing", {
        conversationId,
        userId
      });
    });
    socket.on("check-online", (targetUserId) => {
      const isOnline = onlineUsers.has(targetUserId);
      socket.emit("user-online-status", {
        userId: targetUserId,
        isOnline
      });
    });
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected socket ${socket.id}`);
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }
    });
  });
  return io;
};

// src/app/server.ts
var server;
async function main() {
  try {
    await seedAdmin();
    await prisma.$connect();
    console.log("Database connected successfully.");
    server = createServer(app_default);
    const io = initializeSocket(server);
    console.log("Socket.io initialized");
    app_default.set("io", io);
    server.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
main();
//# sourceMappingURL=server.js.map
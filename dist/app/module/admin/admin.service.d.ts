import { User, Event, Review } from "../../../generated/prisma/client";
import { UserStatus } from "../../../generated/prisma/enums";
import { IQueryParams, IQueryResult } from "../../interfaces/query.interface";
export declare const adminService: {
    getAllUsers: (query: IQueryParams) => Promise<IQueryResult<User>>;
    updateUserStatus: (userId: string, newStatus: UserStatus) => Promise<User>;
    getUserById: (userId: string) => Promise<User>;
    getAllEventsAdmin: (query: IQueryParams) => Promise<IQueryResult<Event>>;
    deleteEvent: (eventId: string) => Promise<Event>;
    getAllReviewsAdmin: (query: IQueryParams) => Promise<IQueryResult<Review>>;
    deleteReview: (reviewId: string) => Promise<Review>;
    getDashboardStats: () => Promise<{
        counts: {
            totalUsers: number;
            totalEvents: number;
            totalReviews: number;
            totalPayments: number;
            activeUsers: number;
            blockedUsers: number;
        };
        recentEvents: {
            date: Date;
            type: import("../../../generated/prisma/enums").EventType;
            id: string;
            createdAt: Date;
            _count: {
                participants: number;
            };
            title: string;
            fee: import("@prisma/client/runtime/client").Decimal;
            isFeatured: boolean;
        }[];
        recentUsers: {
            name: string;
            email: string;
            role: import("../../../generated/prisma/enums").Role;
            status: UserStatus;
            id: string;
            createdAt: Date;
        }[];
    }>;
};
//# sourceMappingURL=admin.service.d.ts.map
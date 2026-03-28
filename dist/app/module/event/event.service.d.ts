import { Role } from "../../../generated/prisma/enums";
import { ICreateEvent, IUpdateEvent } from "./event.interface";
import { IQueryParams } from "../../interfaces/query.interface";
export declare const eventService: {
    createEvent: (organizerId: string, payload: ICreateEvent, file?: Express.Multer.File) => Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
        } | null;
        organizer: {
            name: string;
            email: string;
            id: string;
            image: string | null;
        };
    } & {
        date: Date;
        type: import("../../../generated/prisma/enums").EventType;
        id: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        time: string;
        organizerId: string;
        title: string;
        description: string;
        venue: string | null;
        eventLink: string | null;
        fee: import("@prisma/client/runtime/client").Decimal;
        maxAttendees: number | null;
        isFeatured: boolean;
        categoryId: string | null;
    }>;
    getAllEvents: (query: IQueryParams) => Promise<{
        data: ({
            _count: {
                participants: number;
                reviews: number;
            };
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                icon: string | null;
            } | null;
            organizer: {
                name: string;
                email: string;
                id: string;
                image: string | null;
            };
        } & {
            date: Date;
            type: import("../../../generated/prisma/enums").EventType;
            id: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            time: string;
            organizerId: string;
            title: string;
            description: string;
            venue: string | null;
            eventLink: string | null;
            fee: import("@prisma/client/runtime/client").Decimal;
            maxAttendees: number | null;
            isFeatured: boolean;
            categoryId: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getEventById: (eventId: string) => Promise<{
        participants: ({
            user: {
                name: string;
                email: string;
                id: string;
                image: string | null;
            };
        } & {
            status: import("../../../generated/prisma/enums").ParticipantStatus;
            id: string;
            updatedAt: Date;
            userId: string;
            eventId: string;
            joinedAt: Date;
        })[];
        reviews: ({
            user: {
                name: string;
                id: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            eventId: string;
            rating: number;
            comment: string;
        })[];
        _count: {
            participants: number;
            reviews: number;
        };
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
        } | null;
        organizer: {
            name: string;
            email: string;
            id: string;
            image: string | null;
        };
    } & {
        date: Date;
        type: import("../../../generated/prisma/enums").EventType;
        id: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        time: string;
        organizerId: string;
        title: string;
        description: string;
        venue: string | null;
        eventLink: string | null;
        fee: import("@prisma/client/runtime/client").Decimal;
        maxAttendees: number | null;
        isFeatured: boolean;
        categoryId: string | null;
    }>;
    getMyEvents: (organizerId: string, query: IQueryParams) => Promise<{
        data: ({
            _count: {
                participants: number;
                reviews: number;
            };
        } & {
            date: Date;
            type: import("../../../generated/prisma/enums").EventType;
            id: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            time: string;
            organizerId: string;
            title: string;
            description: string;
            venue: string | null;
            eventLink: string | null;
            fee: import("@prisma/client/runtime/client").Decimal;
            maxAttendees: number | null;
            isFeatured: boolean;
            categoryId: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateEvent: (eventId: string, userId: string, userRole: Role, payload: IUpdateEvent, file?: Express.Multer.File) => Promise<{
        organizer: {
            name: string;
            email: string;
            id: string;
            image: string | null;
        };
    } & {
        date: Date;
        type: import("../../../generated/prisma/enums").EventType;
        id: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        time: string;
        organizerId: string;
        title: string;
        description: string;
        venue: string | null;
        eventLink: string | null;
        fee: import("@prisma/client/runtime/client").Decimal;
        maxAttendees: number | null;
        isFeatured: boolean;
        categoryId: string | null;
    }>;
    deleteEvent: (eventId: string, userId: string, userRole: Role) => Promise<{
        date: Date;
        type: import("../../../generated/prisma/enums").EventType;
        id: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        time: string;
        organizerId: string;
        title: string;
        description: string;
        venue: string | null;
        eventLink: string | null;
        fee: import("@prisma/client/runtime/client").Decimal;
        maxAttendees: number | null;
        isFeatured: boolean;
        categoryId: string | null;
    }>;
    toggleFeatured: (eventId: string) => Promise<{
        date: Date;
        type: import("../../../generated/prisma/enums").EventType;
        id: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        time: string;
        organizerId: string;
        title: string;
        description: string;
        venue: string | null;
        eventLink: string | null;
        fee: import("@prisma/client/runtime/client").Decimal;
        maxAttendees: number | null;
        isFeatured: boolean;
        categoryId: string | null;
    }>;
    getPlatformStats: () => Promise<{
        totalUsers: number;
        totalEvents: number;
        totalTicketsSold: number;
        avgRating: number;
    }>;
};
//# sourceMappingURL=event.service.d.ts.map
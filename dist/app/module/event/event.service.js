import status from "http-status";
import { Role } from "../../../generated/prisma/enums.js";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary, } from "../../config/cloudinary.config.js";
const EVENT_SEARCHABLE_FIELDS = ["title", "description", "venue"];
const EVENT_FILTERABLE_FIELDS = ["type", "isFeatured", "organizerId", "categoryId"];
const createEvent = async (organizerId, payload, file) => {
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
        categoryId: payload.categoryId ?? null,
    };
    if (payload.type)
        data.type = payload.type;
    if (payload.fee !== undefined)
        data.fee = payload.fee;
    if (payload.maxAttendees !== undefined)
        data.maxAttendees = payload.maxAttendees;
    const event = await prisma.event.create({
        data,
        include: {
            category: true,
            organizer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
    return event;
};
const getAllEvents = async (query) => {
    const { searchTerm, page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc", ...filters } = query;
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;
    const andConditions = [];
    // Search
    if (searchTerm) {
        andConditions.push({
            OR: EVENT_SEARCHABLE_FIELDS.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    // Filters
    for (const key of Object.keys(filters)) {
        if (EVENT_FILTERABLE_FIELDS.includes(key) && filters[key]) {
            const value = filters[key];
            if (key === "isFeatured") {
                andConditions.push({ [key]: value === "true" });
            }
            else {
                andConditions.push({ [key]: value });
            }
        }
    }
    // Date range filter
    if (filters.startDate || filters.endDate) {
        const dateFilter = {};
        if (filters.startDate)
            dateFilter.gte = new Date(filters.startDate);
        if (filters.endDate)
            dateFilter.lte = new Date(filters.endDate);
        andConditions.push({ date: dateFilter });
    }
    // Fee range filter
    if (filters.minFee || filters.maxFee) {
        const feeFilter = {};
        if (filters.minFee)
            feeFilter.gte = Number(filters.minFee);
        if (filters.maxFee)
            feeFilter.lte = Number(filters.maxFee);
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
                        image: true,
                    },
                },
                _count: {
                    select: {
                        participants: true,
                        reviews: true,
                    },
                },
            },
            skip,
            take: limitNum,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma.event.count({ where }),
    ]);
    return {
        data,
        meta: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};
const getEventById = async (eventId) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            category: true,
            organizer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            },
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    participants: true,
                    reviews: true,
                },
            },
        },
    });
    if (!event) {
        throw new AppError(status.NOT_FOUND, "Event not found");
    }
    return event;
};
const getMyEvents = async (organizerId, query) => {
    const { page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc", } = query;
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
                        reviews: true,
                    },
                },
            },
            skip,
            take: limitNum,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma.event.count({ where }),
    ]);
    return {
        data,
        meta: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};
const updateEvent = async (eventId, userId, userRole, payload, file) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });
    if (!event) {
        throw new AppError(status.NOT_FOUND, "Event not found");
    }
    if (event.organizerId !== userId && userRole === Role.USER) {
        throw new AppError(status.FORBIDDEN, "You are not authorized to update this event");
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
                    image: true,
                },
            },
        },
    });
    return updatedEvent;
};
const deleteEvent = async (eventId, userId, userRole) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });
    if (!event) {
        throw new AppError(status.NOT_FOUND, "Event not found");
    }
    if (event.organizerId !== userId && userRole === Role.USER) {
        throw new AppError(status.FORBIDDEN, "You are not authorized to delete this event");
    }
    // Delete image from Cloudinary if exists
    if (event.image) {
        await deleteFileFromCloudinary(event.image);
    }
    const deletedEvent = await prisma.event.delete({
        where: { id: eventId },
    });
    return deletedEvent;
};
const toggleFeatured = async (eventId) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });
    if (!event) {
        throw new AppError(status.NOT_FOUND, "Event not found");
    }
    const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: { isFeatured: !event.isFeatured },
    });
    return updatedEvent;
};
const getPlatformStats = async () => {
    const [totalUsers, totalEvents, totalTicketsSold, ratingResult] = await Promise.all([
        prisma.user.count({ where: { isDeleted: false } }),
        prisma.event.count(),
        prisma.participant.count({ where: { status: "APPROVED" } }),
        prisma.review.aggregate({ _avg: { rating: true } }),
    ]);
    return {
        totalUsers,
        totalEvents,
        totalTicketsSold,
        avgRating: ratingResult._avg.rating
            ? Number(ratingResult._avg.rating.toFixed(1))
            : 0,
    };
};
export const eventService = {
    createEvent,
    getAllEvents,
    getEventById,
    getMyEvents,
    updateEvent,
    deleteEvent,
    toggleFeatured,
    getPlatformStats,
};
//# sourceMappingURL=event.service.js.map
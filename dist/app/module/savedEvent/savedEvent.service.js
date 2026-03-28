import status from "http-status";
import AppError from "../../errorHelpers/AppError.js";
import { prisma } from "../../lib/prisma.js";
const saveEvent = async (userId, eventId) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });
    if (!event) {
        throw new AppError(status.NOT_FOUND, "Event not found");
    }
    const existing = await prisma.savedEvent.findUnique({
        where: {
            userId_eventId: { userId, eventId },
        },
    });
    if (existing) {
        throw new AppError(status.CONFLICT, "Event already saved");
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
                    type: true,
                },
            },
        },
    });
    return savedEvent;
};
const unsaveEvent = async (userId, eventId) => {
    const savedEvent = await prisma.savedEvent.findUnique({
        where: {
            userId_eventId: { userId, eventId },
        },
    });
    if (!savedEvent) {
        throw new AppError(status.NOT_FOUND, "Saved event not found");
    }
    const deleted = await prisma.savedEvent.delete({
        where: {
            userId_eventId: { userId, eventId },
        },
    });
    return deleted;
};
const getMySavedEvents = async (userId, query) => {
    const { page = "1", limit = "10", sortBy = "savedAt", sortOrder = "desc", } = query;
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
                                image: true,
                            },
                        },
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            skip,
            take: limitNum,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma.savedEvent.count({ where }),
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
const isEventSaved = async (userId, eventId) => {
    const savedEvent = await prisma.savedEvent.findUnique({
        where: {
            userId_eventId: { userId, eventId },
        },
    });
    return !!savedEvent;
};
export const savedEventService = {
    saveEvent,
    unsaveEvent,
    getMySavedEvents,
    isEventSaved,
};
//# sourceMappingURL=savedEvent.service.js.map
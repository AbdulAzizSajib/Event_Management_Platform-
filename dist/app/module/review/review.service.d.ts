import { Review } from "../../../generated/prisma/client";
import { IQueryParams, IQueryResult } from "../../interfaces/query.interface";
export declare const reviewService: {
    createReview: (userId: string, payload: {
        eventId: string;
        rating: number;
        comment: string;
    }) => Promise<Review>;
    updateReview: (reviewId: string, userId: string, payload: {
        rating?: number;
        comment?: string;
    }) => Promise<Review>;
    deleteReview: (reviewId: string, userId: string, userRole: string) => Promise<Review>;
    getEventReviews: (eventId: string, query: IQueryParams) => Promise<IQueryResult<Review>>;
    getMyReviews: (userId: string, query: IQueryParams) => Promise<IQueryResult<Review>>;
    getFeaturedReviews: (limit?: number) => Promise<Review[]>;
};
//# sourceMappingURL=review.service.d.ts.map
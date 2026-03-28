import { Invitation } from "../../../generated/prisma/client";
import { IQueryParams, IQueryResult } from "../../interfaces/query.interface";
export declare const invitationService: {
    sendInvitation: (inviterId: string, eventId: string, inviteeId: string) => Promise<Invitation>;
    respondToInvitation: (invitationId: string, userId: string, responseStatus: "ACCEPTED" | "DECLINED") => Promise<Invitation>;
    getMyInvitations: (userId: string, query: IQueryParams) => Promise<IQueryResult<Invitation>>;
    getSentInvitations: (userId: string, eventId: string, query: IQueryParams) => Promise<IQueryResult<Invitation>>;
    cancelInvitation: (invitationId: string, userId: string) => Promise<Invitation>;
};
//# sourceMappingURL=invitation.service.d.ts.map
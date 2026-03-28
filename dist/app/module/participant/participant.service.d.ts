import { Participant } from "../../../generated/prisma/client";
import { ParticipantStatus } from "../../../generated/prisma/enums";
import { IQueryParams, IQueryResult } from "../../interfaces/query.interface";
export declare const participantService: {
    joinEvent: (userId: string, eventId: string) => Promise<Participant>;
    getEventParticipants: (eventId: string, query: IQueryParams) => Promise<IQueryResult<Participant>>;
    getMyParticipations: (userId: string, query: IQueryParams) => Promise<IQueryResult<Participant>>;
    updateParticipantStatus: (participantId: string, userId: string, newStatus: ParticipantStatus) => Promise<Participant>;
    cancelParticipation: (eventId: string, userId: string) => Promise<Participant>;
};
//# sourceMappingURL=participant.service.d.ts.map
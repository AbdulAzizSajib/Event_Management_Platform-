import { SavedEvent } from "../../../generated/prisma/client";
import { IQueryParams, IQueryResult } from "../../interfaces/query.interface";
export declare const savedEventService: {
    saveEvent: (userId: string, eventId: string) => Promise<SavedEvent>;
    unsaveEvent: (userId: string, eventId: string) => Promise<SavedEvent>;
    getMySavedEvents: (userId: string, query: IQueryParams) => Promise<IQueryResult<SavedEvent>>;
    isEventSaved: (userId: string, eventId: string) => Promise<boolean>;
};
//# sourceMappingURL=savedEvent.service.d.ts.map
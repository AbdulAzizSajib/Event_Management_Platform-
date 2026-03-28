export interface TErrorSources {
    path: string;
    message: string;
}
export interface TErrorResponse {
    statusCode?: number;
    success: boolean;
    message: string;
    errorSources: TErrorSources[];
    stack?: string | undefined;
    error?: unknown | undefined;
}
//# sourceMappingURL=error.interface.d.ts.map
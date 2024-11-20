export interface resetPasswordInput {
    userId: number;
    tenantId: number;
    resetCode: string;
    password: string;
}

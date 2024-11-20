export interface GetAllTenantOutput {
    tenancyName: string;
    name: string;
    isActive: boolean;
    id: number;
    subscriptionEndDate?: Date;
}

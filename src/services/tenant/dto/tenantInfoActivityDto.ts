export interface TenantInfoActivityDto {
    id: string;
    tenancyName: string;
    name: string;
    creationTime: Date;
    subscriptionEndDate: Date | undefined | null;
    editionName: string;
    lastActivityTime: Date;
    status: string;
}

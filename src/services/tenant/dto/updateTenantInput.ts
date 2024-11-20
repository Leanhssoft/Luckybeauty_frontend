export default interface UpdateTenantInput {
    tenancyName: string;
    name: string;
    isActive: boolean;
    id: number;
    editionId: number;
    isTrial: boolean;
    subscriptionEndDate?: Date;
}

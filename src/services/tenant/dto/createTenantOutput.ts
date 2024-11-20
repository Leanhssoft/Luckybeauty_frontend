export default interface CreateTenantOutput {
    tenancyName: string;
    name: string;
    isActive: boolean;
    id: number;
    isTrial: boolean;
    subscriptionEndDate?: Date;
}

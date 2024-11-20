export default class GetTenantOutput {
    tenancyName!: string;
    connectionString!: string;
    name!: string;

    isActive!: boolean;

    id!: number;
    editionId!: number;
    isTrial!: boolean;
    subscriptionEndDate?: Date;
}

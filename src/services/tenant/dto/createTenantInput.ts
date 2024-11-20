export default class CreateTenantInput {
    tenancyName!: string;

    name!: string;

    adminEmailAddress!: string;

    connectionString!: string;

    isActive!: boolean;

    isDefaultPassword!: boolean;

    password!: string;

    editionId!: number;

    isTrial!: boolean;

    subscriptionEndDate?: Date;
}

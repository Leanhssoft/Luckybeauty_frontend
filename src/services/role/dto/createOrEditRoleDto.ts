export interface CreateOrEditRoleDto {
    name: string;
    displayName: string;
    description: string;
    grantedPermissions: string[];
    id: number;
}

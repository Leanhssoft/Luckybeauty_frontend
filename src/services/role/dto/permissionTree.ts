export interface PermissionTree {
    name: string;
    displayName: string;
    description: string;
    children: PermissionTree[];
    parentNode: string;
}

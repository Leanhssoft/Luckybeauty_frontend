import { RoleDto } from '../../services/role/dto/roleDto';
import RoleModel from './roleModel';

export interface IUserRoleDto {
    roleId: number;
    idChiNhanh: string;
}

export class RoleDtoCheck implements RoleModel {
    name!: string;
    displayName!: string;
    description?: string;
    id!: number;
    isCheck = false;
}

export interface IChiNhanhRoles {
    idChiNhanh: string;
    tenChiNhanh: string;
    roles: RoleDtoCheck[];
}

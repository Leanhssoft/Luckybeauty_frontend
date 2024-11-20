import { GetAllRoleOutput } from './dto/getAllRoleOutput';
import { GetRoleAsyncInput } from './dto/getRolesAsyncInput';
import GetRoleAsyncOutput from './dto/getRoleAsyncOutput';
import { GetRoleForEditOutput } from './dto/getRoleForEditOutput';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PagedRoleResultRequestDto } from './dto/PagedRoleResultRequestDto';
import http from '../httpService';
import { PermissionTree } from './dto/permissionTree';
import { CreateOrEditRoleDto } from './dto/createOrEditRoleDto';
import { RoleDto } from './dto/roleDto';
import { permissionCheckboxTree } from './dto/permissionCheckboxTree';
import { enqueueSnackbar } from 'notistack';
import { IUserRoleDto } from '../../models/Roles/userRoleDto';
import utils from '../../utils/utils';

class RoleService {
    CreateRole_byChiNhanhOfUser = async (userId: number, params: IUserRoleDto[]) => {
        if (!utils.checkNull(userId?.toString())) {
            const result = await http.post(
                `api/services/app/UserRole/CreateRole_byChiNhanhOfUser?userId=${userId}`,
                params
            );
            return result.data.result;
        }
    };
    GetRolebyChiNhanh_ofUser = async (userId: number) => {
        if (!utils.checkNull(userId?.toString())) {
            const result = await http.get(`api/services/app/UserRole/GetRolebyChiNhanh_ofUser?userId=${userId}`);
            return result.data.result;
        }
    };
    public async createOrEdit(input: CreateOrEditRoleDto) {
        const result = await http.post('api/services/app/Role/CreateOrUpdateRole', input);
        return result.data.result;
    }
    public async getRolesAsync(getRoleAsyncInput: GetRoleAsyncInput): Promise<GetRoleAsyncOutput> {
        const result = await http.get('api/services/app/Role/GetRolesAsync', {
            params: getRoleAsyncInput
        });
        return result.data.result;
    }

    public async delete(entityDto: number) {
        const result = await http.post(`api/services/app/Role/DeleteRole`, { id: entityDto });
        return result.data;
    }

    public async getAllPermissions() {
        const result = await http.get('api/services/app/Role/GetAllPermissions');
        return result.data.result.items;
    }
    public async getAllPermissionTree(): Promise<PermissionTree[]> {
        const responsive = await http.get('api/services/app/Permission/GetAllPermissions');
        return responsive.data.result.items;
    }

    public async getRoleForEdit(id: number): Promise<CreateOrEditRoleDto> {
        const result = await http.get(`api/services/app/Role/GetRoleForEdit?Id=${id}`);
        return result.data.result;
    }

    public async get(entityDto: number) {
        const result = await http.get(`api/services/app/Role/Get?id=${entityDto}`);
        return result.data;
    }

    public async getAll(
        pagedFilterAndSortedRequest: PagedRoleResultRequestDto
    ): Promise<PagedResultDto<GetAllRoleOutput>> {
        const result = await http.get('api/services/app/Role/GetAll', {
            params: pagedFilterAndSortedRequest
        });
        return result.data.result;
    }
}

export default new RoleService();

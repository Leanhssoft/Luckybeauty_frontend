import CreateTenantInput from './dto/createTenantInput';
import CreateTenantOutput from './dto/createTenantOutput';
import { EntityDto } from '../../services/dto/entityDto';
import { GetAllTenantOutput } from './dto/getAllTenantOutput';
import GetTenantOutput from './dto/getTenantOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedTenantResultRequestDto } from './dto/PagedTenantResultRequestDto';
import UpdateTenantInput from './dto/updateTenantInput';
import UpdateTenantOutput from './dto/updateTenantOutput';
import http from '../httpService';
import { PagedRequestDto } from '../dto/pagedRequestDto';
import { TenantHistoryActivityDto } from './dto/tenantHistoryActivityDto';
import { TenantInfoActivityDto } from './dto/tenantInfoActivityDto';

class TenantService {
    public async create(createTenantInput: CreateTenantInput): Promise<CreateTenantOutput> {
        try {
            const result = await http.post('api/services/app/Tenant/Create', createTenantInput);
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while creating tenant:', error);
            throw error;
        }
    }

    public async delete(entityDto: number) {
        try {
            const result = await http.post(`api/services/app/Tenant/DeleteTenant?id=${entityDto}`);
            return result.data;
        } catch (error) {
            console.error('Error occurred while deleting tenant:', error);
            throw error;
        }
    }

    public async get(entityDto: number): Promise<GetTenantOutput> {
        try {
            const result = await http.get(`api/services/app/Tenant/Get?Id=${entityDto}`);
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while retrieving tenant:', error);
            throw error;
        }
    }
    public async getForEdit(entityDto: number): Promise<GetTenantOutput> {
        try {
            const result = await http.get(`api/services/app/Tenant/GetTenantForEdit?Id=${entityDto}`);
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while retrieving tenant:', error);
            throw error;
        }
    }

    public async getAll(
        pagedFilterAndSortedRequest: PagedTenantResultRequestDto
    ): Promise<PagedResultDto<GetAllTenantOutput>> {
        try {
            const result = await http.get('api/services/app/Tenant/GetAll', {
                params: pagedFilterAndSortedRequest
            });
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while retrieving all tenants:', error);
            throw error;
        }
    }

    public async update(updateTenantInput: UpdateTenantInput): Promise<UpdateTenantOutput> {
        try {
            const result = await http.post('api/services/app/Tenant/UpdateTenant', updateTenantInput);
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while updating tenant:', error);
            throw error;
        }
    }

    public async getTenantHistoryActivity(
        pagedFilterAndSortedRequest: PagedRequestDto,
        tenantId: number
    ): Promise<PagedResultDto<TenantHistoryActivityDto>> {
        try {
            const result = await http.get('api/services/app/Tenant/GetTenantHistoryActivity', {
                params: { ...pagedFilterAndSortedRequest, tenantId: tenantId }
            });
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while retrieving all tenants:', error);
            throw error;
        }
    }
    public async getTenantStatusActivity(
        pagedFilterAndSortedRequest: PagedTenantResultRequestDto
    ): Promise<PagedResultDto<TenantInfoActivityDto>> {
        try {
            const result = await http.get('api/services/app/Tenant/getTenantStatusActivity', {
                params: pagedFilterAndSortedRequest
            });
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while retrieving all tenants:', error);
            throw error;
        }
    }
}

export default new TenantService();

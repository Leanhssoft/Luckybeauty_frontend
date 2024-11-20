import { makeAutoObservable } from 'mobx';
import CreateTenantInput from '../services/tenant/dto/createTenantInput';
import { EntityDto } from '../services/dto/entityDto';
import { GetAllTenantOutput } from '../services/tenant/dto/getAllTenantOutput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedTenantResultRequestDto } from '../services/tenant/dto/PagedTenantResultRequestDto';
import TenantModel from '../models/Tenants/TenantModel';
import UpdateTenantInput from '../services/tenant/dto/updateTenantInput';
import tenantService from '../services/tenant/tenantService';

class TenantStore {
    tenants!: PagedResultDto<GetAllTenantOutput>;

    tenantModel: TenantModel = new TenantModel();

    constructor() {
        makeAutoObservable(this);
    }

    async create(createTenantInput: CreateTenantInput) {
        await tenantService.create(createTenantInput);
    }
    async createTenant() {
        this.tenantModel = {
            id: 0,
            isActive: true,
            name: '',
            tenancyName: ''
        };
    }
    async update(updateTenantInput: UpdateTenantInput) {
        const result = await tenantService.update(updateTenantInput);

        this.tenants.items = this.tenants.items.map((x: GetAllTenantOutput) => {
            if (x.id === updateTenantInput.id) {
                x = result;
            }
            return x;
        });
    }
    async delete(entityDto: number) {
        await tenantService.delete(entityDto);
        this.tenants.items = this.tenants.items.filter((x: GetAllTenantOutput) => x.id !== entityDto);
    }
    async get(entityDto: number) {
        const result = await tenantService.get(entityDto);
        this.tenantModel = result;
    }

    async getAll(pagedFilterAndSortedRequest: PagedTenantResultRequestDto) {
        const result = await tenantService.getAll(pagedFilterAndSortedRequest);
        this.tenants = result;
    }
}

export default TenantStore;

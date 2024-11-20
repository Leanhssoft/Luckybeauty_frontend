import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import CreateOrEditEditionDto from './dto/CreateOrEditEditionDto';
import { EditionListDto } from './dto/EditionListDto';
import { GetFeatureOutput } from './dto/GetFeatureOutPut';
class EditionService {
    public async getAllEdition(): Promise<PagedResultDto<EditionListDto>> {
        const result = await http.get('api/services/app/Edition/GetEditions');
        return result.data.result;
    }
    public async getForEdit(entityDto: number) {
        const result = await http.get(`api/services/app/Edition/GetEditionForEdit?Id=${entityDto}`);
        return result.data.result;
    }
    public async createOrEditEdition(input: CreateOrEditEditionDto) {
        const result = await http.post('api/services/app/Edition/CreateOrEditEdition', input);
        return result.data;
    }
    public async deleteEdition(entityDto: number) {
        const result = await http.post(`api/services/app/Edition/DeleteEdition`, { id: entityDto });
        return result.data;
    }
    public async getAllFeature(): Promise<GetFeatureOutput> {
        const result = await http.get('api/services/app/Edition/GetAllFeature');
        return result.data.result;
    }
}
export default new EditionService();

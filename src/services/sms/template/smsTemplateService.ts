import { String } from 'lodash';
import http from '../../httpService';
import { CreateOrEditSMSTemplateDto } from './dto/CreateOrEditSMSTemplateDto';
import { PagedRequestDto } from '../../dto/pagedRequestDto';

class SMSTempalteService {
    public async createOrEdit(input: CreateOrEditSMSTemplateDto) {
        const response = await http.post('api/services/app/SMSTemplate/CreateOrEdit', input);
        return response.data.result;
    }
    public async delete(id: string) {
        const response = await http.post(`api/services/app/SMSTemplate/Delete?Id=${id}`);
        return response.data.result;
    }
    public async getForEdit(id: string) {
        const response = await http.get(`api/services/app/SMSTemplate/GetForEdit?Id=${id}`);
        return response.data.result;
    }
    public async getAll(input: PagedRequestDto) {
        const response = await http.get(`api/services/app/SMSTemplate/GetAll`, { params: input });
        return response.data.result;
    }
}
export default new SMSTempalteService();

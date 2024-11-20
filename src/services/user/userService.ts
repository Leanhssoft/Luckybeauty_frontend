import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { CreateOrUpdateUserInput } from './dto/createOrUpdateUserInput';
import { EntityDto } from '../../services/dto/entityDto';
import { GetAllUserOutput } from './dto/getAllUserOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from './dto/PagedUserResultRequestDto';
import { UpdateUserInput } from './dto/updateUserInput';
import http from '../httpService';
import { IUserProfileDto, ProfileDto } from './dto/ProfileDto';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import utils from '../../utils/utils';

class UserService {
    public async create(createUserInput: CreateOrUpdateUserInput) {
        try {
            // insert user + userRole
            const result = await http.post('api/services/app/User/Create', createUserInput);
            return result.data.result;
        } catch (error) {
            // Handle the error here
            console.error('Error occurred while creating user:', error);
            throw error; // Optional: Rethrow the error to the caller
        }
    }

    CheckExistUser = async (userId: number, userName: string) => {
        if (!utils.checkNull(userName)) {
            const result = await http.get(`api/services/app/User/CheckExistUser?userId=${userId}&userName=${userName}`);
            return result.data.result;
        }
        return false;
    };
    CheckExistEmail = async (userId: number, email: string) => {
        if (!utils.checkNull(email)) {
            const result = await http.get(`api/services/app/User/CheckExistEmail?userId=${userId}&email=${email}`);
            return result.data.result;
        }
        return false;
    };
    CheckMatchesPassword = async (userId: number, password: string) => {
        if (userId !== 0 && !utils.checkNull(password)) {
            const result = await http.get(
                `api/services/app/User/CheckMatchesPassword?userId=${userId}&plainPassword=${password}`
            );
            return result.data.result;
        }
        return true;
    };
    CreateUser = async (param: CreateOrUpdateUserInput) => {
        //  used to insert user (not role)
        const result = await http.post('api/services/app/User/CreateUser', param);
        return result.data.result;
    };
    UpdateUser = async (param: CreateOrUpdateUserInput) => {
        // update user (not role)
        const result = await http.post('api/services/app/User/UpdateUser_notRole', param);
        return result.data.result;
    };
    ActiveUser = async (userId: number): Promise<boolean> => {
        const result = await http.post(`api/services/app/User/Activate`, { id: userId });
        return result.data.success;
    };
    DeActivateUser = async (userId: number): Promise<boolean> => {
        const result = await http.post(`api/services/app/User/DeActivate`, { id: userId });
        return result.data.success;
    };

    public async update(updateUserInput: UpdateUserInput) {
        // update user + userRole
        try {
            const result = await http.post('api/services/app/User/UpdateUser', updateUserInput);
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while updating user:', error);
            throw error;
        }
    }

    public async delete(userId: number) {
        try {
            const result = await http.delete(`api/services/app/User/Delete?id=${userId}`);
            return result.data;
        } catch (error) {
            console.error('Error occurred while deleting user:', error);
            throw error;
        }
    }

    public async getRoles() {
        try {
            const result = await http.get('api/services/app/User/GetRoles');
            return result.data.result.items;
        } catch (error) {
            console.error('Error occurred while retrieving roles:', error);
            throw error;
        }
    }

    public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
        try {
            const result = await http.post('api/services/app/User/ChangeLanguage', changeLanguageInput);
            return result.data;
        } catch (error) {
            console.error('Error occurred while changing language:', error);
            throw error;
        }
    }

    public async get(entityDto: number): Promise<CreateOrUpdateUserInput> {
        try {
            const result = await http.get(`api/services/app/User/Get?Id=${entityDto}`);
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while retrieving user:', error);
            throw error;
        }
    }
    public async getForUpdateProfile(): Promise<ProfileDto> {
        const response = await http.get('api/services/app/UserProfile/GetForUpdateProfile');
        return response.data.result;
    }

    public async updateProfile(input: ProfileDto): Promise<boolean> {
        const response = await http.post('api/services/app/UserProfile/UpdateProfile', input);
        return response.data.result;
    }
    public async updatePassword(input: ChangePasswordDto) {
        const response = await http.post('api/services/app/UserProfile/ChangeUserPassword', input);
        return response.data.result;
    }
    public async getAll(
        pagedFilterAndSortedRequest: PagedUserResultRequestDto
    ): Promise<PagedResultDto<GetAllUserOutput>> {
        try {
            const result = await http.get('api/services/app/User/GetAll', {
                params: pagedFilterAndSortedRequest
            });
            return result.data.result;
        } catch (error) {
            console.error('Error occurred while retrieving all users:', error);
            throw error;
        }
    }
    GetAllUser = async (
        pagedFilterAndSortedRequest: PagedUserResultRequestDto
    ): Promise<PagedResultDto<IUserProfileDto>> => {
        try {
            const result = await http.get('api/services/app/User/GetAllUser', {
                params: pagedFilterAndSortedRequest
            });
            return result.data.result;
        } catch (error) {
            return { items: [], totalCount: 0, totalPage: 0 } as PagedResultDto<IUserProfileDto>;
        }
    };
}

export default new UserService();

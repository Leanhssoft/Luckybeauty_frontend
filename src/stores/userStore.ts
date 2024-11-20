import { makeAutoObservable, runInAction } from 'mobx';

import type { CreateOrUpdateUserInput } from '../services/user/dto/createOrUpdateUserInput';
import { EntityDto } from '../services/dto/entityDto';
import { GetRoles } from '../services/user/dto/getRolesOuput';
import { GetUserOutput } from '../services/user/dto/getUserOutput';
import type { PagedResultDto } from '../services/dto/pagedResultDto';
import type { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
import type { UpdateUserInput } from '../services/user/dto/updateUserInput';
import userService from '../services/user/userService';
import { ProfileDto } from '../services/user/dto/ProfileDto';

class UserStore {
    users!: PagedResultDto<GetUserOutput>;

    editUser!: CreateOrUpdateUserInput;

    roles: GetRoles[] = [];

    profileDto!: ProfileDto;

    constructor() {
        makeAutoObservable(this);
    }
    async create(createUserInput: CreateOrUpdateUserInput) {
        const result = await userService.create(createUserInput);
        this.users.items.push(result);
    }

    async update(updateUserInput: UpdateUserInput) {
        const result = await userService.update(updateUserInput);
        this.users.items = this.users.items.map((x: GetUserOutput) => {
            if (x.id === updateUserInput.id) {
                x = result;
            }
            return x;
        });
    }

    async delete(entityDto: EntityDto) {
        await userService.delete(entityDto.id);
        this.users.items = this.users.items.filter((x: GetUserOutput) => x.id !== entityDto.id);
    }

    async getRoles() {
        const result = await userService.getRoles();
        this.roles = result;
    }

    async get(entityDto: EntityDto) {
        const result = await userService.get(entityDto.id);
        this.editUser = result;
    }

    async createUser() {
        this.editUser = {
            userName: '',
            name: '',
            surname: '',
            emailAddress: '',
            phoneNumber: '',
            isActive: false,
            isAdmin: false,
            roleNames: [],
            password: '',
            nhanSuId: '',
            id: 0
        };
        this.roles = [];
    }
    async getForUpdateProfile() {
        runInAction(async () => {
            const result = await userService.getForUpdateProfile();
            this.profileDto = result;
        });
    }
    async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
        const result = await userService.getAll(pagedFilterAndSortedRequest);
        this.users = result;
    }

    async changeLanguage(languageName: string) {
        await userService.changeLanguage({ languageName: languageName });
    }
}

export default new UserStore();

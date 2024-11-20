import { EntityDto } from './../../dto/entityDto';

export default class UserLoginInfoDto extends EntityDto {
    name!: string;

    surname!: string;

    fullName!: string;

    userName!: string;

    emailAddress!: string;

    nhanSuId!: string | null;

    avatar!: string | null;

    idChiNhanhMacDinh!: string | null;
}

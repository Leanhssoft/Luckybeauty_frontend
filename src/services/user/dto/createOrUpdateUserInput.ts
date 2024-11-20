export interface CreateOrUpdateUserInput {
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    phoneNumber: string;
    isActive: boolean;
    roleNames: string[];
    password: string;
    id: number;
    nhanSuId: string | null;
    isAdmin?: boolean;
    idChiNhanhMacDinh?: string | null;
}

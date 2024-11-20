export interface UpdateUserInput {
    userName: string;
    name: string;
    surname: string;
    password: string;
    emailAddress: string;
    phoneNumber: string;
    isActive: boolean;
    roleNames: string[];
    id: number;
    nhanSuId: string;
    isAdmin: boolean;
}

import { makeAutoObservable, observable } from 'mobx';

class LoginModel {
    tenancyName!: string;

    userNameOrEmailAddress!: string;

    password!: string;

    rememberMe!: boolean;

    showModal!: boolean;
    constructor() {
        makeAutoObservable(this, {
            rememberMe: observable,
            showModal: observable
        });
    }

    toggleRememberMe = () => {
        this.rememberMe = !this.rememberMe;
    };

    toggleShowModal = () => {
        this.showModal = !this.showModal;
    };
}

export default LoginModel;

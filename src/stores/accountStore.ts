import { action, observable, makeObservable, makeAutoObservable } from 'mobx';

import IsTenantAvaibleOutput from '../services/account/dto/isTenantAvailableOutput';
import accountService from '../services/account/accountService';

class AccountStore {
    tenant: IsTenantAvaibleOutput = new IsTenantAvaibleOutput();
    constructor() {
        makeAutoObservable(this);
    }
    public isTenantAvailable = async (tenancyName: string) => {
        this.tenant = await accountService.isTenantAvailable({
            tenancyName: tenancyName
        });
    };
}

export default AccountStore;

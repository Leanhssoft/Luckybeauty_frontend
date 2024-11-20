import { AuthenticationModel } from './dto/authenticationModel';
import { AuthenticationResultModel } from './dto/authenticationResultModel';
import http from '../httpService';
import { ImpersonatedAuthenticateResultModel } from './dto/impersonatedAuthenticateResultModel';

class TokenAuthService {
    public async authenticate(authenticationInput: AuthenticationModel): Promise<AuthenticationResultModel> {
        const result = await http.post('api/TokenAuth/Authenticate', authenticationInput);
        return result.data.result;
    }
    public async ImpersonatedAuthenticate(impersonationToken: string): Promise<ImpersonatedAuthenticateResultModel> {
        const result = await http.post(
            `api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=${impersonationToken}`
        );
        return result.data.result;
    }
}

export default new TokenAuthService();

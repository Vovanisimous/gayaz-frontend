import {useContext} from "react";
import {AppContext} from "../app/App";
import {transport} from "../services/Transport";
import {IUser} from "../entities/user.entity";

interface IAuth {
    onLogin: (login: string, password: string) => Promise<any>;

    onAuthorization: () => Promise<void>

    onLogout: () => void;
}

export const useAuth = (): IAuth => {
    const context = useContext(AppContext);

    const onLogin = async (username: string, password: string) => {
        const userToken =  await transport.post<any, {username: string, password: string}>('auth/login', {
            username,
            password
        })
        transport.setToken(userToken.access_token)
    }

    const onAuthorization =  async () =>  {
        const userInstance = await transport.get<{userId: string, username: string}>('profile');
        const user = await transport.get<IUser>(`user/${userInstance.username}`);
        if(user) {
            context.setUser(user)
            context.setAuth(true)
        }
    }

    const onLogout = () => {
        context.setAuth(false)
        context.setUser(undefined)
        localStorage.removeItem('token')
    }

    return {onLogin, onLogout, onAuthorization}
}
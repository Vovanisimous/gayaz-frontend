import {useContext} from "react";
import {AppContext} from "../app/App";
import {transport} from "../services/Transport";
import {IUser} from "../entities/user.entity";
import {user} from "../database/users";

interface IAuth {
    onLogin: (login: string, password: string) => Promise<any>;

    onAuthorization: (login: string, password: string) => Promise<void>

    onLogout: () => void;
}

export const useAuth = (): IAuth => {
    const context = useContext(AppContext);

    const onLogin = async (username: string, password: string) => {
        // const userToken =  await transport.post<any, {username: string, password: string}>('auth/login', {
        //     username,
        //     password
        // })
        // transport.setToken(userToken.access_token)

    }

    const onAuthorization =  async (username: string, password: string) =>  {
        // const userInstance = await transport.get<{userId: string, username: string}>('profile');
        // const user = await transport.get<IUser>(`user/${userInstance.username}`);
        // if(user) {
        //     context.setUser(user)
        //     context.setAuth(true)

        const user1 = user.find((item) => {
            return item.login === username && item.password === password;
        })
        if (user1) {
            context.setUser(user1)
            context.setAuth(true)
        }else {
            throw Error("Пользователь не найден")
        }
    }

    const onLogout = () => {
        context.setAuth(false)
        context.setUser(undefined)
        localStorage.removeItem('token')
    }

    return {onLogin, onLogout, onAuthorization}
}
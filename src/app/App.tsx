import React, {createContext, useEffect, useState} from 'react';
import {transport} from "../services/Transport";
import {IAppContext} from "../entities/app.entity";
import {IUser} from "../entities/user.entity";
import {Route} from "react-router";
import {Authorization} from "../pages/Authorization";
import {Header} from "../components/Header";
import {BrowserRouter} from "react-router-dom";
import {Main} from "../pages/Main";
import {Dealers} from "../pages/Dealers";
import {CreateUser} from "../pages/CreateUser";
import {Managers} from "../pages/Managers";
import {Users} from "../pages/Users";
import {CreateOrder} from "../pages/CreateOrder";
import {Products} from "../pages/Products";
import {Analysis} from "../pages/Analysis";

transport.init('http://localhost:3000/')

export const AppContext = createContext<IAppContext>({
  auth: false,
  setAuth(value: boolean) {
    return
  },
  setUser(value: IUser | undefined) {
    return
  }
})


function App() {
  const [auth, setAuth] = useState(false)
  const [user, setUser] = useState<IUser | undefined>(undefined)


  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      setAuth(false);
      setUser(undefined)
    } else {
      transport.get<{userId: string, username: string}>('profile').then((userInstance) => {
        transport.get<IUser>(`user/${userInstance.username}`).then((user) => {
          if(user) {
            setUser(user)
            setAuth(true)
          }
        })
      })
    }
  }, [])

  return (
    <AppContext.Provider value={{auth, user, setAuth, setUser}}>
      <BrowserRouter>
        <Header />
        <Route exact path={"/"} component={Authorization} />
        <Route exact path={"/main"} component={Main} />
        <Route exact path={"/dealers"} component={Dealers} />
        <Route exact path={"/create-user"} component={CreateUser} />
        <Route exact path={"/managers"} component={Managers} />
        <Route exact path={"/users"} component={Users} />
        <Route exact path={"/create-order"} component={CreateOrder}/>
        <Route exact path={"/products"} component={Products}/>
        <Route exact path={"/analysis"} component={Analysis}/>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;

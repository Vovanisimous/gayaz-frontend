import React, {useContext} from "react";
import {AppBar, Button, makeStyles, Toolbar, Typography} from "@material-ui/core";
import {AppContext} from "../app/App";
import {useAuth} from "../hooks/useAuth";
import {useHistory} from "react-router";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textDecoration: "none",
        color: "white",
        fontSize: "40px",
    },
    logoutButton: {
        marginRight: 20,
    },
    userBox: {
        display: "flex",
        alignItems: "center",
        marginLeft: "auto",
    },
    username: {
        paddingRight: 15
    }
}));

export const Header = () => {
    const context = useContext(AppContext)
    const classes = useStyles();
    const auth = useAuth()
    const history = useHistory()

    const onRedirect = (path: string) => {
        history.push(path)
    }

    const onLogout = () => {
        auth.onLogout();
        history.push('/')
    }

    return (
        <AppBar position={"fixed"}>
            <Toolbar>
                {context.user?.role.id === "7e71666b-21f1-4876-90a3-6a161851613b" &&
                <Button variant="contained" className={classes.menuButton} onClick={() => onRedirect('/main')}>
                    Заказы
                </Button>
                }

                {context.user?.role.id === "e4493c81-51f5-4501-9bc8-32aaa4725d83" &&
                <Button variant="contained" className={classes.menuButton} onClick={() => onRedirect('/main')}>
                    Заказы
                </Button>
                }

                {context.user?.role.id === "e688014e-ef4c-4df9-a2e6-8277200936e1" &&
                <Button variant="contained" className={classes.menuButton} onClick={() => onRedirect('/main')}>
                    Заказы
                </Button>
                }

                {context.user?.role.id === "7e71666b-21f1-4876-90a3-6a161851613b" &&
                <Button variant="contained" className={classes.menuButton} onClick={() => onRedirect('/dealers')}>
                    Дилеры
                </Button>
                }

                {context.user?.role.id === "7e71666b-21f1-4876-90a3-6a161851613b" &&
                <Button variant="contained" className={classes.menuButton} onClick={() => onRedirect('/managers')}>
                    Менеджеры
                </Button>
                }

                {context.user?.role.id === "7e71666b-21f1-4876-90a3-6a161851613b" &&
                <Button variant="contained" className={classes.menuButton} onClick={() => onRedirect('/users')}>
                    Пользователи
                </Button>
                }

                {context.user?.role.id === "45c68ea3-b69c-40d5-90cc-e1f7fe7cc017" &&
                <Button variant="contained" className={classes.menuButton} onClick={() => onRedirect('/analysis')}>
                    Аналитика
                </Button>
                }
                {context.auth && (
                    <div className={classes.userBox}>
                        <Typography className={classes.username}>{context.user?.login}</Typography>
                        <Button variant="contained" className={classes.logoutButton} onClick={onLogout}>
                            Logout
                        </Button>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    )
}
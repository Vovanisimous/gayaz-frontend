import React, {useContext, useState} from "react";
import {Button, Card, makeStyles, TextField} from "@material-ui/core";
import {useHistory} from "react-router";
import {useAuth} from "../hooks/useAuth";
import {AppContext} from "../app/App";

const styles = makeStyles(() => ({
    container: {
        height: "100vh",
        position: "relative",
    },
    card: {
        padding: 20,
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 600,
        transform: "translate(-50%, -50%)",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridRowGap: 20,
    },
    register: {
        textDecoration: "none",
    },
    root: {
        marginLeft: "auto",
    },
    error: {
        color: "red",
    },
}));

export const Authorization = () => {
    const context = useContext(AppContext);
    const classes = styles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const auth = useAuth();

    const onLogin = async () => {
        await auth.onLogin(username, password).then((response) => {
            setUsername("");
            setPassword("");
            auth.onAuthorization()
                .then(() => {
                    if (context.user?.role.id == "45c68ea3-b69c-40d5-90cc-e1f7fe7cc017") {
                        history.push('/analysis')
                    }else {
                        history.push("/main")
                    }
                })
        }).catch((e) => {
            Error(e)
        })
    }

    return (
        <div className={classes.container}>
            <Card className={classes.card} variant="outlined">
                <TextField
                    id="standard-basic"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    id="standard-basic"
                    label="Password"
                    type={"password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={onLogin}>
                    Login
                </Button>
            </Card>
        </div>
    )
}
import React, {ChangeEvent, useEffect, useState} from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
    makeStyles,
    TextField,
    Typography
} from "@material-ui/core";
import {useUser} from "../hooks/useUser";
import {useHistory} from "react-router";
import {IUser} from "../entities/user.entity";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        marginTop: 64,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    textField: {
        width: "60%",
        paddingTop: 50,
    },
    createUserButton: {
        margin: 15
    },
    card: {
        width: "60%",
        padding: 30,
        margin: 10,
    },
    usersCard: {
        width: "60%",
        padding: 30,
        margin: 10,
        "&:hover": {
            cursor: "pointer",
        },
    },
    usersList: {
        width: "59%",
        padding: 0,
        borderStyle: "solid",
        borderWidth: 2,
        borderRadius: 3,
        borderColor: theme.palette.primary.main,
        position: "absolute",
        textAlign: "center",
        top: 155,
    },
    usersListItem: {
        listStyleType: "none",
        padding: 3,
        background: "white",
        "&:hover": {
            background: theme.palette.primary.light,
        },
    },
    button: {
        margin: 10,
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    editTextField: {
        marginBottom: 10,
    },
}));

export const Users = () => {
    const classes = useStyles();
    const usersHook = useUser()
    const history = useHistory()
    const [users, setUsers] = useState<IUser[]>([])
    const [searchUsers, setSearchUsers] = useState<IUser[]>([]);
    const [userInput, setUserInput] = useState("");
    const [searchDisplay, setSearchDisplay] = useState<"none" | "block">("none");

    useEffect(() => {
        usersHook.getUsers().then((result) => setUsers(result));
    }, []);

    useEffect(() => {
        setUsers(searchUsers);
    }, [searchUsers]);

    const onUserInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
        usersHook.getUsers().then((result) =>
            setSearchUsers(
                result.filter((user) => {
                    return user.login
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase());
                })
            )
        );
        setSearchDisplay("block");
        if (e.target.value === "") {
            setSearchDisplay("none");
        }
    };

    const onUserSearch = (id: string) => {
        setUsers(
            users.filter((user) => {
                return user.id === id;
            })
        );
    };

    return (
        <div className={classes.mainContainer}>
            <TextField
                placeholder={"Поиск пользователя"}
                className={classes.textField}
                variant={"outlined"}
                value={userInput}
                onChange={onUserInputChange}
                onBlur={() => setSearchDisplay("none")}
            />
            <Button
                variant={"contained"}
                color={"primary"}
                className={classes.createUserButton}
                onClick={() => {
                    history.push("/create-user");
                }}
            >
                Создать пользователя
            </Button>
            <ul style={{ display: searchDisplay }} className={classes.usersList}>
                {searchUsers.map((item) => (
                    <li
                        key={item.id}
                        className={classes.usersListItem}
                        onClick={() => onUserSearch(item.id)}
                    >
                        {item.login}
                    </li>
                ))}
            </ul>
            {users.map((user) => (
                <Card className={classes.card} key={user.id}>
                    <CardHeader title={user.login} />
                    <CardContent>
                        <Typography>Идентификатор: {user.id}</Typography>
                        <Typography>Роль: {user.role.name}</Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

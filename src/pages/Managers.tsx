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
import {useManager} from "../hooks/useManager";
import {useUser} from "../hooks/useUser";
import {IManager} from "../entities/manager.entity";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

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
    card: {
        width: "60%",
        padding: 30,
        margin: 10,
    },
    managersCard: {
        width: "60%",
        padding: 30,
        margin: 10,
        "&:hover": {
            cursor: "pointer",
        },
    },
    managersList: {
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
    managersListItem: {
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
}))

export const Managers = () => {
    const classes = useStyles();
    const managersHook = useManager();
    const usersHook = useUser();
    const [managers, setManagers] = useState<IManager[]>([])
    const [searchManagers, setSearchManagers] = useState<IManager[]>([]);
    const [managerInput, setManagerInput] = useState("");
    const [searchDisplay, setSearchDisplay] = useState<"none" | "block">("none");
    const [editDisplay, setEditDisplay] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [phoneNumberInput, setPhoneNumberInput] = useState("");

    useEffect(() => {
        managersHook.getManagers().then((result) => setManagers(result))
    }, [])

    useEffect(() => {
        setManagers(searchManagers)
    }, [searchManagers])

    const onManagerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setManagerInput(e.target.value);
        managersHook.getManagers().then((result) =>
            setSearchManagers(
                result.filter((manager) => {
                    return manager.name
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

    const onManagerSearch = (id: string) => {
        setManagers(
            managers.filter((manager) => {
                return manager.id === id;
            })
        );
    };

    const onEditManagerDisplay = (manager: IManager) => {
        setEditDisplay(!editDisplay);
        setNameInput(manager.name);
        setPhoneNumberInput(manager.phone_number);
    };

    const onEditManager = (manager: IManager) => {
        const { user, ...managerRequestData } = manager;
        managersHook
            .createManager({
                ...managerRequestData,
                name: nameInput,
                phone_number: phoneNumberInput,
                userId: user.id,
            })
            .then(() => {
                setNameInput("")
                setPhoneNumberInput("");
                setEditDisplay(false);
                managersHook.getManagers().then((result) => setManagers(result));
            });
    };
    const onDeleteManager = (manager: IManager) => {
        managersHook.deleteManager(manager.id).then(() => {
            usersHook.deleteUser(manager.user.id).then(() => {
                managersHook.getManagers().then((result) => setManagers(result));
            })
        });
    };


    return (
        <div className={classes.mainContainer}>
            <TextField
                placeholder={"Поиск менеджера"}
                className={classes.textField}
                variant={"outlined"}
                value={managerInput}
                onChange={onManagerInputChange}
                onBlur={() => setSearchDisplay("none")}
            />
            <ul style={{ display: searchDisplay }} className={classes.managersList}>
                {searchManagers.map((item) => (
                    <li
                        key={item.id}
                        className={classes.managersListItem}
                        onClick={() => onManagerSearch(item.id)}
                    >
                        {item.name}
                    </li>
                ))}
            </ul>
            {managers.map((manager) => (
                <Card className={classes.card} key={manager.id}>
                    <CardHeader title={manager.name} />
                    <CardContent>
                        <Typography>Должность: {manager.position}</Typography>
                        <Typography>Телефон: {manager.phone_number}</Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton
                            aria-label={"Редактировать"}
                            onClick={() => onEditManagerDisplay(manager)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            aria-label={"Удалить"}
                            onClick={() => {
                                onDeleteManager(manager);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                    {editDisplay && (
                        <div>
                            <TextField
                                label={"ФИО"}
                                variant={"outlined"}
                                fullWidth
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                className={classes.editTextField}
                            />
                            <TextField
                                label={"Номер телефона"}
                                variant={"outlined"}
                                fullWidth
                                value={phoneNumberInput}
                                onChange={(e) => setPhoneNumberInput(e.target.value)}
                                className={classes.editTextField}
                            />
                            <Button
                                variant={"contained"}
                                color={"primary"}
                                onClick={() => onEditManager(manager)}
                            >
                                Редактировать
                            </Button>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    )
}
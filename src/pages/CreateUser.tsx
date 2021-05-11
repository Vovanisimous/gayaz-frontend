import React, { useState } from "react";
import { useDealer } from "../hooks/useDealer";
import {
  Button,
  Card,
  CardHeader,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useUser } from "../hooks/useUser";
import { useHistory } from "react-router";
import { useManager } from "../hooks/useManager";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    marginTop: 64,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "60%",
    padding: 30,
    margin: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "90%",
    marginTop: 10,
    marginBottom: 10,
  },
  rolesButtonsContainer: {
    width: "90%",
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
  },
  roleButton: {
    margin: "0px 10px 0px 10px",
  },
  roleContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export const CreateUser = () => {
  const classes = useStyles();
  const dealerHook = useDealer();
  const managerHook = useManager();
  const userHook = useUser();
  const history = useHistory();
  const [selectRole, setSelectRole] = useState<"dealer" | "manager" | "none">(
    "none"
  );
  const [dealerName, setDealerName] = useState("");
  const [dealerAddress, setDealerAddress] = useState("");
  const [dealerCity, setDealerCity] = useState("");
  const [dealerPhoneNumber, setDealerPhoneNumber] = useState("");
  const [dealerPersonalDiscount, setDealerPersonalDiscount] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerPhoneNumber, setManagerPhoneNumber] = useState("");
  const [managerPosition, setManagerPosition] = useState("");

  const createUser = () => {
    switch (selectRole) {
      case "dealer":
        if (dealerPersonalDiscount === "") {
          setDealerPersonalDiscount("0%");
        }
        userHook
          .createUser({
            login: login,
            password: password,
            roleId: "e688014e-ef4c-4df9-a2e6-8277200936e1",
          })
          .then((user) =>
            dealerHook
              .createDealer({
                name: dealerName,
                address: dealerAddress,
                town: dealerCity,
                phone_number: dealerPhoneNumber,
                personal_discount: dealerPersonalDiscount,
                userId: user.id,
              })
              .then(() => {
                history.push("/dealers");
              })
          );
        break;
      case "manager":
        userHook
          .createUser({
            login: login,
            password: password,
            roleId: "e4493c81-51f5-4501-9bc8-32aaa4725d83",
          })
          .then((user) =>
            managerHook
              .createManager({
                name: managerName,
                phone_number: managerPhoneNumber,
                position: managerPosition,
                userId: user.id,
              })
              .then(() => {
                history.push("/managers");
              })
          );
        break;
      case "none":
        userHook
            .createUser({
              login: login,
              password: password,
              roleId: "45c68ea3-b69c-40d5-90cc-e1f7fe7cc017",
            }).then(() => {
              history.push("/")
        })
        break;
      default:
        console.log("Ошибка :)")
    }
  };

  const onRoleSelect = (role: "dealer" | "manager" | "none") => {
    setSelectRole(role);
  };

  return (
    <div className={classes.mainContainer}>
      <Card className={classes.card}>
        <CardHeader title={"Создание дилера"} />
        <div className={classes.inputContainer}>
          <Typography>Логин:</Typography>
          <TextField
            value={login}
            variant={"outlined"}
            onChange={(e) => {
              setLogin(e.target.value);
            }}
            fullWidth
          />
        </div>
        <div className={classes.inputContainer}>
          <Typography>Пароль:</Typography>
          <TextField
            value={password}
            variant={"outlined"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            fullWidth
          />
        </div>
        <Typography>Роль:</Typography>
        <div className={classes.rolesButtonsContainer}>
          <Button
            variant={"contained"}
            color={"primary"}
            className={classes.roleButton}
            onClick={() => onRoleSelect("dealer")}
          >
            Дилер
          </Button>
          <Button
            variant={"contained"}
            color={"primary"}
            className={classes.roleButton}
            onClick={() => onRoleSelect("manager")}
          >
            Менеджер
          </Button>
          <Button
            variant={"contained"}
            color={"primary"}
            className={classes.roleButton}
            onClick={() => onRoleSelect("none")}
          >
            Руководитель отдела оптовых продаж
          </Button>
        </div>
        {selectRole === "dealer" && (
          <div className={classes.roleContainer}>
            <div className={classes.inputContainer}>
              <Typography>Юридическое название:</Typography>
              <TextField
                value={dealerName}
                variant={"outlined"}
                onChange={(e) => {
                  setDealerName(e.target.value);
                }}
                fullWidth
              />
            </div>
            <div className={classes.inputContainer}>
              <Typography>Юридический адресс:</Typography>
              <TextField
                value={dealerAddress}
                variant={"outlined"}
                onChange={(e) => {
                  setDealerAddress(e.target.value);
                }}
                fullWidth
              />
            </div>
            <div className={classes.inputContainer}>
              <Typography>Город:</Typography>
              <TextField
                value={dealerCity}
                variant={"outlined"}
                onChange={(e) => {
                  setDealerCity(e.target.value);
                }}
                fullWidth
              />
            </div>
            <div className={classes.inputContainer}>
              <Typography>Номер телефона:</Typography>
              <TextField
                value={dealerPhoneNumber}
                variant={"outlined"}
                onChange={(e) => {
                  setDealerPhoneNumber(e.target.value);
                }}
                fullWidth
              />
            </div>
            <div className={classes.inputContainer}>
              <Typography>Персональная скидка:</Typography>
              <TextField
                value={dealerPersonalDiscount}
                variant={"outlined"}
                onChange={(e) => {
                  setDealerPersonalDiscount(e.target.value);
                }}
                fullWidth
              />
            </div>
          </div>
        )}
        {selectRole === "manager" && (
          <div className={classes.roleContainer}>
            <div className={classes.inputContainer}>
              <Typography>ФИО:</Typography>
              <TextField
                value={managerName}
                variant={"outlined"}
                onChange={(e) => {
                  setManagerName(e.target.value);
                }}
                fullWidth
              />
            </div>
            <div className={classes.inputContainer}>
              <Typography>Номер телефона:</Typography>
              <TextField
                value={managerPhoneNumber}
                variant={"outlined"}
                onChange={(e) => {
                  setManagerPhoneNumber(e.target.value);
                }}
                fullWidth
              />
            </div>
            <div className={classes.inputContainer}>
              <Typography>Должность:</Typography>
              <TextField
                value={managerPosition}
                variant={"outlined"}
                onChange={(e) => {
                  setManagerPosition(e.target.value);
                }}
                fullWidth
              />
            </div>
          </div>
        )}
        <Button variant={"contained"} color={"primary"} onClick={createUser}>
          Создать
        </Button>
      </Card>
    </div>
  );
};

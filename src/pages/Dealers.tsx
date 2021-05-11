import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { IDealer, IDealerRequestData } from "../entities/dealer.entity";
import { useDealer } from "../hooks/useDealer";
import { useHistory } from "react-router";
import {useUser} from "../hooks/useUser";

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
  createDealerButton: {
    margin: 15
  },
  card: {
    width: "60%",
    padding: 30,
    margin: 10,
  },
  dealersCard: {
    width: "60%",
    padding: 30,
    margin: 10,
    "&:hover": {
      cursor: "pointer",
    },
  },
  dealersList: {
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
  dealersListItem: {
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

export const Dealers = () => {
  const classes = useStyles();
  const dealersHook = useDealer();
  const usersHook = useUser()
  const history = useHistory();
  const [dealers, setDealers] = useState<IDealer[]>([]);
  const [searchDealers, setSearchDealers] = useState<IDealer[]>([]);
  const [dealerInput, setDealerInput] = useState("");
  const [searchDisplay, setSearchDisplay] = useState<"none" | "block">("none");
  const [editDisplay, setEditDisplay] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [personalDiscountInput, setPersonalDiscountInput] = useState("");

  useEffect(() => {
    dealersHook.getDealers().then((result) => setDealers(result));
  }, []);

  useEffect(() => {
    setDealers(searchDealers);
  }, [searchDealers]);

  const onDealerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDealerInput(e.target.value);
    dealersHook.getDealers().then((result) =>
      setSearchDealers(
        result.filter((dealer) => {
          return dealer.name
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

  const onDealerSearch = (id: string) => {
    setDealers(
      dealers.filter((dealer) => {
        return dealer.id === id;
      })
    );
  };

  const onEditDealerDisplay = (dealer: IDealer) => {
    setEditDisplay(!editDisplay);
    setAddressInput(dealer.address);
    setPhoneNumberInput(dealer.phone_number);
    setPersonalDiscountInput(dealer.personal_discount);
  };

  const onEditDealer = (dealer: IDealer) => {
    const { user, ...dealerRequestData } = dealer;
    dealersHook
      .createDealer({
        ...dealerRequestData,
        address: addressInput,
        phone_number: phoneNumberInput,
        personal_discount: personalDiscountInput,
        userId: user.id,
      })
      .then(() => {
        setAddressInput("");
        setPersonalDiscountInput("");
        setPhoneNumberInput("");
        setEditDisplay(false);
        dealersHook.getDealers().then((result) => setDealers(result));
      });
  };

  const onDeleteDealer = (dealer: IDealer) => {
    dealersHook.deleteDealer(dealer.id).then(() => {
      usersHook.deleteUser(dealer.user.id).then(() => {
        dealersHook.getDealers().then((result) => setDealers(result));
      })
    });
  };

  return (
    <div className={classes.mainContainer}>
      <TextField
        placeholder={"Поиск дилера"}
        className={classes.textField}
        variant={"outlined"}
        value={dealerInput}
        onChange={onDealerInputChange}
        onBlur={() => setSearchDisplay("none")}
      />
      <Button
          variant={"contained"}
          color={"primary"}
          className={classes.createDealerButton}
          onClick={() => {
            history.push("/create-user");
          }}
      >
        Создать дилера
      </Button>
      <ul style={{ display: searchDisplay }} className={classes.dealersList}>
        {searchDealers.map((item) => (
          <li
            key={item.id}
            className={classes.dealersListItem}
            onClick={() => onDealerSearch(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
      {dealers.map((dealer) => (
        <Card className={classes.card} key={dealer.id}>
          <CardHeader title={dealer.name} />
          <CardContent>
            <Typography>Юридический адресс: {dealer.address}</Typography>
            <Typography>Город: {dealer.town}</Typography>
            <Typography>Телефон: {dealer.phone_number}</Typography>
            <Typography>
              Персональная скидка: {dealer.personal_discount}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              aria-label={"Редактировать"}
              onClick={() => onEditDealerDisplay(dealer)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label={"Удалить"}
              onClick={() => {
                onDeleteDealer(dealer);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
          {editDisplay && (
            <div>
              <TextField
                label={"Юридический адресс"}
                variant={"outlined"}
                fullWidth
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
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
              <TextField
                label={"Персональная скидка"}
                variant={"outlined"}
                fullWidth
                value={personalDiscountInput}
                onChange={(e) => setPersonalDiscountInput(e.target.value)}
                className={classes.editTextField}
              />
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => onEditDealer(dealer)}
              >
                Редактировать
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

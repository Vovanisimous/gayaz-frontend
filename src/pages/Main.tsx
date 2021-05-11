import React, {useContext, useEffect, useState} from "react";
import { IOrder } from "../entities/order.entity";
import { useOrder } from "../hooks/useOrder";
import {
  Button,
  Card,
  CardHeader,
  Collapse,
  makeStyles,
} from "@material-ui/core";
import { ExpandCard } from "../components/ExpandCard";
import {useHistory} from "react-router";
import {AppContext} from "../app/App";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    marginTop: 64,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 345,
    padding: 30,
    margin: 10,
  },
  managersCard: {
    width: 345,
    padding: 30,
    margin: 10,
    "&:hover": {
      cursor: "pointer",
    },
  },
  managersListItem: {
    listStyleType: "none",
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
}));

export const Main = () => {
  const classes = useStyles();
  const history = useHistory()
  const context = useContext(AppContext)
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [orderExpanded, setOrderExpanded] = useState(false);
  const [managersExpanded, setManagersExpanded] = useState(false);
  const orderHook = useOrder();


  useEffect(() => {
    if (context.user?.role.id === "e688014e-ef4c-4df9-a2e6-8277200936e1") {
      orderHook.getOrders().then((result) => {
        const data = result.filter((item) => item.dealer.user?.role.id === context.user?.role.id)
        setOrders(data)
      })
      return
    } else if (context.user?.role.id === "e4493c81-51f5-4501-9bc8-32aaa4725d83") {
      orderHook.getOrders().then((result) => {
        const data = result.filter((item) => item.manager.user?.role.id === context.user?.role.id || item.order_status === "Новый")
        setOrders(data)
      })
    }else {
      orderHook.getOrders().then((result) => {
        setOrders(result);
      })
    }
  }, [context.user?.role.id]);

  const handleExpandClick = (parameter: string) => {
    switch (parameter) {
      case "orders":
        setOrderExpanded(!orderExpanded);
        break;
      case "managers":
        setManagersExpanded(!managersExpanded);
        break;
      default:
        console.log("Неправильно задан параметр фильтрации");
    }
  };

  const ordersSort = (parameter: string) => {
    console.log("ordersSort")
    switch (parameter) {
      case "done":
        orderHook
          .getOrders()
          .then((result) =>
            setOrders(result.filter((order) => order.order_status === "done"))
          );
        break;
      case "not_done":
        orderHook
          .getOrders()
          .then((result) =>
            setOrders(
              result.filter((order) => order.order_status === "not_done")
            )
          );
        break;
      case "all":
        orderHook.getOrders().then((result) => setOrders(result));
        break;
      default:
        console.log("Неправильно задан параметр фильтрации");
    }
  };

  const managersOrderSort = (manager: string) => {
    console.log("managersOrderSort")
    orderHook
      .getOrders()
      .then((result) =>
        setOrders(result.filter((order) => order.manager.name === manager))
      );
  };

  return (
    <div className={classes.mainContainer}>
      {context.user?.role.id === "e688014e-ef4c-4df9-a2e6-8277200936e1" &&
        (<Button
        className={classes.button}
        variant={"contained"}
        color={"primary"}
        onClick={() => history.push('create-order')}
        >
        Сделать заказ
        </Button>)
      }
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => ordersSort("done")}
        >
          Выполенные
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => ordersSort("not_done")}
        >
          Не выполненные
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => ordersSort("all")}
        >
          Все
        </Button>
      </div>
      <Card
        className={classes.managersCard}
        onClick={() => handleExpandClick("managers")}
      >
        <CardHeader title={"Сортировать по менеджеру"} />
        <Collapse in={managersExpanded} timeout={"auto"} unmountOnExit>
          <ul>
            {orders.map((order, index) => (
              <li
                className={classes.managersListItem}
                key={order.id}
                onClick={() => managersOrderSort(order.manager.name)}
              >
                {index + 1}. {order.manager.name}
              </li>
            ))}
          </ul>
        </Collapse>
      </Card>
      {orders.map((order) => (
        <ExpandCard {...order} />
      ))}
    </div>
  );
};

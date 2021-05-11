import React, { useState } from "react";
import { IReceipt } from "../entities/receipt.entity";
import {Button, Card, CardContent, CardHeader, makeStyles, TextField, Typography} from "@material-ui/core";
import { IOrder } from "../entities/order.entity";
import { useReceipt } from "../hooks/useReceipt";
import { useOrder } from "../hooks/useOrder";
import { useProduct } from "../hooks/useProduct";
import { IProduct } from "../entities/product.entity";
import { useManager } from "../hooks/useManager";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    marginTop: 64,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  datesContainer: {
    display: "flex",
    margin: 20
  },
  date: {
    marginLeft: 20,
  },
  card: {
    width: 500,
    padding: 30,
    margin: 10,
  },
  li: {
    marginTop: 10
  }
}));

export const Analysis = () => {
  const classes = useStyles();
  const receiptHook = useReceipt();
  const ordersHook = useOrder();
  const productsHook = useProduct();
  const managersHook = useManager();
  const [receipts, setReceipts] = useState<IReceipt[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [orderSum, setOrderSum] = useState(0);
  const [top10Products, setTop10Products] = useState<
    { name: string; amount: number }[]
  >([]);
  const [low10Products, setLow10Products] = useState<
    { name: string; amount: number }[]
  >([]);
  const [ordersByManager, setOrdersByManager] = useState<
    { manager: string; orders: number }[]
  >([]);
  const [ordersByStatus, setOrdersByStatus] = useState<
    { status: string; orders: number }[]
  >([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const onDateChange = (dateInput: Date, type: "start" | "end") => {
    switch (type) {
      case "end":
        setEndDate(dateInput);
        break;
      case "start":
        setStartDate(dateInput);
        break;
      default:
        console.log("Неправильный параметр :)");
    }
  };

  const onShowAnalysis = async () => {
    setReceipts([]);
    setLow10Products([]);
    setTop10Products([]);

    await receiptHook
      .getReceipts()
      .then((result) => {
        const data: IReceipt[] = result.filter(
          (item) =>
            new Date(item.createdAt).getTime() <= endDate.getTime() &&
            new Date(item.createdAt).getTime() >= startDate.getTime()
        );

        setReceipts(data);
      })
      .then(() => {
        const receiptsAmounts = receipts.map((item) => item.amount);

        const reducer = (prev: number, curr: number): number => {
          return prev + curr;
        };
        const sum = receiptsAmounts.reduce(reducer, 0);

        setOrderSum(sum);
      });

    //

    await productsHook.getProducts().then((result) => {
      const data: IProduct[] = result.filter(
        (item) =>
          new Date(item.createdAt).getTime() <= endDate.getTime() &&
          new Date(item.createdAt).getTime() >= startDate.getTime()
      );

      setProducts(data);
    });

    const productNameAndAmount: { name: string; amount: number }[] = [];

    products.forEach((prod) => {
      let amount = 0;
      prod.receipts.forEach((rec) => {
        amount += rec.amount;
      });
      productNameAndAmount.push({ name: prod.name, amount: amount });
    });

    const compareFunction = (
      a: { name: string; amount: number },
      b: { name: string; amount: number }
    ) => {
      if (a.amount < b.amount) {
        return -1;
      }
      if (a.amount < b.amount) {
        return 1;
      }
      return 0;
    };

    productNameAndAmount.sort(compareFunction);

    setTop10Products(
      productNameAndAmount.slice(productNameAndAmount.length - 10)
    );
    setLow10Products(productNameAndAmount.slice(0, 10));

    //

    await managersHook.getManagers().then((result) => {
      const data = result.map((item) => {
        return {
          manager: item.name,
          orders: item.orders.length,
        };
      });

      setOrdersByManager(data);
    });

    //

    await ordersHook.getOrders().then((result) => {
      const data = result.filter(
        (item) =>
          new Date(item.createdAt).getTime() <= endDate.getTime() &&
          new Date(item.createdAt).getTime() >= startDate.getTime()
      );
      setOrders(data);
    });

    let newOrder = 0;
    let onWorkOrder = 0;
    let formalized = 0;
    let inProduction = 0;
    let onSending = 0;
    let completed = 0;

    orders.forEach((item) => {
      switch (item.order_status) {
        case "Новый":
          newOrder++;
          break;
        case "Взят на работу":
          onWorkOrder++;
          break;
        case "Оформлен":
          formalized++;
          break;
        case "В Производстве":
          inProduction++;
          break;
        case "Отправка":
          onSending++;
          break;
        case "Завершен":
          completed++;
          break;
        default:
          console.log("Такого статуса нет: ", item.order_status);
      }
    });

    setOrdersByStatus([
      {
        status: "Новый",
        orders: newOrder,
      },
      {
        status: "Взят на работу",
        orders: onWorkOrder,
      },
      {
        status: "Оформлен",
        orders: formalized,
      },
      {
        status: "В Производстве",
        orders: inProduction,
      },
      {
        status: "Отправка",
        orders: onSending,
      },
      {
        status: "Завершен",
        orders: completed,
      },
    ]);

    //
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.datesContainer}>
        <div>
          <Typography>Начальная дата</Typography>
          <TextField
              type={"date"}
              defaultValue={startDate}
              onChange={(e) => onDateChange(new Date(e.target.value), "start")}
          />
        </div>
        <div className={classes.date}>
          <Typography>Конечная дата</Typography>
          <TextField
              type={"date"}
              defaultValue={endDate}
              onChange={(e) => onDateChange(new Date(e.target.value), "end")}
          />
        </div>
      </div>
      <Button variant="contained" color="primary" onClick={onShowAnalysis}>
        Показать
      </Button>
      <Card className={classes.card}>
        <CardHeader title={`Общая сумма всех заказов за выбранный промежуток времени: ${orderSum}`}/>
      </Card>
      <Card className={classes.card}>
        <CardHeader title={'Топ Топ 10 - самых заказываемых товаров по количеству'}/>
        <CardContent>
          <ol>
            {top10Products
                .map((top) => (
                    <li>
                      {top.name}: {top.amount}
                    </li>
                ))
                .reverse()}
          </ol>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardHeader title={'Топ 10 - самых непопулярных товаров по количеству'}/>
        <CardContent>
          <ol>
            {low10Products.map((low) => (
                <li>
                  {low.name}: {low.amount}
                </li>
            ))}
          </ol>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardHeader title={"Общее количество заказов по каждому менеджеру"}></CardHeader>
        <CardContent>
          {ordersByManager.map((item) => (
              <Typography>
                {item.manager}: {item.orders}
              </Typography>
          ))}
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardHeader title={"Количество заказов с различными статусами за выбранный промежуток времени"}></CardHeader>
        <CardContent>
          {ordersByStatus.map((item) => (
              <Typography>
                {item.status}: {item.orders}
              </Typography>
          ))}
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardHeader title={"Список всех заказов за выбранный промежуток времени"}></CardHeader>
        <CardContent>
          <ul>
            {orders.map((item) => (
                <li className={classes.li}>
                  <ul>
                    <li>Контракт: {item.contract.contract_link}</li>
                    <li>Статус: {item.order_status}</li>
                    <li>Менеджер: {item.manager.name}</li>
                    <li>Дилер: {item.dealer.name}</li>
                  </ul>
                </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

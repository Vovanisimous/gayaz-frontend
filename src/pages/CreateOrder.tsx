import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Input,
  InputAdornment,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { useOrder } from "../hooks/useOrder";
import { useProduct } from "../hooks/useProduct";
import { useDealer } from "../hooks/useDealer";
import { useManager } from "../hooks/useManager";
import { AppContext } from "../app/App";
import { useContract } from "../hooks/useContract";
import { IProduct } from "../entities/product.entity";
import { useReceipt } from "../hooks/useReceipt";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    marginTop: 64,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  tableContainer: {
    width: 300,
  },
  button: {
    marginTop: 20,
  },
}));

export const CreateOrder = () => {
  const classes = useStyles();
  const orderHook = useOrder();
  const productHook = useProduct();
  const dealerHook = useDealer();
  const receiptHook = useReceipt();
  const contractHook = useContract();
  const context = useContext(AppContext);
  const history = useHistory();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orderValues, setOrderValues] = useState<
    { productId: string; amount: number }[]
  >([]);
  const [contractLink, setContractLink] = useState("");

  useEffect(() => {
    productHook.getProducts().then((result) => {
      setProducts(result);
    });
  }, []);

  useEffect(() => {
    console.log(orderValues);
  }, [orderValues]);

  const onChangeRow = (value: string, productId: string) => {
    // const index = orderValues.findIndex((item) => item.id === productId);
    // if (index < 0) {
    //   setOrderValues((prev) =>
    //     prev.concat({ amount: Number(value), id: productId })
    //   );
    // } else {
    //   setOrderValues((prev) =>
    //     prev.map((item) =>
    //       item.id === productId
    //         ? {
    //             ...item,
    //             amount: Number(value),
    //           }
    //         : { ...item }
    //     )
    //   );
    // }
    const amount = parseInt(value);
    const data = { productId: productId, amount: amount };

    const isCheckId = orderValues.find((orderValue) => orderValue.productId === data.productId)

    if (isCheckId) {
      setOrderValues((prev) => prev.map((item) => {
        if (item.productId === data.productId) {
          item.amount = data.amount;
          return item;
        }
        return item
      }))
      return;
    }
    const joined = orderValues.concat(data);

    setOrderValues(joined);
  };

  const onMakeOrder = async () => {
    const dealerId = await dealerHook.getDealers().then((dealersResult) => {
      const myDealer = dealersResult.filter((dealer) => {
        if (context.user) {
          return (dealer.user.id === context.user.id);
        } else {
          throw new Error("Not authenticated as dealer");
        }
      });
      return myDealer[0].id;
    });

    let managerId = "45fd9094-f46b-453b-95d4-6aa35ff66776";

    if (context.user?.role.name === "manager") managerId = context.user.id;

    const contractId = await contractHook
      .createContract({ contract_link: contractLink })
      .then((result) => result.id);

    const receipts = await receiptHook.createReceipt(orderValues)

    const orderRequestData = {
      dealerId: dealerId,
      managerId: managerId,
      contractId: contractId,
      receipts: receipts,
    };

    orderHook.createOrder(orderRequestData).then(() => {
      history.push("/main");
    });
  };

  return (
    <div className={classes.mainContainer}>
      <Typography>Введите ссылку на договор:</Typography>
      <TextField
        value={contractLink}
        variant={"outlined"}
        onChange={(e) => setContractLink(e.target.value)}
      />
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Продукт</TableCell>
              <TableCell>Количество</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell component={"th"} scope={"row"}>
                  {product.name}
                </TableCell>
                <TableCell component={"th"} scope={"row"}>
                  <Input
                    style={{ width: 100 }}
                    endAdornment={
                      <InputAdornment position="end">Штук</InputAdornment>
                    }
                    defaultValue={0}
                    type={"number"}
                    onChange={(e) => onChangeRow(e.target.value, product.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        className={classes.button}
        variant={"contained"}
        color={"primary"}
        onClick={onMakeOrder}
      >
        Сделать заказ
      </Button>
      <Button
          className={classes.button}
          variant={"contained"}
          color={"primary"}
          onClick={() => history.push('products')}
      >
        Список продуктов
      </Button>
    </div>
  );
};

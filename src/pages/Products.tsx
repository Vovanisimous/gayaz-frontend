import React, {useEffect, useState} from 'react'
import {
    Button,
    Card,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import {IProduct} from "../entities/product.entity";
import {useProduct} from "../hooks/useProduct";
import {useHistory} from "react-router";

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

export const Products = () => {
    const classes = useStyles();
    const productHook = useProduct();
    const history = useHistory()
    const [products, setProducts] = useState<IProduct[]>([])

    useEffect(() => {
        productHook.getProducts().then((result) => setProducts(result))
    }, [])

    return (
        <div className={classes.mainContainer}>
            <Button
                className={classes.button}
                variant={"contained"}
                color={"primary"}
                onClick={() => history.goBack()}
            >
                Назад
            </Button>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Цена за кг.</TableCell>
                            <TableCell>Вес-фасовка</TableCell>
                            <TableCell>Цена за фасовку</TableCell>
                            <TableCell>Тара</TableCell>
                            <TableCell>Количество в упаковке</TableCell>
                            <TableCell>Группа товаров</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell component={'th'} scope={'row'}>
                                    {product.name}
                                </TableCell>
                                <TableCell component={'th'} scope={'row'}>
                                    {product.cost_per_kg}
                                </TableCell>
                                <TableCell component={'th'} scope={'row'}>
                                    {product.packing_weight}
                                </TableCell>
                                <TableCell component={'th'} scope={'row'}>
                                    {product.packing_price}
                                </TableCell>
                                <TableCell component={'th'} scope={'row'}>
                                    {product.container}
                                </TableCell>
                                <TableCell component={'th'} scope={'row'}>
                                    {product.amount_in_package}
                                </TableCell>
                                <TableCell component={'th'} scope={'row'}>
                                    {product.product_group}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
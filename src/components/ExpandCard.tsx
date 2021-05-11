import React, {useState} from "react";
import {Card, CardActions, CardHeader, Collapse, IconButton, makeStyles, Typography} from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {IOrder} from "../entities/order.entity";

const useStyles = makeStyles((theme) => ({
    card: {
        width: 345,
        padding: 30,
        margin: 10,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
}))

export const ExpandCard = (order: IOrder) => {
    const classes = useStyles();
    const [orderExpanded, setOrderExpanded] = useState(false)

    const handleExpandClick = () => {
        setOrderExpanded(!orderExpanded);
    }

    return (
        <Card className={classes.card} key={order.id}>
            <CardHeader title={order.contract.contract_link} subheader={order.order_status}/>
            <CardActions disableSpacing>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: orderExpanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={orderExpanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </IconButton>
            </CardActions>
            <Collapse in={orderExpanded} timeout={"auto"} unmountOnExit>
                <Typography>Имя дилера: {order.dealer.name}</Typography>
                <Typography>Имя менеджера: {order.manager.name}</Typography>
                <Typography>Должность менеджера: {order.manager.position}</Typography>
                <Typography>Дата заказа: {order.order_date}</Typography>
                <ol>
                    {order.receipts.map((receipt) => (
                        <li key={receipt.id}>{receipt.product.name}</li>
                    ))}
                </ol>
            </Collapse>
        </Card>
    )
};


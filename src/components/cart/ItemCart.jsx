import { Row, Col, Button, Image } from "react-bootstrap";
import ItemSizesList from "../sizes/ItemSizesList";
import Swal from 'sweetalert2'
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { deleteItemCart, deleteSizeItemCart } from '../../redux/cart/cartSlice';

const ItemCart = ({ data }) => {
    const dispatch = useDispatch();
    const unitInitialPrice = data.price;
    const unitFinalPrice = data.onSale ? unitInitialPrice * data.discPerc : unitInitialPrice;
    const quantity = data.selectStock.reduce((acumulador, elem) => acumulador + elem.quantity, 0);
    const initialPrice = data.price * quantity;
    const finalPrice = data.onSale ? initialPrice * data.discPerc : initialPrice;

    const onDeleteSize = (sizeStock) => {
        dispatch(deleteSizeItemCart({ id: data.id, size: sizeStock }));
    }

    const onDelete = (id) => {
        Swal.fire({
            title: "Seguro desea borrar la camiseta del carrito?",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteItemCart(id));
            }
        });
    };

    return (
        <motion.div
            className="itemCartWrapper mb-4 border rounded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.35)"
            }}
        >
            <Row className="d-flex align-items-start mx-0 p-2 itemCart">
                <Col xs={4} className="p-0 d-flex align-items-center justify-content-center">
                    <Image src={data.img} alt={data.name} rounded className="itemCartImg" />
                </Col>

                <Col xs={5} className="d-flex flex-column align-items-center justify-content-center">
                    <span className="nameShirtItemCart text-center">{data.name}</span>
                    <ItemSizesList
                        data={data.selectStock}
                        handleDelete={onDeleteSize}
                        typeFlex="flex-column"
                    />
                </Col>

                <Col xs={3} className="d-flex justify-content-center align-items-center flex-column">

                    {data.onSale && (
                        <span className="text-decoration-line-through text-muted p-0 m-0 small">
                            ${unitInitialPrice}
                        </span>
                    )}
                    <span className="p-0 m-0 mb-1 text-muted small">
                        ${unitFinalPrice}
                    </span>

                    {data.onSale && (
                        <span className="text-decoration-line-through m-0 priceTextItemCart">
                            ${initialPrice}
                        </span>
                    )}
                    <span className={data.onSale ? "text-danger p-0 m-0 priceTextItemCart" : "p-0 m-0 priceTextItemCart"}>
                        ${finalPrice}
                    </span>

                    <Button className="mt-2 btn-delete" size="xm" onClick={() => onDelete(data.id)}>
                        Eliminar
                    </Button>
                </Col>
            </Row>
        </motion.div>
    );
};

export default ItemCart;

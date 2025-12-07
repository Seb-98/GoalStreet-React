import { Container } from "react-bootstrap";
import ItemCartList from "./ItemCartList";
import SectionButtonsCart from "./SectionButtonsCart";
import EmptyCart from "./EmptyCart";
import { useDispatch, useSelector } from 'react-redux'
import { selectCartItems, selectTotalCart } from "../../redux/cart/cartSelectors";
import { deleteCart } from '../../redux/cart/cartSlice';

const CartContainer = () => {
    const dispatch = useDispatch();
    const cart = useSelector(selectCartItems);
    const totalCart = useSelector(selectTotalCart)

    if (cart.length === 0) {
        return <EmptyCart />;
    }

    return (
        <Container>
            <div className="d-flex justify-content-center bg-dark text-white mb-3 mx-auto rounded p-1" style={{ width: '200px' }}>
                <h4 className="mb-0">Total ${totalCart}</h4>
            </div>
            <ItemCartList dataCartList={cart} />
            <SectionButtonsCart handleDeleteCart={() => dispatch(deleteCart())} />
        </Container>
    );
}

export default CartContainer;
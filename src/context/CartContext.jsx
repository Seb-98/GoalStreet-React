//archivo en desuso pero lo dejo de ejemplo
import { createContext, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addItemCart = (item, selectStock) => {

        if (validateItemExist(item.id)) {
            const actualizedCart = cart.map((elem) =>
                elem.id === item.id ? { ...elem, selectStock: selectStock } : elem
            )

            setCart(actualizedCart)
        } else {
            setCart([...cart, { ...item, selectStock: selectStock }])
        }
    }

    const clearCart = () => {
        setCart([]);
    }

    const deleteItemCart = (id) => {
        setCart(cart.filter((elem) => elem.id !== id))
    }

    const deleteSizeItemCart = (id, size) => {
        const updateCart = cart.map((elem) =>
            //si es el mismo id, devuelve el obj y la propiedad selectStock con filtro de talle
            elem.id === id ? { ...elem, selectStock: elem.selectStock.filter((elem) => elem.size !== size) } : elem
        )

        let count = 0;
        updateCart.map((elem) => {
            if (elem.id === id) {
                count = elem.selectStock.reduce((acumulador, item) => acumulador + item.quantity, 0)
            }
        })

        if (count == 0) {         //si el selectStock queda vacio, borra el item del carrito
            deleteItemCart(id);
        } else {                  //sino actualiza el selectStock del carrito
            setCart(updateCart)
        }
    }

    const validateItemExist = (id) => {
        return cart.some((elem) => elem.id === id);
    }

    const totalCart = () => {
        let sumaTotal = 0;

        cart.map((elem) => {
            let quantity = 0;
            quantity = elem.selectStock.reduce((acumulador, item) => acumulador + item.quantity, 0)
            sumaTotal += elem.onSale ? (elem.price * quantity) * elem.discPerc : elem.price * quantity;
        })

        return sumaTotal;
    }

    //funcion para insertar data resumida del cart,tiene el id, el precio del stock y el stock
    const resumeCart = () => {
        const resumeCart = cart.map((elem) => {
            const unitPrice = elem.onSale ? elem.price * elem.discPerc : elem.price
            return { id: elem.id, articles: { unitPrice: unitPrice, stock: elem.selectStock } }
        })

        return resumeCart;
    }

    const itemCartStock = (id) => {
        const findItem = cart.find((elem) => elem.id === id)
        return findItem ? findItem.selectStock : [];
    }

    const cartCount = () => {
        let cantItem = 0;

        cart.map(elem => {
            elem.selectStock.map(item => cantItem += item.quantity)
        })

        return cantItem;
    }

    const cartSummary = () => {
        let total = totalCart();
        let shippingPrice = Math.round(total * 0.15);
        let taxesPrice = Math.round(total * 0.10);
        let totalPay = total + shippingPrice + taxesPrice;

        const cartDetails = {
            shippingPrice: shippingPrice,
            taxesPrice: taxesPrice,
            total: total,
            totalPay: totalPay
        }

        return cartDetails;
    }

    return (
        <CartContext.Provider value={{ cart, addItemCart, clearCart, deleteItemCart, deleteSizeItemCart, totalCart: totalCart(), resumeCart, itemCartStock, cartCount:cartCount(), cartSummary: cartSummary() }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;

import { createSelector } from '@reduxjs/toolkit';

export const selectCartItems = state => state.cart.items;

export const selectItemStock = createSelector(
    [selectCartItems, (_, id) => id],
    (cart, id) => {
        const item = cart.find(i => i.id === id);
        return item ? item.selectStock : [];
    }
);

export const selectCartCount = createSelector(
    [selectCartItems],
    cart => cart.flatMap(i => i.selectStock).reduce((acc, s) => acc + s.quantity, 0)
);

export const selectTotalCart = createSelector(
    [selectCartItems],
    (items) =>
        items.reduce((total, elem) => {
            const quantity = elem.selectStock.reduce((acc, s) => acc + s.quantity, 0);
            const price = elem.onSale ? elem.price * elem.discPerc : elem.price;
            return total + price * quantity;
        }, 0)
);

export const selectResumeCart = createSelector(
    [selectCartItems],
    (items) =>
        items.map((elem) => {
            const unitPrice = elem.onSale
                ? elem.price * elem.discPerc
                : elem.price;

            return {
                id: elem.id,
                articles: {
                    unitPrice,
                    stock: elem.selectStock
                }
            };
        })
);

export const selectCartSummary = createSelector(
    [selectTotalCart],
    (total) => {
        const shippingPrice = Math.round(total * 0.15);
        const taxesPrice = Math.round(total * 0.10);
        const totalPay = total + shippingPrice + taxesPrice;

        return {
            shippingPrice,
            taxesPrice,
            total,
            totalPay
        };
    }
);
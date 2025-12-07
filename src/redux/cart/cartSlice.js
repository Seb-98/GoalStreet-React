import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemCart: (state, action) => {

            const { item, selectStock } = action.payload;

            const existingItem = state.items.find((elem) => elem.id === item.id);

            if (existingItem) {
                existingItem.selectStock = selectStock;
            } else {
                state.items.push({ ...item, selectStock });
            }
        },
        deleteItemCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(elem => elem.id !== id);
        },
        deleteCart: (state) => {
            state.items = [];
        },
        deleteSizeItemCart: (state, action) => {
            const { id, size } = action.payload;
            const item = state.items.find(i => i.id === id);
            if (!item) return;

            item.selectStock = item.selectStock.filter(s => s.size !== size);

            if (item.selectStock.length === 0) {
                state.items = state.items.filter(i => i.id !== id);
            }
        },
    }
});

export const {
    addItemCart,
    deleteItemCart,
    deleteCart,
    deleteSizeItemCart
} = cartSlice.actions;

export default cartSlice.reducer;

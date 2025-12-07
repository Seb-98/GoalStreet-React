import { render, screen } from '@testing-library/react'
import CartContainer from './CartContainer'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../../redux/cart/cartSlice'

// --- Mock data ---
const mockData = [
    {
        id: "8VjMXYfZ9Y9nBUc3qWmx",
        discPerc: 0.9,
        price: 125000,
        category: "Selecciones",
        stock: [
            { quantity: 7, size: "S" },
            { quantity: 18, size: "M" },
            { quantity: 13, size: "XL" }
        ],
        season: "1994",
        onSale: true,
        img: "/images/argentina-suplente-1994.webp",
        name: "Argentina '94",
        selectStock: [
            { size: "S", quantity: 2 },
            { size: "M", quantity: 2 }
        ]
    },
    {
        id: "BlF81wrMZ0s265vW3khv",
        price: 120000,
        discPerc: 0,
        onSale: false,
        name: "Producto 2",
        season: "24/25",
        img: "/images/san-lorenzo-2025.webp",
        category: "Local",
        stock: [
            { quantity: 14, size: "S" },
            { quantity: 13, size: "M" },
            { quantity: 17, size: "X" },
            { quantity: 11, size: "XL" }
        ],
        selectStock: [
            { size: "X", quantity: 2 },
            { size: "S", quantity: 1 }
        ]
    }
]

// --- Helper para render con Redux ---
const renderWithStore = (preloadedState) => {
    const store = configureStore({
        reducer: { cart: cartReducer },
        preloadedState
    });

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <CartContainer />
            </MemoryRouter>
        </Provider>
    );
};

describe('CartContainer Component', () => {

    test('render cart container with items', () => {
        renderWithStore({
            cart: { items: mockData }
        });

        // TotalCart NO viene hardcodeado, se calcula según tu selector
        expect(screen.getByText(/Total \$/i)).toBeInTheDocument();
    });

    test('render empty cart', () => {
        renderWithStore({
            cart: { items: [] }
        });

        expect(screen.getByText(/No hay productos en el carrito/i)).toBeInTheDocument();
    });

});

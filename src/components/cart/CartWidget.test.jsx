import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import CartWidget from "./CartWidget";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../redux/cart/cartSlice";

const renderWithStore = (preloadedState) => {
    const store = configureStore({
        reducer: { cart: cartReducer },
        preloadedState
    });

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <CartWidget />
            </MemoryRouter>
        </Provider>
    );
};

describe("CartWidget Component", () => {
    test("renders cart icon, count and link", () => {
        const mockState = {
            cart: {
                items: [
                    {
                        id: "1",
                        selectStock: [
                            { quantity: 2, size: "M" },
                            { quantity: 3, size: "L" }
                        ]
                    }
                ]
            }
        };

        renderWithStore(mockState);

        expect(screen.getByTestId("cart-icon")).toBeInTheDocument();

        expect(screen.getByText("5")).toBeInTheDocument();

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/cart");
    });
});

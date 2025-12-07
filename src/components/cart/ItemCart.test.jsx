import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ItemCart from './ItemCart'
import Swal from 'sweetalert2'
import { deleteItemCart, deleteSizeItemCart } from '../../redux/cart/cartSlice'

// Mock SweetAlert2
vi.mock('sweetalert2', () => ({
    default: {
        fire: vi.fn()
    }
}))

// Mock acciones Redux
vi.mock('../../redux/cart/cartSlice', () => ({
    deleteItemCart: vi.fn((id) => ({ type: 'deleteItemCart', payload: id })),
    deleteSizeItemCart: vi.fn((data) => ({ type: 'deleteSizeItemCart', payload: data }))
}))

// Mock ItemSizesList (evita renders complejos)
vi.mock('../sizes/ItemSizesList', () => ({
    default: ({ data }) => <div data-testid="sizes-list">{data.length} sizes</div>
}))

// Mock dispatch()
const mockDispatch = vi.fn()
vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}))

const mockData = {
    id: '8VjMXYfZ9Y9nBUc3qWmx',
    name: "Argentina '94",
    img: "/images/argentina-suplente-1994.webp",
    price: 100,
    discPerc: 0.8,
    onSale: true,
    selectStock: [
        { size: 'S', quantity: 2 },
        { size: 'M', quantity: 3 },
    ]
}

// 🔹 Función auxiliar para validar cálculos
const calculateItemCart = (data) => {
    const unitInitialPrice = data.price
    const unitFinalPrice = data.onSale ? unitInitialPrice * data.discPerc : unitInitialPrice
    const quantity = data.selectStock.reduce((acc, elem) => acc + elem.quantity, 0)
    const initialPrice = data.price * quantity
    const finalPrice = data.onSale ? initialPrice * data.discPerc : initialPrice
    return { unitInitialPrice, unitFinalPrice, quantity, initialPrice, finalPrice }
}

describe('ItemCart cálculos', () => {
    test('calcula correctamente producto onSale', () => {
        const res = calculateItemCart(mockData)
        expect(res.quantity).toBe(5)
        expect(res.unitFinalPrice).toBe(80)
        expect(res.initialPrice).toBe(500)
        expect(res.finalPrice).toBe(400)
    })

    test('calcula correctamente producto sin descuento', () => {
        const data = { ...mockData, onSale: false }
        const res = calculateItemCart(data)

        expect(res.unitFinalPrice).toBe(100)
        expect(res.finalPrice).toBe(500)
    })
})

describe('ItemCart Componente', () => {

    beforeEach(() => {
        mockDispatch.mockClear()
        Swal.fire.mockClear()
    })

    test('confirma eliminación y llama deleteItemCart', async () => {
        Swal.fire.mockResolvedValueOnce({ isConfirmed: true })

        render(<ItemCart data={mockData} />)

        const btn = screen.getByRole('button', { name: /eliminar/i })
        fireEvent.click(btn)

        expect(Swal.fire).toHaveBeenCalled()

        await waitFor(() => {
            expect(deleteItemCart).toHaveBeenCalledWith('8VjMXYfZ9Y9nBUc3qWmx')
            expect(mockDispatch).toHaveBeenCalledWith({
                type: "deleteItemCart",
                payload: '8VjMXYfZ9Y9nBUc3qWmx'
            })
        })
    })
})

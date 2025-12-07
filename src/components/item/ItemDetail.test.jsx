import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ItemDetail from './ItemDetail'
import Swal from 'sweetalert2'
import { MemoryRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItemCart, deleteItemCart } from '../../redux/cart/cartSlice'
import { selectItemStock } from '../../redux/cart/cartSelectors'

// Mock Swal
vi.mock('sweetalert2', () => ({
    default: { fire: vi.fn() }
}))

// Mock Redux actions
vi.mock('../../redux/cart/cartSlice', () => ({
    addItemCart: vi.fn((payload) => ({ type: 'addItemCart', payload })),
    deleteItemCart: vi.fn((id) => ({ type: 'deleteItemCart', payload: id })),
}))

// Mock useDispatch
const mockDispatch = vi.fn()
vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: vi.fn()
}))

// Mock SizesList: simula seleccionar talle M
vi.mock('../sizes/SizesList', () => ({
    default: ({ select }) => <button onClick={() => select('M')}>Select Size</button>
}))

// Mock ItemSizesList
vi.mock('../sizes/ItemSizesList', () => ({
    default: () => <div>ItemSizesList</div>
}))

// Mock ItemCount: simula sumar cantidad 2
vi.mock('./ItemCount', () => ({
    default: ({ onAdd }) => <button onClick={() => onAdd(2)}>Add</button>
}))

// Mock selector: devuelve stock vacío siempre
vi.mock('../../redux/cart/cartSelectors', () => ({
    selectItemStock: vi.fn()
}))

const mockDataWithStock = {
    id: '1',
    name: 'Camiseta 1',
    price: 100,
    discPerc: 0.9,
    onSale: true,
    stock: [
        { size: 'S', quantity: 2 },
        { size: 'M', quantity: 3 }
    ],
    season: '2025',
    category: 'Selecciones',
    img: '/img.jpg'
}

const mockDataNoStock = {
    id: '2',
    name: 'Camiseta 2',
    price: 80,
    discPerc: 1,
    onSale: false,
    stock: [],
    season: '2025',
    category: 'Selecciones',
    img: '/img2.jpg'
}

describe('ItemDetail Component — Redux Version', () => {

    beforeEach(() => {
        mockDispatch.mockClear()
        Swal.fire.mockClear()
        useSelector.mockImplementation((selectorFn) => selectorFn)
        selectItemStock.mockReturnValue([]) /// stock vacío en el carrito
    })

    const renderComponent = (data) =>
        render(
            <MemoryRouter>
                <ItemDetail dataDetail={data} />
            </MemoryRouter>
        )

    test('renders correctly with discount', async () => {
        renderComponent(mockDataWithStock)

        // precio inicial tachado
        expect(screen.getByText('$100')).toBeInTheDocument()

        const finalPrice = mockDataWithStock.price * mockDataWithStock.discPerc
        expect(screen.getByText(`$${finalPrice}`)).toBeInTheDocument()

        fireEvent.click(screen.getByText('Select Size'))  // selecciona M
        fireEvent.click(screen.getByText('Add'))          // agrega 2 unidades
        fireEvent.click(screen.getByText('Confirmar'))    // confirma

        await waitFor(() => {
            expect(addItemCart).toHaveBeenCalledWith({
                item: mockDataWithStock,
                selectStock: [{ size: "M", quantity: 2 }]
            })

            expect(mockDispatch).toHaveBeenCalledWith({
                type: "addItemCart",
                payload: {
                    item: mockDataWithStock,
                    selectStock: [{ size: 'M', quantity: 2 }]
                }
            })

            expect(Swal.fire).toHaveBeenCalledWith({
                title: "Camiseta agregada!",
                icon: "success",
                draggable: true
            })
        })
    })

    test('renders no stock message', () => {
        renderComponent(mockDataNoStock)

        expect(screen.getByText('No hay stock para esta camiseta')).toBeInTheDocument()
    })

    test('price without discount', () => {
        renderComponent(mockDataNoStock)
        expect(screen.getByText('$80')).toBeInTheDocument()
    })

    test('Confirmar disabled when no selection', () => {
        renderComponent(mockDataWithStock)

        expect(screen.getByText('Confirmar')).toBeDisabled()
    })

    test('delete item with confirmation', async () => {
        Swal.fire.mockResolvedValueOnce({ isConfirmed: true })

        renderComponent(mockDataWithStock)

        fireEvent.click(screen.getByText('Select Size'))
        fireEvent.click(screen.getByText('Add'))
        fireEvent.click(screen.getByText('Eliminar'))

        await waitFor(() => {
            expect(deleteItemCart).toHaveBeenCalledWith("1")
            expect(mockDispatch).toHaveBeenCalledWith({
                type: "deleteItemCart",
                payload: "1"
            })
        })
    })
})

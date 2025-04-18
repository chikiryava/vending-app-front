import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from "../components/CartItem.tsx";

const CartPage: React.FC = () => {
    const { cartItems, updateItemQuantity, removeItem } = useCart();
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.drink.price * item.quantity,
        0
    );

    const handlePayment = () => {
        navigate('/payment');
    };

    if (cartItems.length === 0) {
        return (
            <div className="p-8">
                <p className="mb-4">
                    У вас нет ни одного товара, вернитесь на страницу каталога.
                </p>
                <Link to="/" className="bg-gray-300 rounded px-4 py-2 text-black">
                    Вернуться в каталог
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Оформление заказа</h2>
            <table className="w-full border-collapse">
                <thead>
                <tr className="border-b">
                    <th className="p-2 text-left">Товар</th>
                    <th className="p-2 text-center" style={{ width: "160px" }}>
                        Количество
                    </th>
                    <th className="p-2 text-right" style={{ width: "100px" }}>
                        Цена
                    </th>
                    <th className="p-2"></th>
                </tr>
                </thead>
                <tbody>
                {cartItems.map((item) => (
                    <CartItem
                        key={item.id}
                        item={item}
                        updateItemQuantity={updateItemQuantity}
                        removeItem={removeItem}
                    />
                ))}
                </tbody>
            </table>
            <div className="text-xl font-semibold text-end mt-6">
                Итоговая сумма: {totalPrice.toFixed(2)} руб.
            </div>
            <div className="flex justify-between items-center mt-6">
                <Link to="/" className="bg-yellow-500 rounded px-16 py-2 text-black">
                    Вернуться
                </Link>
                <button
                    onClick={handlePayment}
                    className="bg-green-500 text-white rounded px-16 py-2 font-semibold"
                >
                    Оплата
                </button>
            </div>
        </div>
    );
};

export default CartPage;

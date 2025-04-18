import React from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

interface CartItemProps {
    item: {
        id: number;
        quantity: number;
        drink: {
            name: string;
            imageUrl: string;
            price: number;
            stock: number;
        };
    };
    updateItemQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateItemQuantity, removeItem }) => {
    return (
        <tr className="border-b">
            <td className="p-2 flex items-center space-x-2">
                <img
                    src={item.drink.imageUrl}
                    alt={item.drink.name}
                    className="w-32 h-32 object-contain"
                />
                <span>{item.drink.name}</span>
            </td>
            <td className="p-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={() => {
                            if (item.quantity > 1) {
                                updateItemQuantity(item.id, item.quantity - 1);
                            }
                        }}
                        className="bg-gray-950 text-white p-1 rounded hover:bg-gray-800"
                    >
                        <FaMinus size={12} />
                    </button>
                    <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        max={item.drink.stock}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 1 && val <= item.drink.stock) {
                                updateItemQuantity(item.id, val);
                            }
                        }}
                        className="border w-12 text-center"
                    />
                    <button
                        onClick={() => {
                            if (item.quantity < item.drink.stock) {
                                updateItemQuantity(item.id, item.quantity + 1);
                            }
                        }}
                        className="bg-gray-950 text-white p-1 rounded hover:bg-gray-800"
                    >
                        <FaPlus size={12} />
                    </button>
                </div>
            </td>
            <td className="p-2 text-right">
                {(item.drink.price * item.quantity)} руб.
            </td>
            <td className="p-2 text-center">
                <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 rounded"
                >
                    <FaTrash size={20} />
                </button>
            </td>
        </tr>
    );
};

export default CartItem;

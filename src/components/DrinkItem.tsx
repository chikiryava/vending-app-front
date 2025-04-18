import {useEffect, useState} from 'react';
import { useCart } from '../context/CartContext';

interface DrinkItemProps {
    id: number;
    imageUrl: string;
    name: string;
    price: number;
    quantity: number;
    selected: boolean;
}

const DrinkItem = ({ id, imageUrl, name, price, quantity, selected: initialSelected }: DrinkItemProps) => {
    const { addItem, removeItem } = useCart();
    const [isSelected, setIsSelected] = useState<boolean>(initialSelected);
    const [currentStock, setCurrentStock] = useState<number>(quantity);

    // Обновляем локальное состояние, если props.selected меняется (например, при фильтрации)
    useEffect(() => {
        setIsSelected(initialSelected);
    }, [initialSelected]);

    const handleToggle = () => {
        if (!isSelected && currentStock === 0) return;

        if (isSelected) {
            setIsSelected(false);
            removeItem(id);
        } else {
            if (currentStock > 0) {
                setIsSelected(true);
                addItem({
                    id,
                    name,
                    price,
                    imageUrl,
                    brand: '',
                    stock: currentStock
                });
            }
        }
    };

    return (
        <div className="border p-4 mb-4 flex flex-col items-center text-center">
            <div className="w-36 h-36 flex items-center justify-center overflow-hidden mb-2">
                <img src={imageUrl} alt={name} className="object-contain w-full h-full" />
            </div>
            <h2 className="text-lg font-semibold mb-2">{name}</h2>
            <p className="text-gray-700 mb-2 font-bold">{price} руб.</p>
            <button
                onClick={handleToggle}
                disabled={!isSelected && currentStock === 0}
                className={`rounded py-2 px-8 text-white font-bold ${
                    !isSelected && currentStock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : isSelected
                            ? "bg-green-600"
                            : " text-gray-950 bg-yellow-500 hover:bg-yellow-600"
                }`}
            >
                { !isSelected && currentStock === 0 ? "Закончился" : isSelected ? "Выбрано" : "Выбрать" }
            </button>
        </div>
    );
};

export default DrinkItem;

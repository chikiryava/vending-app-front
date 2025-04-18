import { useEffect, useState } from 'react';
import axios from 'axios';
import DrinkItem from "../components/DrinkItem";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ImportDrinksButton from "../components/ImportDrinksButton.tsx";
import {useMachineLock} from "../hooks/useVendingMachineLock.tsx";

interface DrinkItems {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    brand: Brand;
    brandId: number;
    quantity: number;
}

interface Brand {
    id: number;
    name: string;
}

function CatalogPage() {
    const [drinks, setDrinks] = useState<DrinkItems[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [refresh, setRefresh] = useState(false);

    const { cartItems } = useCart();
    const navigate = useNavigate();

    const { isBusy } = useMachineLock();

    const fetchDrinks = async () => {
        axios.get("https://localhost:7153/api/Drinks")
            .then(response => {
                const data = response.data;
                setDrinks(data);
                console.log(response.data);

                const prices = data.map((d: DrinkItems) => d.price);
                setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
                setCurrentPrice(Math.max(...prices));
            })
            .catch(error => console.error("Ошибка при получении напитков:", error));

        axios.get("https://localhost:7153/api/Brands")
            .then(response => setBrands(response.data))
            .catch(error => console.error("Ошибка при получении брендов:", error));
    };

    useEffect(() => {
       fetchDrinks();
       console.log(drinks);
    }, [refresh]);

    useEffect(() => {
        const filtered = selectedBrandId
            ? drinks.filter(d => d.brandId === selectedBrandId)
            : drinks;

        const prices = filtered.map(d => d.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        setPriceRange({ min, max });
        setCurrentPrice(max);
    }, [drinks, selectedBrandId]);

    const handleImportSuccess = () => {
        setRefresh(prev => !prev);
    };

    const filteredDrinks = drinks.filter(drink =>
        (!selectedBrandId || drink.brandId === selectedBrandId) &&
        drink.price <= currentPrice
    );
    const handleCart = () => {
        navigate('/cart');
    };

    if (isBusy) {
        return <div style={{ color: "red" }}>Извините, автомат занят другим пользователем</div>;
    }

    return (
        <>
            <nav className="w-full flex justify-between items-center p-8 ">
                <h1 className="text-4xl font-bold">Газированные напитки</h1>
                <ImportDrinksButton onSuccess={handleImportSuccess} />
            </nav>

            <div className="grid grid-cols-3 gap-32 w-full px-8 mb-4 justify-center items-center">
                <div className="flex flex-col mr-4">
                    <label className="mb-1">Выберите бренд:</label>
                    <select
                        className="border p-2 rounded"
                        value={selectedBrandId ?? ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSelectedBrandId(val ? Number(val) : null);
                        }}
                    >
                        <option value="">Все бренды</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <label className="block mb-1 w-full">Цена: до {currentPrice} руб.</label>
                    <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={currentPrice}
                        onChange={(e) => setCurrentPrice(Number(e.target.value))}
                        className="w-full"
                    />
                </div>

                <div className="flex items-end justify-end">
                    <button
                        className="bg-green-500 rounded w-2/3 py-4 text-white font-bold"
                        onClick={handleCart}
                        disabled={cartItems.reduce((sum, item) => sum + item.quantity, 0)===0}>
                        Выбрано: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </button>
                </div>
            </div>

            <div className="p-8 grid grid-cols-4 gap-4">
                {filteredDrinks.length > 0 ? (
                    filteredDrinks.map(drink => {
                        const isSelected = cartItems.some(item => item.id === drink.id);
                        return (
                            <DrinkItem
                                key={drink.id}
                                id={drink.id}
                                name={drink.name}
                                price={drink.price}
                                imageUrl={drink.imageUrl}
                                quantity={drink.quantity}
                                selected={isSelected}
                            />
                        );
                    })
                ) : (
                    <p>Напитки не найдены.</p>
                )}
            </div>
        </>
    );
}

export default CatalogPage;

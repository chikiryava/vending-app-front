import {useEffect, useState} from 'react';
import DrinkItem from "../components/DrinkItem";
import {useNavigate} from "react-router-dom";
import {useCart} from "../context/CartContext";
import ImportDrinksButton from "../components/ImportDrinksButton";
import {useMachineLock} from "../hooks/useVendingMachineLock";
import apiService, {Brand, Drink} from "../services/api";

// Define DrinkFilter type if it's not already defined
type DrinkFilter = {
    brandId?: number | null;
    maxPrice?: number;
};

function CatalogPage() {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [priceRange, setPriceRange] = useState({min: 0, max: 100});
    const [currentPrice, setCurrentPrice] = useState<number>(100);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

    const {cartItems} = useCart();
    const navigate = useNavigate();
    const {isBusy} = useMachineLock();

    // Fetch all drinks for the selected brand to calculate price range
    const fetchDrinksAndCalculatePriceRange = async (brandId: number | null) => {
        setLoading(true);
        try {
            // Get all drinks for the selected brand (or all brands)
            const filter: DrinkFilter = {};
            if (brandId !== null) {
                filter.brandId = brandId;
            }

            // We don't include maxPrice here because we need ALL drinks for the brand
            // to calculate the full price range
            const drinksData = await apiService.getFilteredDrinks(filter);

            if (drinksData.length > 0) {
                // Calculate price range from fetched drinks
                const prices = drinksData.map(d => d.price);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);

                setPriceRange({min: minPrice, max: maxPrice});

                // When changing brands, reset current price to max
                setCurrentPrice(maxPrice);

                // Since we already have the drinks data, use it directly
                setDrinks(drinksData);
            } else {
                // No drinks for this brand
                setPriceRange({min: 0, max: 0});
                setCurrentPrice(0);
                setDrinks([]);
            }
        } catch (error) {
            console.error("Error fetching drinks data:", error);
        }
        setLoading(false);
    };

    // Fetch drinks filtered by both brand and price
    const fetchFilteredDrinks = async () => {
        setLoading(true);
        try {
            const filter: DrinkFilter = {
                maxPrice: currentPrice
            };

            if (selectedBrandId !== null) {
                filter.brandId = selectedBrandId;
            }

            const drinksData = await apiService.getFilteredDrinks(filter);
            setDrinks(drinksData);
        } catch (error) {
            console.error("Error fetching filtered drinks:", error);
        }
        setLoading(false);
    };

    // Initial load and refresh trigger
    useEffect(() => {
        const initializeData = async () => {
            try {
                // Fetch brands
                const brandsData = await apiService.getBrands();
                setBrands(brandsData);

                // Fetch initial drinks and price range
                await fetchDrinksAndCalculatePriceRange(selectedBrandId);
            } catch (error) {
                console.error("Error initializing data:", error);
                setLoading(false);
            }
        };

        initializeData();
    }, [refresh]);

    // When brand changes, recalculate price range and fetch new drinks
    useEffect(() => {
        if (brands.length > 0) {
            fetchDrinksAndCalculatePriceRange(selectedBrandId);
        }
    }, [selectedBrandId]);

    // When price changes, fetch filtered drinks
    useEffect(() => {
        // Only run if we have brands and the price range is valid
        if (brands.length > 0 && priceRange.max > 0 && currentPrice >= priceRange.min) {
            fetchFilteredDrinks();
        }
    }, [currentPrice]);

    const handleImportSuccess = () => {
        setRefresh(prev => !prev);
    };

    const handleCart = () => {
        navigate('/cart');
    };

    if (isBusy) {
        return <div className="p-8 text-red-600 text-xl">Извините, автомат занят другим пользователем</div>;
    }

    return (
        <>
            <nav className="w-full flex justify-between items-center p-8 ">
                <h1 className="text-4xl font-bold">Газированные напитки</h1>
                <ImportDrinksButton onSuccess={handleImportSuccess}/>
            </nav>

            <div className="grid grid-cols-3 gap-8 w-full px-8 py-4  ">
                <div className="flex flex-col justify-center">
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
                        disabled={priceRange.min === priceRange.max}
                    />
                </div>

                <div className="flex items-end justify-end">
                    <button
                        className={`rounded w-2/3 py-4 text-white font-bold ${
                            cartItems.reduce((sum, item) => sum + item.quantity, 0) === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500"
                        }`}
                        onClick={handleCart}
                        disabled={cartItems.reduce((sum, item) => sum + item.quantity, 0) === 0}>
                        Выбрано: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </button>
                </div>
            </div>
            <hr className="border-t border-gray-300 border-2 mx-8 mt-2"/>


            <div className="p-8 grid grid-cols-4 gap-4 content-start">
                {loading ? (
                    <div className="col-span-4 flex justify-center items-center">
                        <p className="text-xl">Загрузка напитков...</p>
                    </div>
                ) : drinks.length > 0 ? (
                    drinks.map(drink => {
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
                    <div className="col-span-4 flex justify-center items-center">
                        <p className="text-xl">Напитки не найдены.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default CatalogPage;
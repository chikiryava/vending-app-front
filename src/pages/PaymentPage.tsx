// src/pages/PaymentPage.tsx
import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import PaymentSuccess from "../components/PaymentSuccess";
import CoinRow from "../components/CoinRow";
import PaymentSummary from "../components/PaymentSummary";
import apiService, { InsertedCoin, OrderItem } from "../services/api";
import { Coin } from "../types";

const COINS: Coin[] = [
    { nominal: 1, icon: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Russia-Coin-1-2009-a.png' },
    { nominal: 2, icon: 'https://ru-moneta.ru/upload/monety-21/2020-2-rub-revers.jpg' },
    { nominal: 5, icon: 'https://filtorg.ru/images/thumbnails/2184/1911/detailed/52/5-rub-1997-2.jpg' },
    { nominal: 10, icon: 'https://filtorg.ru/images/thumbnails/1199/1049/detailed/65/10-rubl-25.jpg' },
];

const PaymentPage: React.FC = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const [coinsCount, setCoinsCount] = useState<Record<number, number>>({
        1: 0,
        2: 0,
        5: 0,
        10: 0,
    });

    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [change, setChange] = useState<{ nominal: number; quantity: number }[]>([]);
    const [changeAmount, setChangeAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const totalInserted = useMemo(() => {
        return Object.entries(coinsCount).reduce((acc, [nominal, count]) => {
            return acc + Number(nominal) * count;
        }, 0);
    }, [coinsCount]);

    const isEnough = totalInserted >= totalPrice;

    const handleCoinChange = (value: number, delta: number) => {
        setCoinsCount(prev => ({
            ...prev,
            [value]: Math.max((prev[value] || 0) + delta, 0),
        }));
    };

    const handleManualInput = (value: number, newCount: number) => {
        setCoinsCount(prev => ({
            ...prev,
            [value]: Math.max(newCount, 0),
        }));
    };

    const handleCoinClick = (value: number) => {
        handleCoinChange(value, 1);
    };

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        const orderItems: OrderItem[] = cartItems.map(item => ({
            drinkId: item.drink.id,
            quantity: item.quantity,
        }));

        const insertedCoins: InsertedCoin[] = Object.entries(coinsCount)
            .filter(([_, qty]) => qty > 0)
            .map(([nom, qty]) => ({
                nominal: Number(nom),
                quantity: qty,
            }));

        try {
            const response = await apiService.createOrder({
                items: orderItems,
                insertedCoins: insertedCoins
            });

            setChange(response.changeCoins);
            setChangeAmount(response.changeAmount);
            setMessage(response.message);
            setPaymentSuccess(true);
            clearCart();
        } catch (error) {
            console.error("Ошибка при оплате:", error);
            setError("Извините, в данный момент мы не можем продать вам товар по причине того, что автомат не может выдать вам нужную сдачу");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => navigate('/cart');

    if (paymentSuccess) {
        return (
            <PaymentSuccess
                message={message}
                changeAmount={changeAmount}
                change={change}
            />
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Оплата</h2>

            <table className="w-full border-collapse mb-4">
                <thead>
                <tr className="border-b">
                    <th className="p-2 text-left">Номинал</th>
                    <th className="p-2 text-center">Количество</th>
                    <th className="p-2 text-right">Сумма</th>
                </tr>
                </thead>
                <tbody>
                {COINS.map((coin) => (
                    <CoinRow
                        key={coin.nominal}
                        coin={coin}
                        count={coinsCount[coin.nominal]}
                        onAdd={handleCoinClick}
                        onSubtract={(nominal) => handleCoinChange(nominal, -1)}
                        onManualInput={handleManualInput}
                    />
                ))}
                </tbody>
            </table>

            <PaymentSummary totalPrice={totalPrice} totalInserted={totalInserted} />

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleBack}
                    className="bg-gray-300 px-6 py-3 rounded hover:bg-gray-400 transition-colors"
                    disabled={loading}
                >
                    Вернуться
                </button>
                <button
                    onClick={handlePayment}
                    disabled={!isEnough || loading}
                    className={`px-6 py-3 rounded text-white ${
                        isEnough && !loading
                            ? "bg-green-600 hover:bg-green-700 transition-colors"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    {loading ? "Обработка..." : "Оплатить"}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
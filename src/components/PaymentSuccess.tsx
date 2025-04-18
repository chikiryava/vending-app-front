import React from 'react';
import {useNavigate} from 'react-router-dom';

interface PaymentSuccessProps {
    message: string;
    changeAmount: number;
    change: { nominal: number; quantity: number }[];
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
                                                           changeAmount,
                                                           change,
                                                       }) => {
    const navigate = useNavigate();

    const handleBackToCatalog = () => navigate('/');

    const coinImages: Record<number, string> = {
        1: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Russia-Coin-1-2009-a.png',
        2: 'https://ru-moneta.ru/upload/monety-21/2020-2-rub-revers.jpg',
        5: 'https://filtorg.ru/images/thumbnails/2184/1911/detailed/52/5-rub-1997-2.jpg',
        10: 'https://filtorg.ru/images/thumbnails/1199/1049/detailed/65/10-rubl-25.jpg',
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-full max-w-md text-center p-4">
                <h2 className="text-2xl font-bold mb-4">Спасибо за покупку!</h2>
                <p className="text-lg mb-6">
                    Пожалуйста, возьмите вашу сдачу:
                    <span className="text-green-600 font-semibold">
             {changeAmount} руб.
          </span>
                </p>

                <h3 className="text-lg font-semibold mb-4">Ваши монеты:</h3>
                <div className="flex flex-col items-start space-y-2 mb-6">
                    {change.map((coin, index) => (
                        <div key={index} className="flex items-center justify-center w-full">
                            <div className="flex items-center">
                                {coinImages[coin.nominal] && (
                                    <img
                                        src={coinImages[coin.nominal]}
                                        alt={`Монета ${coin.nominal} руб.`}
                                        className="w-24 h-24 object-contain mr-2"
                                    />
                                )}
                                <span className="font-semibold">{coin.quantity} шт.</span>
                            </div>

                        </div>
                    ))}
                </div>
                <button
                    onClick={handleBackToCatalog}
                    className="bg-yellow-500 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-600"
                >
                    Каталог напитков
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;

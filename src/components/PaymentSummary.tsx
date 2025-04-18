import React from 'react';

interface PaymentSummaryProps {
    totalPrice: number;
    totalInserted: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ totalPrice, totalInserted }) => {
    const isEnough = totalInserted >= totalPrice;

    return (
        <div className="mb-4">
            <p>
                Итоговая сумма товаров: <strong>{totalPrice}₽</strong>
            </p>
            <p>
                Вы внесли:{" "}
                <strong className={isEnough ? "text-green-600" : "text-red-600"}>
                    {totalInserted}₽
                </strong>
            </p>
        </div>
    );
};

export default PaymentSummary;

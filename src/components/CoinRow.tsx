import React from 'react';
import {FaMinus, FaPlus} from "react-icons/fa";

interface CoinRowProps {
    coin: { nominal: number; icon: string };
    count: number;
    onAdd: (nominal: number) => void;
    onSubtract: (nominal: number) => void;
    onManualInput: (nominal: number, newCount: number) => void;
}

const CoinRow: React.FC<CoinRowProps> = ({
                                             coin,
                                             count,
                                             onAdd,
                                             onSubtract,
                                             onManualInput,
                                         }) => {
    return (
        <tr className="border-b">
            <td className="p-2 flex items-center space-x-2">
                <img
                    src={coin.icon}
                    alt={`Монета ${coin.nominal} руб.`}
                    width={70}
                    height={70}
                    onClick={() => onAdd(coin.nominal)}
                    className="cursor-pointer"
                />
                <span>{coin.nominal} руб.</span>
            </td>
            <td className="p-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={() => onSubtract(coin.nominal)}
                        className="bg-gray-950 text-white p-1 rounded hover:bg-gray-800"
                    >
                        <FaMinus size={12}/>
                    </button>
                    <input
                        type="number"
                        value={count}
                        min={0}
                        onChange={(e) =>
                            onManualInput(coin.nominal, Number(e.target.value))
                        }
                        className="w-12 text-center border rounded"
                    />
                    <button
                        onClick={() => onAdd(coin.nominal)}
                        className="bg-gray-950 text-white p-1 rounded hover:bg-gray-800"
                    >
                        <FaPlus size={12}/>
                    </button>
                </div>
            </td>
            <td className="p-2 text-right w-1/3">
                {coin.nominal * count} руб.
            </td>
        </tr>
    );
};

export default CoinRow;

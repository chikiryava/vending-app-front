import React, { useRef } from 'react';
import axios from 'axios';

interface ImportDrinksButtonProps {
    onSuccess: () => void;
}

const ImportDrinks = ({onSuccess}:ImportDrinksButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('https://localhost:7153/api/Drinks/ImportDrinks', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                console.log(response.data);
                onSuccess();
            } catch (error) {
                console.error("Ошибка импорта:", error);
            }
        }
    };

    return (
        <div className="p-4">
            <button
                onClick={handleButtonClick}
                className="bg-gray-300 text-black px-16 py-3 rounded"
            >
                Импорт товаров
            </button>
            <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default ImportDrinks;

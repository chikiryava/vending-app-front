// src/components/ImportDrinksButton.tsx
import React, { useRef } from 'react';
import apiService from '../services/api';

interface ImportDrinksButtonProps {
    onSuccess: () => void;
}

const ImportDrinks = ({ onSuccess }: ImportDrinksButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            try {
                await apiService.importDrinks(file);
                onSuccess();
            } catch (error) {
                console.error("Ошибка импорта:", error);
            }
        }
    };

    return (
        <div>
            <button
                onClick={handleButtonClick}
                className="bg-gray-300 text-black px-16 py-3 rounded hover:bg-gray-400 transition-colors"
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
import React, { useRef, useState } from 'react';
import apiService from '../services/api';

interface ImportDrinksButtonProps {
    onSuccess: () => void;
}

const ImportDrinks = ({ onSuccess }: ImportDrinksButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setLoading(true);

            try {
                await apiService.importDrinks(file);
                setError(null);
                onSuccess();
            } catch (error) {
                console.error("Ошибка импорта:", error);
                setError("Не удалось импортировать файл. Проверьте формат и попробуйте снова.");
            } finally {
                setLoading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-end">
            <button
                onClick={handleButtonClick}
                className="bg-gray-300 text-black px-16 py-3 rounded hover:bg-gray-400 transition-colors"
                disabled={loading}
            >
                {loading ? "Загрузка..." : "Импорт товаров"}
            </button>
            <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
    );
};

export default ImportDrinks;
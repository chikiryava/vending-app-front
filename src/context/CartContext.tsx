import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Drink {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    brand: string;
    stock: number;
}

export interface CartItem {
    id: number;
    quantity: number;
    drink: Drink;
}

interface CartContextType {
    cartItems: CartItem[];
    addItem: (drink: Drink) => void;
    removeItem: (id: number) => void;
    updateItemQuantity: (id: number, quantity: number) => void;
    totalCount: number;
    totalPrice: number;
    clearCart: () => void;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        // Загрузка из localStorage при инициализации
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (drink: Drink) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === drink.id);
            if (existing) {
                return prev.map(item =>
                    item.id === drink.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prev, { id: drink.id, quantity: 1, drink }];
            }
        });
    };

    const removeItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateItemQuantity = (id: number, quantity: number) => {
        setCartItems(prev =>
            prev.map(item => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.drink.price, 0);

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider
            value={{ cartItems, addItem, removeItem, updateItemQuantity, totalCount, totalPrice,clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart должен использоваться внутри CartProvider");
    }
    return context;
};

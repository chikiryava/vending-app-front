// src/types/index.ts
export interface Brand {
    id: number;
    name: string;
}

export interface Drink {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    brand: Brand;
    brandId: number;
    quantity: number;
    stock: number;
}

export interface CartItemDrink {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    stock: number;
}

export interface CartItem {
    id: number;
    quantity: number;
    drink: CartItemDrink;
}

export interface Coin {
    nominal: number;
    icon: string;
}

export interface CoinChange {
    nominal: number;
    quantity: number;
}
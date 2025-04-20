import axios from 'axios';

const API_BASE_URL = 'https://localhost:7153/api';

export interface DrinkFilter {
    maxPrice?: number;
    brandId?: number | null;
}

export interface PriceRange {
    minPrice: number;
    maxPrice: number;
}

export interface Drink {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    brand: Brand;
    brandId: number;
    quantity: number;
}

export interface Brand {
    id: number;
    name: string;
}

export interface InsertedCoin {
    nominal: number;
    quantity: number;
}

export interface OrderItem {
    drinkId: number;
    quantity: number;
}

export interface OrderPayload {
    items: OrderItem[];
    insertedCoins: InsertedCoin[];
}

export interface OrderResponse {
    changeCoins: { nominal: number; quantity: number }[];
    changeAmount: number;
    message: string;
}


const apiService = {
    getDrinks: async (): Promise<Drink[]> => {
        const response = await axios.get(`${API_BASE_URL}/Drinks`);
        return response.data;
    },

    getFilteredDrinks: async (filter: DrinkFilter): Promise<Drink[]> => {
        const queryParams = [];

        if (filter.maxPrice !== undefined) {
            queryParams.push(`MaxPrice=${filter.maxPrice}`);
        }

        if (filter.brandId) {
            queryParams.push(`BrandId=${filter.brandId}`);
        }

        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const response = await axios.get(`${API_BASE_URL}/Drinks/filter${queryString}`);
        return response.data;
    },

    // Get min and max price for drinks, optionally filtered by brand
    getDrinkPriceRange: async (brandId?: number | null): Promise<PriceRange> => {
        const queryString = brandId ? `?BrandId=${brandId}` : '';
        const response = await axios.get(`${API_BASE_URL}/Drinks/price-range${queryString}`);
        return response.data;
    },

    // Alternative method to calculate price range if the endpoint is not available
    calculatePriceRange: async (brandId?: number | null): Promise<PriceRange> => {
        // Use the filter endpoint without maxPrice to get all drinks for the brand
        const filter: DrinkFilter = {};
        if (brandId !== null && brandId !== undefined) {
            filter.brandId = brandId;
        }

        const drinks = await apiService.getFilteredDrinks(filter);

        if (drinks.length === 0) {
            return { minPrice: 0, maxPrice: 0 };
        }

        const prices = drinks.map(drink => drink.price);
        return {
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices)
        };
    },

    getBrands: async (): Promise<Brand[]> => {
        const response = await axios.get(`${API_BASE_URL}/Brands`);
        return response.data;
    },

    importDrinks: async (file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_BASE_URL}/Drinks/ImportDrinks`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data;
    },

    createOrder: async (payload: OrderPayload): Promise<OrderResponse> => {
        const response = await axios.post(`${API_BASE_URL}/Orders`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data;
    }
};


export default apiService;
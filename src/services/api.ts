import axios from 'axios';
import {Brand, Drink, DrinkFilter, OrderPayload, OrderResponse} from "../types";

const API_BASE_URL = 'https://localhost:7153/api';


const apiService = {
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
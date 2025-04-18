import {BrowserRouter, Routes, Route} from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import {CartProvider} from "./context/CartContext.tsx";
import PaymentPage from "./pages/PaymentPage.tsx";

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<CatalogPage/>}
                    />

                    <Route
                        path="/cart"
                        element={<CartPage/>}
                    />

                    <Route
                        path="/payment"
                        element={<PaymentPage/>}/>
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;

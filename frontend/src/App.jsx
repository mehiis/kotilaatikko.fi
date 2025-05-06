// App.jsx (modified - removed Router)
import React from 'react';
import Layout from './Components/Layout';

import {BrowserRouter, Route, Routes} from 'react-router-dom'; // Removed Router import
import Home from './Views/Home';
import {ProtectedRoute} from './Components/ProtectedRoute';
import Profile from './Views/Profile';
import {UserProvider} from './Contexts/UserContext';
import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';
import Logout from './Views/Logout';
import Shop from './Views/Shop';
import {CartProvider} from './Contexts/CartContext';
import CartDropdown from './Components/CartDropdown';
import Checkout from './Views/Checkout';
import Product from './Views/Product';
import NotFound from './Views/NotFound';
import Confirmation from './Views/Confirmation';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <CartDropdown />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;

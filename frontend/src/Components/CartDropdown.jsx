// src/components/CartDropdown.js
import { Link } from 'react-router';
import { useCart } from '../Contexts/CartContext';

const CartDropdown = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60" onClick={() => setIsCartOpen(false)}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Ostoskärry</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Ostoskärrysi on tyhjä</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <img src={import.meta.env.VITE_IMG_SERVE_URL+item?.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-600">€{Number(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-500"
                      >
                        Poista kärrystä
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">€{Number(cartTotal).toFixed(2)}</span>
              </div>
              <Link onClick={() => {setIsCartOpen(false)}} className="w-full py-2 px-4 bg-[var(--primary-color)] mb-3 text-white rounded hover:bg-amber-600 hover:scale-105 transition-transform duration-200 font-bold" to="/checkout">Mene kassalle</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;

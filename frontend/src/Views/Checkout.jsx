import React, {useState} from 'react';
import {useCart} from '../Contexts/CartContext';
import {useUser} from '../Hooks/apiHooks'; // Import your user hook
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {createKlarnaOrder} from '../Utils/klarna';

const Checkout = () => {
  const {cartItems, cartTotal} = useCart();
  const {getUserByToken} = useUser(); // Get the user hook function
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState(null);
  const [klarnaSnippet, setKlarnaSnippet] = useState('');
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'Finland',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('klarna');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setCustomerInfo((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'address',
      'postalCode',
      'city',
      'country',
    ];
    const missingFields = requiredFields.filter(
      (field) => !customerInfo[field],
    );

    if (missingFields.length > 0) {
      setError(`Puuttuvat kentät: ${missingFields.join(', ')}`);
      setIsProcessing(false);
      return;
    }

    try {
      console.log('Processing payment with:', paymentMethod);

      if (paymentMethod === 'klarna') {
        // Klarna payment logic
        console.log('Sending to Klarna:', {
          items: cartItems,
          total: cartTotal,
          customer: customerInfo,
        });

        const klarnaResponse = await createKlarnaOrder({
          items: cartItems,
          total: cartTotal,
          customer: customerInfo,
        });

        if (!klarnaResponse.html_snippet && !klarnaResponse.redirect_url) {
          throw new Error('No valid payment URL received from Klarna');
        }

        setKlarnaSnippet(klarnaResponse.html_snippet);
      } else if (paymentMethod === 'paypal') {
        // PayPal payment logic
        console.log('Redirecting to PayPal...');
        alert('PayPal payment is not implemented yet.');
      } else if (paymentMethod === 'dummy') {
        // Dummy payment logic
        console.log('Processing dummy payment...');

        // Post order information to the database
        console.log('customerInfo:', customerInfo);
        console.log('cartItems:', cartItems);
        console.log('cartTotal:', cartTotal);
        const response = await fetch(
          `${import.meta.env.VITE_AUTH_API}/orders`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              meals: cartItems,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Tilausta ei voitu lähettää tietokantaan.');
        }

        // Redirect to Confirmation page
        navigate('/confirmation');
      } else {
        throw new Error('Invalid payment method selected');
      }
    } catch (err) {
      setError(`Maksuvirhe: ${err.message}`);
      console.error('Maksuvirhe:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Ostoskärrysi on tyhjä!</h2>
        <Link
          to={'/shop'}
          className="bg-[var(--primary-color)] text-white px-4 py-2 rounded hover:bg-opacity-90"
        >
          Jatka shoppailua
        </Link>
      </div>
    );
  }

  const fetchUserData = async () => {
    setLoadingUser(true);
    setUserError(null);
    try {
      const userData = await getUserByToken();
      setUser(userData.user);

      // Populate the form with user data
      setCustomerInfo({
        firstName: userData.user.firstName || '',
        lastName: userData.user.lastName || '',
        email: userData.user.email || '',
        address: userData.user.address || '',
        postalCode: userData.user.postalCode || '',
        city: userData.user.city || '',
        country: userData.user.country || 'Finland',
        phone: userData.user.phone || '',
      });
    } catch (err) {
      setUserError(err.message || 'Failed to fetch user data');
    } finally {
      setLoadingUser(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Kassa</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Asiakastiedot</h2>
            <button
              onClick={fetchUserData}
              disabled={loadingUser}
              className={`px-3 py-1 text-sm rounded ${
                loadingUser
                  ? 'bg-gray-300'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {loadingUser ? 'Lataa...' : 'Täytä tiedot'}
            </button>
          </div>

          {userError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {userError}
            </div>
          )}

          {klarnaSnippet ? (
            <div
              id="klarna-checkout-container"
              dangerouslySetInnerHTML={{__html: klarnaSnippet}}
            ></div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Etunimi
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Sukunimi
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Osoite</label>
                <input
                  type="text"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Postinumero
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={customerInfo.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Kaupunki
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Maa</label>
                <select
                  name="country"
                  value={customerInfo.country}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  onClick={() => {
                    console.log(customerInfo.country);
                  }}
                  required
                >
                  <option value="FI">Finland</option>
                  <option value="SE">Sweden</option>
                  <option value="NO">Norway</option>
                  <option value="DK">Denmark</option>
                </select>
              </div>

              <h2 className="text-xl font-semibold mb-4">Maksutapa</h2>
              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="klarna"
                    checked={paymentMethod === 'klarna'}
                    onChange={() => setPaymentMethod('klarna')}
                    className="h-4 w-4"
                  />
                  <span>Klarna</span>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Maksa myöhemmin tai osissa Klarnalla.
                </p>
              </div>
              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="h-4 w-4"
                  />
                  <span>PayPal</span>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Maksa PayPal-tililtäsi.
                </p>
              </div>
              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="dummy"
                    checked={paymentMethod === 'dummy'}
                    onChange={() => setPaymentMethod('dummy')}
                    className="h-4 w-4"
                  />
                  <span>Dummy</span>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Kehittäjätarkoituksiin. Ei oikeaa maksua.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  isProcessing
                    ? 'bg-gray-400'
                    : 'bg-[var(--primary-color)] hover:bg-opacity-90'
                }`}
              >
                {isProcessing ? 'Lataa...' : 'Jatka maksamaan'}
              </button>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tilausyhteenveto</h2>
          <div className="divide-y">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4 flex justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={import.meta.env.VITE_IMG_SERVE_URL+item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Yhteensä</span>
              <span>€{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Postitus</span>
              <span>€0.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Yhteensä</span>
              <span>€{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

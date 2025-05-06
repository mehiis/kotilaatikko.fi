import React, { useState, useEffect } from 'react';
import { useUser } from '../Hooks/apiHooks';

const UserProfile = () => {
  const { getUserByToken, getMyOrders } = useUser();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('userInfo');


  // Fetch user information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserByToken();
        setUser(userData.user);
      } catch (err) {
        setError(err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch user orders
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return; // Wait until user data is loaded
      try {
        const ordersData = await getMyOrders(user.id); // Pass user ID to getMyOrders
        setOrders(ordersData || []); // Ensure orders is always an array
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
      }
    };

    if (activeTab === 'orders') {
      fetchUserOrders();
    }
  }, [activeTab, user]);

  if (loading) {
    return <div className="font-bold text-2xl flex flex-col items-center justify-center mt-6">Haetaan tietoja...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-6">Virhe: {error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-6">Käyttäjätietoja ei saatavilla</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'userInfo':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Käyttäjätiedot</h2>
            <div className="detail-row">
              <span className="detail-label font-bold">Etunimi: </span>
              <span className="detail-value">{user.firstName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label font-bold">Sukunimi: </span>
              <span className="detail-value">{user.lastName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label font-bold">Email: </span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="detail-row mt-5">
              <span className="detail-label font-bold">Puhelin: </span>
              <span className="detail-value">{user.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label font-bold">Osoite: </span>
              <span className="detail-value">{user.address}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label font-bold">Kaupunki: </span>
              <span className="detail-value">{user.city}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label font-bold">Postinumero: </span>
              <span className="detail-value">{user.postalCode}</span>
            </div>
            <div className="detail-row mt-5">
              <span className="detail-label font-bold">Tilattu uutiskirje: </span>
              <span className="detail-value">{user.subscribed ? 'Kyllä' : 'Ei'}</span>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tehdyt tilaukset</h2>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.order_id} className="order-item mb-4 p-4 bg-gray-100 rounded-lg shadow">
                  <p><strong>Tilausnumero:</strong> {order.order_id}</p>
                  <p><strong>Päivämäärä:</strong> {new Date(order.order_date).toLocaleDateString('fi-FI')}</p>
                  <p className=' mb-5'><strong>Hinta:</strong> {order.total_price} €</p>
                  <p><strong>Tuotteet:</strong></p>
                  <ul className="list-disc list-inside">
                    {order.meals.map((meal) => (
                      <li key={meal.meal_id}>
                        {meal.meal_name} - {meal.quantity} kpl - {meal.total_price} €
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="text-center">Ei tilauksia saatavilla</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="m-2 space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('userInfo')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'userInfo'
                ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Käyttäjätiedot
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tilaukset
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default UserProfile;

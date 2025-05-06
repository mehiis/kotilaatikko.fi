import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchData } from '../Utils/fetchData';
import { useCart } from '../Contexts/CartContext';

const Product = () => {
  const { id } = useParams(); // Get the item ID from the URL
  const navigate = useNavigate(); // Initialize navigation
  const [item, setItem] = useState(null); // State to store the item details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  // Scroll to the top when the component is mounted
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await fetchData(`${import.meta.env.VITE_AUTH_API}/meals/${id}`); // Fetch item by ID
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // Redirect to 404 page if there's an error
  useEffect(() => {
    if (error) {
      navigate('/*'); // Redirect to the 404 page
    }
  }, [error, navigate]);

  if (loading) {
    return <div className="text-center mt-8">Tuote latautuu...</div>;
  }

  if (!item) {
    navigate('/*'); // Redirect to the 404 page
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Item Image */}
      <div className="flex-shrink-0">
        <img
          src={import.meta.env.VITE_IMG_SERVE_URL+item.image}
          alt={item.name}
          className="w-full md:w-[400px] h-[300px] object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Item Details */}
      <div className="flex-grow">
        <h1 className="text-3xl font-[header] mb-4">{item.name}</h1>
        <p className="text-gray-600 mb-4">{item.description}</p>

        {/* Ingredients List */}
        <h2 className="text-xl font-semibold mb-2">Ainesosat:</h2>
        <ul className="list-disc list-inside mb-4">
          {item.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-700">
              {typeof ingredient === 'string' ? ingredient : ingredient.name} {/* Adjust based on structure */}
            </li>
          ))}
        </ul>

        {/* Purchase Button */}
        <button onClick={() => {addToCart(item)}} className="bg-[var(--primary-color)] text-white px-6 py-3 rounded hover:bg-opacity-90 hover:scale-105 transition-transform duration-200 font-bold">
          Lisää ostoskoriin
        </button>
      </div>
    </div>
  );
};

export default Product;

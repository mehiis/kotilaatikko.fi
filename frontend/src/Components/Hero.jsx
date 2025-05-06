import React from 'react';
import { fetchData } from '../Utils/fetchData';
import { useEffect, useState } from 'react';
import { CarouselInfoBuyOptions } from '../Components/CarouselInfoBuyOptions.jsx';

const Hero = () => {
  // Define the text arrays for the moving text
  const topText = [
    'AINA TUORETTA!',
    '100% KOTIMAINEN!',
    'NOPEA TOIMITUS!',
    'TILAA NYT!',
    'SESONGIN PARHAAT!',
    'LAAJA VALIKOIMA!',
  ];

  // Define the text arrays for the moving text
  const bottomText = [
    'NOPEA TOIMITUS!',
    'LAAJA VALIKOIMA!',
    'SESONGIN PARHAAT!',
    'AINA TUORETTA!',
    '100% KOTIMAINEN!',
    'TILAA NYT!',
  ];

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
      const fetchItems = async () => {
        try {
          // Fetch all items
          const data = await fetchData(import.meta.env.VITE_AUTH_API + '/meals'); // Replace with your API endpoint
          setAllItems(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchItems();
    }, []);

  // Function to create text content with bullet points
  const textContent = (array) => {

    return (
      <>
        {array.map((text, index) => (
          <span key={index}>&nbsp; &#10007; &nbsp; {text}</span>
        ))}
      </>
    );
  };

  return (
    <>
<div className="relative w-full h-[500px]">
  <img
    src={`${import.meta.env.BASE_URL}hero.jpg`}
    alt="hero"
    className="w-full h-full object-cover rounded-b-xs"
  />

  {/* Carousel Section */}
  <div className="absolute inset-0 flex flex-col justify-center items-center">
    {loading ? (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-gray-600">Ladataan ruokalistoja...</p>
      </div>
    ) : error ? (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-red-500">Ruokalistan lataus epäonnistui</p>
      </div>
    ) : (
      <CarouselInfoBuyOptions items={allItems} />
    )}
  </div>

  <div className="absolute top-0 w-full overflow-hidden">
    <div className="moving-text-wrapper">
      <div className="moving-text text-[var(--primary-color)] text-lg font-[header] text-shadow-lg">
        {textContent(topText)}
      </div>
      <div className="moving-text text-[var(--primary-color)] text-lg font-[header] text-shadow-lg">
        {textContent(topText)}
      </div>
    </div>
  </div>

  <div className="absolute bottom-0 w-full overflow-hidden">
    <div className="moving-text-wrapper">
      <div className="moving-text text-[var(--primary-color)] text-lg font-[header] text-shadow-lg">
        {textContent(bottomText)}
      </div>
      <div className="moving-text text-[var(--primary-color)] text-lg font-[header] text-shadow-lg">
        {textContent(bottomText)}
      </div>
    </div>
  </div>
</div>
    </>
  );
};

export default Hero;

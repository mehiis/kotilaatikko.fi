import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

const CarouselInfoBuyOptions = ({ items }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Limit items to a maximum of 5
  const limitedItems = items.slice(0, 5);

  const goToPrevious = () => {
    const newIndex = ((currentIndex - 1) % limitedItems.length + limitedItems.length) % limitedItems.length;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % limitedItems.length;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % limitedItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [limitedItems.length]);

  return (
    <div
      className="relative w-full bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}hero-blur.jpg)`,
      }}
    >
      <button
        onClick={goToPrevious}
        className="h-12 w-12 absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 text-white text-2xl p-2 rounded-full hover:bg-black hover:scale-110 transition-all duration-300 z-10 flex items-center justify-center"
      >
        <SlArrowLeft />
      </button>
      <button
        onClick={goToNext}
        className="h-12 w-12 absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 text-white text-2xl p-2 rounded-full hover:bg-black hover:scale-110 transition-all duration-300 z-10 flex items-center justify-center"
      >
        <SlArrowRight />
      </button>

      <div className="relative flex flex-col md:flex-row items-center w-full h-auto md:h-72 p-6">
        <div className="relative w-full md:w-2/6 h-full max-h-72 overflow-hidden rounded-lg shadow-md">
          <div className="flex transition-transform duration-500 ease-in-out h-full">
            {limitedItems.map((item, index) => (
              <div
                key={index}
                className="relative min-w-full h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${-100 * currentIndex}%)` }}
              >
                {item?.image ? (
                  <img
                    src={import.meta.env.VITE_IMG_SERVE_URL + item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <p className="text-gray-500">Kuvaa ei löytynyt.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 p-4 bg-black/50 md:hidden">
          {limitedItems[currentIndex] && (
            <>
              <h3 className="text-3xl font-[header] text-white">{limitedItems[currentIndex].name}</h3>
              <div className="flex flex-col gap-2">
              <button
                  className="rounded-2xl bg-[var(--primary-color)] text-[var(--white-color)] py-2 px-4 mx-2 hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate('/shop')}
                >
                  Mene kaupaan
                </button>
                <button
                  className="rounded-2xl bg-[var(--primary-color)] text-[var(--white-color)] py-2 px-4 mx-2 hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate(`/product/${limitedItems[currentIndex].id || currentIndex}`)}
                >
                  Lue lisää...
                </button>
              </div>
            </>
          )}
        </div>

        <div className="relative w-full md:w-4/6 items-center justify-start text-left p-6 hidden md:flex">
          {limitedItems.map((item, index) => (
            <div
              key={index}
              className={`absolute transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="bg-black/50 p-4 rounded-lg min-w-[73vh] max-w-[73vh] min-h-[15vh] max-h-[30vh]">
                <h3 className="text-3xl font-[header] mb-4 text-white">{item.name}</h3>
                <p className="text-gray-200 mb-4">{item.description}</p>
                <div className="flex justify-start mt-4">
                <button
                    className="rounded-2xl bg-[var(--primary-color)] text-[var(--white-color)] py-2 px-4 mx-2 hover:scale-105 transition-transform duration-300"
                    onClick={() => navigate('/shop')}
                  >
                    Mene kauppaan
                  </button>
                  <button
                    className="rounded-2xl bg-[var(--primary-color)] text-[var(--white-color)] py-2 px-4 mx-2 hover:scale-105 transition-transform duration-300"
                    onClick={() => navigate(`/product/${item.id || index}`)}
                  >
                    Lue lisää...
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-2 mb-5">
        {limitedItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 mx-1 rounded-full ${
              index === currentIndex ? "bg-[var(--primary-color)]" : "bg-gray-300 opacity-25"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export { CarouselInfoBuyOptions };

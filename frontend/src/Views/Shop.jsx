import React, { useEffect, useState } from 'react'
import ItemRow from '../Components/ItemRow'
import { fetchData } from '../Utils/fetchData'


const Shop = () => {
  const [allItems, setAllItems] = useState([]) // State to store all items
  const [filteredItems, setFilteredItems] = useState([]) // State to store filtered items
  const [categories, setCategories] = useState([]) // State to store categories
  const [selectedCategory, setSelectedCategory] = useState('') // Selected category filter
  const [itemsPerPage, setItemsPerPage] = useState(10) // Number of items per page
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch all items
        const data = await fetchData('http://localhost:3000/api/v1/meals') // Replace with your API endpoint
        setAllItems(data)
        setFilteredItems(data.slice(0, itemsPerPage)) // Initially load itemsPerPage items

        // Fetch categories
        const categoryData = await fetchData('http://localhost:3000/api/v1/categories') // Replace with your API endpoint
        setCategories(categoryData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [itemsPerPage]) // Re-fetch filtered items when itemsPerPage changes

  useEffect(() => {
    // Filter by category
    let filtered = allItems;

    const filter = async () => {
    if (selectedCategory) {
      console.log('Selected category:', selectedCategory)
      try{
      filtered = await fetchData(`http://localhost:3000/api/v1/meals/category/${selectedCategory}`, );
      } catch (err) {
        console.log("ikävä virhe: " + err.message)
      }
    }
    }
    // Apply pagination (limit items per page)
    filter();
    setFilteredItems(filtered.slice(0, itemsPerPage)) // Update filteredItems state
  }, [selectedCategory, itemsPerPage, allItems])

  if (loading) {
    return <div className="text-center mt-8">Tuote sivu latautuu...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Virhe: {error}</div>
  }

  if (allItems.length === 0) {
    return <div className="text-center mt-8">Sivustolla ei ole yhtään ateriaa?!</div>
  }

  return (
    <div className="shop-page">
<div className="relative">
  <img
    src="/hero-blur.jpg"
    alt="Shop Hero"
    className="w-full h-[200px] object-cover rounded-b-lg"
  />
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-50 text-center px-4">
    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-[header] mt-4 md:mt-0">
      Tee arjestasi helppoa &#8212; Tilaa tänään!
    </h1>
    <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl mt-4 md:mt-6">
      Sinun ei tarvitse enää huolehtia ruokalistan suunnittelusta tai kaupasta ravaamisesta – saat kaiken valmiiksi toimitettuna. Näin voit nauttia ruoasta ilman turhaa vaivannäköä!
    </p>
  </div>
</div>

      <div className="max-w-[1600px] mx-auto px-4">
        {/* Recommended Section */}
        <div className="recommended-section my-8">
          <h2 className="text-2xl font-[header] mb-4">Viikon suosituin ateria</h2>
          {allItems.length > 0 && (
            <div className="rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row relative bg-gray-100 hover:scale-102 transition-transform duration-300">
              <div className="absolute top-0 left-0 bg-[var(--primary-color)] text-white text-sm font-bold px-3 py-1 rounded-br-lg">
                TILATUIN
              </div>
              <img
                src={allItems[0].image}
                alt={allItems[0].name}
                className="w-full sm:w-1/3 h-[300px] object-cover"
              />
<div className="p-6 flex flex-col justify-between flex-grow relative">
  <div className="mb-4">
    <h3 className="text-2xl font-[header] mb-2">{allItems[0].name}</h3>
    <p className="text-gray-600 mb-4">{allItems[0].description}</p>
    <p className="text-[var(--primary-color)] font-bold text-2xl">
      {allItems[0].price} &#8364;
    </p>
  </div>
  <div className="flex flex-col sm:flex-row sm:gap-4 sm:justify-end md:absolute md:bottom-4 md:right-4">
    <button className="bg-[var(--primary-color)] mb-3 text-white px-4 py-2 rounded hover:bg-opacity-90 hover:scale-105 transition-transform duration-200 font-bold">
      Lisää ostoskoriin
    </button>
    <button className="bg-gray-200 text-gray-800 mb-3 px-4 py-2 rounded hover:bg-gray-300 hover:scale-105 transition-transform duration-200 font-bold">
      Lue lisää...
    </button>
  </div>
</div>
            </div>
          )}
        </div>

        {/* All Items Section */}
        <div className="all-items-section my-8">
          <div className="flex flex-wrap items-center justify-between mb-4">
            {/* Heading */}
            <h2 className="text-2xl font-[header]">Ateriat</h2>

            {/* Filter Row */}
            <div className="filter-row flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <select
                className="border px-4 py-2 rounded"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Kaikki kategoriat</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Items Per Page */}
              <select
                className="border px-4 py-2 rounded"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={150}>150</option>
                <option value={500}>500</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
  <ItemRow allItems={filteredItems} /> {/* Pass filteredItems to ItemRow */}
</div>
        </div>
      </div>
    </div>
  )
}



export default Shop

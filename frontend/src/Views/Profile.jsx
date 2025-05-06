/**
 * @api {component} Profile Profile View
 * @apiGroup UserComponents
 * @apiDescription The profile page that displays different views based on user type (admin or regular user).
 *
 * @apiState {Array} meals List of meal packages
 * @apiState {Boolean} isLoading Loading state for meals data
 * @apiState {String|null} error Error message for meals fetching
 * @apiState {String} activeTab Currently active admin tab ('mealPackages', 'orderTracking', or 'newsletter')
 * @apiState {Array} newsletters List of newsletters (admin only)
 *
 * @apiExample {js} Example Usage:
 * <Profile />
 *
 * @apiSuccessExample {js} Admin View:
 * // Shows admin tabs with meal management, order tracking, and newsletter tools
 *
 * @apiSuccessExample {js} Regular User View:
 * // Shows standard user profile information
 *
 * @apiErrorExample {js} Error Response:
 * // Shows error message when data fetching fails
 */

import React, {useEffect, useState} from 'react';
import UserProfile from '../Components/UserProfile';
import AdminAddMealPanel from '../Components/AdminAddMealPanel';
import {useUserContext} from '../Hooks/contextHooks';
import MealPackagesList from '../Components/MealPackagesList';
import {AdminAddNewsletter} from '../Components/adminPanel/AdminAddNewsletter';
import {NewslettersList} from '../Components/adminPanel/NewslettersList';
import {fetchData} from '../Utils/fetchData';
import AdminOrderTracking from '../Components/AdminOrderTracking';

const Profile = () => {
  const {user} = useUserContext();
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('mealPackages');
  const [newsletters, setNewsletters] = useState([]);


  /**
 * @api {method} fetchMeals Fetch Meals
 * @apiGroup Profile
 * @apiDescription Fetches all meal packages from the API.
 *
 * @apiSuccess {Array} meals Updates meals state with fetched data
 * @apiError {String} error Sets error message if fetch fails
 */
  const fetchMeals = async () => {
    try {
      const data = await fetchData(import.meta.env.VITE_AUTH_API + '/meals');
      setMeals(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };


  /**
 * @api {method} fetchNewsletters Fetch Newsletters
 * @apiGroup Profile
 * @apiDescription Fetches all newsletters from the API (admin only).
 *
 * @apiSuccess {Array} newsletters Updates newsletters state with fetched data
 * @apiError {String} error Logs error if fetch fails
 */
  const fetchNewsletters = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_AUTH_API + '/newsletter',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch newsletters');
      }
      const data = await response.json();
      setNewsletters(data);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    }
  };

  useEffect(() => {
    fetchMeals();
    if (user?.type === 'admin') {
      fetchNewsletters();
    }
  }, []);

  /**
 * @api {method} handleMealAdded Handle Meal Added
 * @apiGroup Profile
 * @apiDescription Refreshes meals list after a new meal is added.
 */
  const handleMealAdded = () => {
    fetchMeals(); // Refresh the list when a new meal is added
  };


  /**
 * @api {method} handleMealDeleted Handle Meal Deleted
 * @apiGroup Profile
 * @apiDescription Removes a deleted meal from the local state.
 *
 * @apiParam {Number} id ID of the deleted meal
 */
  const handleMealDeleted = (id) => {
    setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id));
  };


  /**
 * @api {method} renderTabContent Render Tab Content
 * @apiGroup Profile
 * @apiDescription Renders the appropriate content based on active tab.
 *
 * @apiSuccess {Component} Returns component for the active tab:
 * - 'mealPackages': Shows meal management panel
 * - 'orderTracking': Shows order tracking component
 * - 'newsletter': Shows newsletter management tools
 */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'mealPackages':
        return (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
              <AdminAddMealPanel onMealAdded={handleMealAdded} />
            </div>
            <div className="md:w-1/2">
              <MealPackagesList
                meals={meals}
                isLoading={isLoading}
                error={error}
                onMealDeleted={handleMealDeleted}
              />
            </div>
          </div>
        );
      case 'orderTracking':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tilauksien hallinnointi
            </h2>
            <AdminOrderTracking />
          </div>
        );
      case 'newsletter':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Uutiskirje
            </h2>
            <div className="mb-4">
              <AdminAddNewsletter onNewsletterAdded={fetchNewsletters} />
            </div>
            <div>
              <NewslettersList
                newsletters={newsletters}
                fetchNewsletters={fetchNewsletters}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {user?.type === 'admin' ? (
        <div className="m-2 space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('mealPackages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'mealPackages' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Ruokapaketit
              </button>
              <button
                onClick={() => setActiveTab('orderTracking')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orderTracking' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Tilaukset
              </button>
              <button
                onClick={() => setActiveTab('newsletter')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'newsletter' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Uutiskirje
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>{renderTabContent()}</div>
        </div>
      ) : (
        <UserProfile />
      )}
    </>
  );
};

export default Profile;

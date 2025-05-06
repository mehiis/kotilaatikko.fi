import {useState} from 'react';
import {fetchData} from '../Utils/fetchData';

// token check from local storage, returns boolean
const tokenInLocalStorage = () => {
  Boolean(localStorage.getItem('token'));
};

// make a table with the mediaArray

const useNewsletter = () => {
  const checkIfGuestSubscribed = async (email) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_AUTH_API + `/newsletter/${email}`,
        {
          method: 'GET',
        },
      );
      const result = await response.json();
      return result.isSubscribed;
    } catch (error) {
      console.error('Subscription check failed:', error);
      throw error;
    }
  };

  const subscribeAsGuest = async (email) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_AUTH_API + '/newsletter',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email}),
        },
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Subscription failed:', error);
      throw error;
    }
  };

  return {subscribeAsGuest, checkIfGuestSubscribed};
};

const useAuthentication = () => {
  let [isLoggedIn, setIsLoggedIn] = useState(false);

  const postLogin = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    const loginResult = await fetchData(
      import.meta.env.VITE_AUTH_API + '/auth/login',
      fetchOptions,
    );
    window.localStorage.setItem('token', loginResult.token);

    setIsLoggedIn(tokenInLocalStorage());

    return loginResult;
  };
  return {postLogin, isLoggedIn};
};

function useUser() {
  async function toggleSubscription() {
    try {
      const fetchOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      return await fetchData(
        import.meta.env.VITE_AUTH_API + '/newsletter',
        fetchOptions,
      );
    } catch (error) {
      console.error('error', error);
    }
  }

  async function getUserByToken() {
    try {
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      return await fetchData(
        import.meta.env.VITE_AUTH_API + '/auth/me',
        fetchOptions,
      );
    } catch (error) {
      console.error('error', error);
    }
  }

  async function checkEmailAvailability(email) {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_AUTH_API + `/users/available/${email}`,
        fetchOptions,
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error', errorData);
      }
      const data = await response.json();
      return data.available;
    } catch (error) {
      return {message: 'Something went wrong in checkEmailAvailability', error};
    }
  }

  async function postUser(inputs) {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_AUTH_API + '/users',
        fetchOptions,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async function getMyOrders(userId) {
    try {
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetch(
        import.meta.env.VITE_AUTH_API + `/orders/user/${userId}`,
        fetchOptions,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      return data.orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  return {getUserByToken, postUser, checkEmailAvailability, toggleSubscription, getMyOrders};
}

export {useAuthentication, useUser, useNewsletter};

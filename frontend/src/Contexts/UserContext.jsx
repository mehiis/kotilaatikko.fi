// UserContext.jsx
import {useEffect, useState} from 'react';
import {useAuthentication, useUser} from '../Hooks/apiHooks';
import {useNavigate, useLocation} from 'react-router';
import {createContext} from 'react';

const UserContext = createContext(null);

const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const {postLogin} = useAuthentication();
  const {getUserByToken} = useUser(); // token validation
  const navigate = useNavigate();
  const location = useLocation();

  // login, logout and autologin functions are here instead of components
  const handleLogin = async (credentials) => {
    const loginResult = await postLogin(credentials);
    localStorage.setItem('token', loginResult.token);
    setUser(loginResult.user);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // handleAutoLogin is used when the app is loaded to check if there is a valid token in local storage
  const handleAutoLogin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userResponse = await getUserByToken(token);
        setUser(userResponse.user);
        navigate(location.pathname);
      }
    } catch (e) {
      handleLogout();
      console.log(e.message);
    }
  };

  // useEffect to check if there is a token in local storage and if it is valid
  useEffect(() => {
    handleAutoLogin();
  }, []);

  const updateUser = (newUser) => setUser(newUser);

  return (
    <UserContext.Provider
      value={{user, updateUser, handleLogin, handleLogout, handleAutoLogin}}
    >
      {children}
    </UserContext.Provider>
  );
};

export {UserContext, UserProvider};

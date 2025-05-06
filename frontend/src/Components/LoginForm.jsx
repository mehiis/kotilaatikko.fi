import useForm from '../Hooks/formHooks';
import {useNavigate} from 'react-router';
import {useState} from 'react';
import {useUserContext} from '../Hooks/contextHooks';

const LoginForm = () => {
  // handle login function is imported from UserContext, goes to apiHooks to useAuthentication
  // and then to the backend to post the login data
  // and get the token and user data
  // the token is saved to local storage
  // and the user data is saved to the context
  // the user data is used to check if the user is logged in or not
  // the token is used to check if the user is logged in or not
  const {handleLogin} = useUserContext();

  const navigate = useNavigate();
  const [errors, setErrors] = useState('');

  const initValues = {
    email: '',
    password: '',
  };

  // Function to handle login
  const doLogin = async () => {
    try {
      await handleLogin(inputs);
      setErrors('');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors(' Väärä sähköposti tai salasana');
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doLogin,
    initValues,
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4 w-[100%] m-8 rounded-lg shadow-md max-w-md mx-auto relative">
        <h1 className="font-bold font-stretch-50%">Kirjaudu sisään</h1>
        <p className="m-1">Syötä sähköposti ja salasana kirjautuaksesi</p>
        {errors && (
          <div className=" border-red-400 text-red-700 px-4 py-3 rounded absolute mt-2 top-14">
            <strong className="font-bold">Virhe!</strong>
            <span className="block sm:inline">{errors}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="*:mt-6 p-2 w-full">
          {/* Email*/}
          <div>
            <label htmlFor="loginuser">Sähköposti*</label>
            <input
              className="p-3 border border-gray-500 rounded-lg mt-2 py-2 w-full"
              onChange={handleInputChange}
              type="email"
              id="loginuser"
              name="email"
              value={inputs.email}
              required
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="loginpassword">Salasana*</label>
            <input
              className="p-3 border border-gray-500 rounded-lg mt-2 py-2 w-full"
              name="password"
              type="password"
              id="loginpassword"
              onChange={handleInputChange}
              value={inputs.password}
              required
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <button
            className="bg-[var(--primary-color)] text-[var(--white-color)] rounded-4xl hover:bg-[var(--grey-color)] transition duration-300 w-full py-4 mt-6 font-medium"
            type="submit"
          >
            Kirjaudu sisään
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;

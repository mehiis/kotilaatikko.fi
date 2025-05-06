import {useNavigate} from 'react-router';
import {useUser} from '../Hooks/apiHooks';
import {useState} from 'react';
import useForm from '../Hooks/formHooks';

const RegisterForm = () => {
  const {postUser, checkEmailAvailability} = useUser();
  const [errors, setErrors] = useState({});
  const [emailAvailabilityError, setEmailAvailabilityError] = useState('');

  const navigate = useNavigate();

  const initValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  };

  const validateForm = () => {
    const newErrors = {};

    // Check each required field
    if (!inputs.first_name.trim())
      newErrors.first_name = 'First name is required';
    if (!inputs.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!inputs.email.trim()) newErrors.email = 'Email is required';
    if (!inputs.password) newErrors.password = 'Password is required';
    if (!inputs.phone.trim()) newErrors.phone = 'Phone is required';
    if (!inputs.address.trim()) newErrors.address = 'Address is required';
    if (!inputs.city.trim()) newErrors.city = 'City is required';
    if (!inputs.postal_code.trim())
      newErrors.postal_code = 'Postal code is required';

    // Email format validation
    if (inputs.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password strength (example)
    if (inputs.password && inputs.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const doRegister = async () => {
    if (!validateForm()) return;
    const isAvailable = await checkEmailAvailability(inputs.email);
    // console.log(isAvailable);
    if (!isAvailable) {
      setEmailAvailabilityError('Sähköposti varattu!');
      // console.log('email not available!');
      return;
    }
    setEmailAvailabilityError('');
    try {
      const userData = {
        ...inputs,
      };
      await postUser(userData);
      // console.log('Registration successful:', userResult);
      window.alert('Rekisteröinti onnistui!');
      navigate('/');

      // Redirect or show success message
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle API errors (like duplicate email)
      setErrors((prev) => ({...prev, apiError: error.message}));
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doRegister,
    initValues,
  );

  return (
    <>
      {errors.apiError && <div className="error">{errors.apiError}</div>}
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4 w-[100%] m-8 rounded-lg shadow-md max-w-4xl mx-auto relative">
        <h1 className="font-bold font-stretch-50%">Rekisteröidy</h1>
        <p className="m-1">Täytä alla olevat tiedot rekisteröityäksesi.</p>
        <p className="m-1">Kaikki kentät ovat pakollisia.</p>
        {emailAvailabilityError && (
          <h4 className="absolute top-22 text-red-500 font-medium text-lg mt-4">
            {emailAvailabilityError}
          </h4>
        )}
        <form
          onSubmit={handleSubmit}
          className="*:mt-6 p-2 grid sm:grid-cols-3 grid-cols-1 gap-4"
        >
          {/* First Name */}
          <div>
            <label htmlFor="first_name">Etunimi*</label>
            <input
              className="sm:col-span-3 col-span-1 p-3 border border-gray-500 rounded-lg mt-2 py-2 w-full"
              onChange={handleInputChange}
              type="text"
              id="first_name"
              name="first_name"
              value={inputs.first_name}
              required
            />
            {errors.first_name && (
              <span className="error">{errors.first_name}</span>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name">Sukunimi*</label>
            <input
              className="sm:col-span-3 col-span-1 p-3 border border-gray-500 rounded-lg mt-2 py-2 w-full"
              onChange={handleInputChange}
              type="text"
              id="last_name"
              name="last_name"
              value={inputs.last_name}
              required
            />
            {errors.last_name && (
              <span className="error">{errors.last_name}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email">Email*</label>
            <input
              className="sm:col-span-3 col-span-1 p-3 border border-gray-500 rounded-lg mt-2 py-2 w-full"
              onChange={handleInputChange}
              type="email"
              id="email"
              name="email"
              value={inputs.email}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password">Salasana* (min. 6 merkkiä)</label>
            <input
              className="sm:col-span-3 col-span-1 p-3 border border-gray-500 rounded-lg mt-2 py-2 w-full"
              name="password"
              type="password"
              id="password"
              onChange={handleInputChange}
              value={inputs.password}
              required
              minLength="6"
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone">Puhelin*</label>
            <input
              className="sm:col-span-3 col-span-1 p-3 border border-gray-500 rounded-lg mt-2 py-2 w-full"
              onChange={handleInputChange}
              type="tel"
              id="phone"
              name="phone"
              value={inputs.phone}
              required
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address">Osoite*</label>
            <input
              className="sm:col-span-3 col-span-1 p-3 border border-gray-500 rounded-lg mt-2 py-2 w-full"
              onChange={handleInputChange}
              type="text"
              id="address"
              name="address"
              value={inputs.address}
              required
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city">Kaupunki*</label>
            <input
              className="sm:col-span-3 col-span-1 p-3 border border-gray-500 rounded-lg mt-2 py-2 w-full"
              onChange={handleInputChange}
              type="text"
              id="city"
              name="city"
              value={inputs.city}
              required
            />
            {errors.city && <span className="error">{errors.city}</span>}
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="postal_code">Postinumero*</label>
            <input
              className="sm:col-span-3 col-span-1 p-3 border border-gray-500 rounded-lg mt-2 py-2 w-full"
              onChange={handleInputChange}
              type="text"
              id="postal_code"
              name="postal_code"
              value={inputs.postal_code}
              required
            />
            {errors.postal_code && (
              <span className="error">{errors.postal_code}</span>
            )}
          </div>

          <button
            className="bg-[var(--primary-color)] text-[var(--white-color)] rounded-4xl hover:bg-[var(--grey-color)] transition duration-300 w-full py-4 mt-6 font-medium"
            type="submit"
          >
            Rekisteröidy
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;

import React, {useContext, useRef, useState} from 'react';
import {UserContext} from '../Contexts/UserContext';
import {useNewsletter, useUser} from '../Hooks/apiHooks';

const NewsLetter = () => {
  const {user, updateUser} = useContext(UserContext);
  const {toggleSubscription} = useUser();
  const {subscribeAsGuest, checkIfGuestSubscribed} = useNewsletter();
  const emailRef = useRef();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const result = await toggleSubscription();
        // console.log(result);
        const updatedUser = result.updatedUser;
        updateUser(updatedUser); // rerender
        setMessage(
          updatedUser.subscribed
            ? 'Kiitos tilauksesta!'
            : 'Tilauksen peruutus onnistui.',
        );
      } catch (error) {
        setMessage('Jotain meni pieleen.');
        console.log(error);
      }
    } else {
      try {
        const email = e.target.email.value;
        const isSubscribed = await checkIfGuestSubscribed(email);
        if (isSubscribed) {
          setMessage('Olet jo tilannut uutiskirjeen.');
          emailRef.current && (emailRef.current.value = '');
          return;
        }
        await subscribeAsGuest(email);
        // console.log(result);
        setMessage('Kiitos tilauksesta!');
        emailRef.current && (emailRef.current.value = '');
      } catch (error) {
        setMessage('Jotain meni pieleen.');
        emailRef.current && (emailRef.current.value = '');
        console.log(error);
      }
    }

    setTimeout(() => {
      // clear message
      setMessage('');
    }, 2000);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center bg-gray-100 p-4 w-[100%] mt-4 relative"
      >
        <h2 className="text-2xl my-4 font-[header]">
          Tilaa uutiskirje ja saat -10% ensimmäisestä tilauksesta!
        </h2>
        {message && (
          <p className="font-medium mb-4 transition-all duration-300 absolute top-1">
            {message}
          </p>
        )}
        {!user && (
          <div className="text-center justify-center items-center mb-4 grid sm:grid-cols-4 gap-4 grid-cols-1">
            <input
              ref={emailRef}
              type="email"
              name="email"
              placeholder="Sähköpostiosoite"
              className="sm:col-span-3 col-span-1 p-4 border border-gray-300 rounded-3xl m-2.5 py-3 w-full"
            />
            <button
              type="submit"
              className="sm:col-span-1 col-span-1 bg-[var(--primary-color)] text-[var(--white-color)] rounded-3xl hover:bg-[var(--grey-color)] transition duration-300 px-7 py-3 w-full"
            >
              Tilaa uutiskirje
            </button>
          </div>
        )}
        {user && (
          <>
            <button
              type="submit"
              className="sm:col-span-1 col-span-1 bg-[var(--primary-color)] text-[var(--white-color)] rounded-3xl hover:bg-[var(--grey-color)] transition duration-300 px-7 py-3 w-screen max-w-[300px] text-center"
            >
              {user.subscribed ? 'Peru uutiskirje' : 'Tilaa uutiskirje'}
            </button>
          </>
        )}
      </form>
    </>
  );
};

export default NewsLetter;

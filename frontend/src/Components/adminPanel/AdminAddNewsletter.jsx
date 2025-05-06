import {useState} from 'react';

const AdminAddNewsletter = ({onNewsletterAdded}) => {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('content', formData.content);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    // console.log('FormData contents:');
    for (const [key, value] of formDataToSend.entries()) {
      // console.log(`${key}:`, value);
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_AUTH_API + '/newsletter/modify',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataToSend,
        },
      );
      if (!response.ok) {
        throw new Error('Failed to add newsletter');
      }
      alert('Uutiskirje lisätty onnistuneesti!');
      setFormData({subject: '', content: '', image: null});
      if (onNewsletterAdded) {
        onNewsletterAdded();
      }
    } catch (error) {
      console.error(error);
      alert('Virhe uutiskirjeen lisäämisessä');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Lisää uutiskirje
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="subject"
          >
            Aihe
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData({...formData, subject: e.target.value})
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="content"
          >
            Sisältö
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({...formData, content: e.target.value})
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="image"
          >
            Kuva
          </label>
          <input
            type="file"
            id="image"
            onChange={(e) =>
              setFormData({...formData, image: e.target.files[0]})
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Lisää uutiskirje tietokantaan
        </button>
      </form>
    </div>
  );
};

export {AdminAddNewsletter};

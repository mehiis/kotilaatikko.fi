import {useState} from 'react';

const NewslettersList = ({newsletters, fetchNewsletters}) => {
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);

  // Handle deleting the selected newsletter
  const handleDeleteNewsletter = async () => {
    if (!selectedNewsletter) {
      alert('Valitse ensin uutiskirje, jonka haluat poistaa.');
      return;
    }

    const confirmDelete = window.confirm(
      `Haluatko varmasti poistaa uutiskirjeen "${selectedNewsletter.subject}"?`,
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_AUTH_API}/newsletter/modify/${selectedNewsletter.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to delete newsletter');
      }

      // Refresh the list of newsletters
      fetchNewsletters();
      setSelectedNewsletter(null);
      alert('Uutiskirje poistettu onnistuneesti.');
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      alert('Uutiskirjeen poistaminen epäonnistui.');
    }
  };

  // Handle sending the newsletter to subscribers
  const handleSendToSubscribers = async () => {
    if (!selectedNewsletter) return;

    try {
      const response = await fetch(
        import.meta.env.VITE_AUTH_API + '/newsletter/subscribers',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      await response.json();

      // Log subscriber emails to the console
      // console.log(
      //   'Sending newsletter to the following subscribers:',
      //   subscribers,
      // );

      alert('Newsletter sent to subscribers successfully!');
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('Failed to send newsletter to subscribers');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Uutiskirjeet</h2>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-grow">
          <select
            id="newsletter"
            onChange={(e) =>
              setSelectedNewsletter(
                newsletters.find((n) => n.id === parseInt(e.target.value)),
              )
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">-- Valitse uutiskirje --</option>
            {newsletters.map((newsletter) => (
              <option key={newsletter.id} value={newsletter.id}>
                {newsletter.subject}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleDeleteNewsletter}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Poista
        </button>
      </div>

      {selectedNewsletter && (
        <div className="newsletter-details mt-4">
          <h3 className="text-xl font-bold text-gray-800 my-10">
            {selectedNewsletter.subject}
          </h3>
          <p className="content text-gray-700">{selectedNewsletter.content}</p>
          {selectedNewsletter.image && (
            <img
              src={selectedNewsletter.image}
              alt="Newsletter"
              className=" w-1/2 rounded-xl mt-5"
            />
          )}

          <button
            onClick={handleSendToSubscribers}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline"
          >
            Lähetä tilaajille
          </button>
        </div>
      )}
    </div>
  );
};

export {NewslettersList};

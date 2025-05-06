

import Hero from '../Components/Hero.jsx';


const Home = () => {

  return (
    <>
      {/* Hero Section */}
      <Hero />
      <div className="py-12 rounded-2xl mt-8">
        <h1 className="font-[header] text-5xl text-center text-gray-800 mb-6">
          Tervetuloa kotilaatikkoon!
        </h1>

        <div className="p-6 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Tuoreena pakatut ainesosat suoraan kotiisi, kokkaamista vaille valmista.
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Kotilaatikko.fi on suunniteltu sinulle, joka haluat syödä hyvin, mutta ilman ylimääräistä stressiä. Me
            toimitamme herkulliset ja ravitsevat ateriat kotiovellesi – valmiiksi suunniteltuna ja korkealaatuisista
            raaka-aineista. Voit tilata yksittäisen aterian tai ruoat koko viikoksi. Jokainen toimitus sisältää
            selkeät reseptit, joten ruoanlaitto on rentoa ja vaivatonta.
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Unohda ruokaostosten suunnittelu ja tuntikausien reseptien selaaminen – nauti kotiruoasta, jonka
            valmistaminen on yhtä helppoa kuin sen tilaaminen!
          </p>
        </div>
      </div>

      {/* Three-Phase Introduction Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-10  rounded-xl shadow-s flex flex-col items-center justify-center bg-gray-50 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-7xl font-[header] text-[var(--primary-color)] mb-6">1</h3>
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Valitse annokset</h4>
            <p className="text-lg text-gray-600">
              Tutustu viikoittain vaihtuvaan valikoimaamme ja valitse suosikkisi – yksi ateria tai koko viikon ruoat.
            </p>
          </div>
          <div className="p-10  rounded-xl shadow-sm flex flex-col items-center justify-center bg-gray-50 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-7xl font-[header] text-[var(--primary-color)] mb-6">2</h3>
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Vastaanota toimitus</h4>
            <p className="text-lg text-gray-600">
              Toimitamme ainekset ja selkeät reseptit kotiovellesi valitsemanasi ajankohtana.
            </p>
          </div>
          <div className="p-10  rounded-xl shadow-sm flex flex-col items-center justify-center bg-gray-50 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-7xl font-[header] text-[var(--primary-color)] mb-6">3</h3>
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Valmista ja nauti</h4>
            <p className="text-lg text-gray-600">
              Valmista ateriat helposti ohjeidemme avulla ja nauti hyvästä ruuasta ilman kiirettä tai vaivaa.
            </p>
          </div>
        </div>
      </div>


    </>
  );
};

export default Home;

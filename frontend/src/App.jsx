import { Link } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Alientech CRM - Home
      </h1>
      <Link
        to="/contacts"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Ver Contactos
      </Link>
    </div>
  );
}

export default App;

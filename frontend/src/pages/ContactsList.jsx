import React, { useState, useEffect } from "react";
import axios from "axios";

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/contacts");
        setContacts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar contactos");
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Lista de Contactos</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Apellido</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{contact.firstName}</td>
                <td className="py-2 px-4 border-b">
                  {contact.lastName || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">{contact.email}</td>
                <td className="py-2 px-4 border-b">{contact.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactsList;

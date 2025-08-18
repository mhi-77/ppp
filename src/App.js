import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Configura Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [query, setQuery] = useState(""); // Estado para la búsqueda
  const [data, setData] = useState([]); // Estado para almacenar los resultados
  const [loading, setLoading] = useState(false); // Estado para indicar carga

  // Función para consultar la base de datos
  const fetchData = async () => {
    if (!query.trim()) {
      // Si el campo de búsqueda está vacío, no realiza la consulta
      setData([]);
      return;
    }

    setLoading(true);
    const normalizedQuery = query.trim().toLowerCase(); // Normaliza la búsqueda
    const numericQuery = Number(query.trim()); // Convierte la entrada a número

    try {
      let dataDocumento = [];
      let dataApellido = [];

      // Consulta 1: Buscar en "DOCUMENTO" (ahora numérico)
      if (!isNaN(numericQuery)) {
        const { data, error } = await supabase
          .from("bd_padron25")
          .select("DOCUMENTO, APELLIDO, NOMBRE, SEXO, CLASE, CIRCUITO, ORDEN, MESA, LOCALIDAD")
          .eq("DOCUMENTO", numericQuery) // Búsqueda exacta en "DOCUMENTO"
          .limit(50); // Limitar a 50 resultados

        if (error) {
          console.error("Error al buscar por DOCUMENTO:", error.message);
        } else {
          dataDocumento = data;
        }
      }

      // Consulta 2: Buscar en "APELLIDO"
      const { data, error } = await supabase
        .from("bd_padron25")
        .select("DOCUMENTO, APELLIDO, NOMBRE, SEXO, CLASE, CIRCUITO, ORDEN, MESA, LOCALIDAD")
        .ilike("APELLIDO", `%${normalizedQuery}%`) // Búsqueda insensible a mayúsculas/minúsculas
        .order("APELLIDO", { ascending: true }) // Orden ascendente por APELLIDO
        .limit(50); // Limitar a 50 resultados

      if (error) {
        console.error("Error al buscar por APELLIDO:", error.message);
      } else {
        dataApellido = data;
      }

      // Combinar los resultados de ambas consultas
      const combinedResults = [...dataDocumento, ...dataApellido];

      // Eliminar duplicados usando un Set basado en el campo único "DOCUMENTO"
      const uniqueResults = Array.from(
        new Map(combinedResults.map(item => [item.DOCUMENTO, item])).values()
      );

      console.log("Datos obtenidos:", uniqueResults); // Verifica los datos en la consola
      setData(uniqueResults);
    } catch (err) {
      console.error("Error inesperado:", err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Llama a fetchData cuando el componente se monta
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Interfaz de Consulta</h1>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Buscar por apellido o documento..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Buscar
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-600">Cargando...</p>
        )}

        {!loading && data.length > 0 && (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text- text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-2 py-2">Documento</th>
                  <th scope="col" className="px-2 py-2">Apellido</th>
                  <th scope="col" className="px-2 py-2">Nombre</th>
                  <th scope="col" className="px-2 py-2">Sexo</th>
                  <th scope="col" className="px-2 py-2">Clase</th>
                  <th scope="col" className="px-2 py-2">Circuito</th>
                  <th scope="col" className="px-2 py-2">Orden</th>
                  <th scope="col" className="px-2 py-2">Mesa</th>
                  <th scope="col" className="px-2 py-2">Localidad</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.DOCUMENTO} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item.DOCUMENTO}
                    </td>
                    <td className="px-2 py-2">{item.APELLIDO}</td>
                    <td className="px-2 py-2">{item.NOMBRE}</td>
                    <td className="px-2 py-2">{item.SEXO}</td>
                    <td className="px-2 py-2">{item.CLASE}</td>
                    <td className="px-2 py-2">{item.CIRCUITO}</td>
                    <td className="px-2 py-2">{item.ORDEN}</td>
                    <td className="px-2 py-2">{item.MESA}</td>
                    <td className="px-2 py-2">{item.LOCALIDAD}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && data.length === 0 && (
          <p className="text-center text-gray-600">No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}
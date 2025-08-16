/*import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

// Obtener las credenciales de Supabase desde las variables de entorno
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Chequea si hubo error
if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las variables de entorno para Supabase.");
}

// Inicializar el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [query, setQuery] = useState(""); // Estado para la búsqueda
  const [data, setData] = useState([]); // Estado para almacenar los resultados
  const [loading, setLoading] = useState(false); // Estado para indicar carga

  // Función para consultar la base de datos
const fetchData = async () => {
    setLoading(true);
    const normalizedQuery = query.trim().toLowerCase(); // Normaliza la búsqueda
    try {
      const { data, error } = await supabase
        .from("bd_padron") // Usa el nombre correcto de tu tabla
        .select("*")
        .or(
           `"NOMBRE".ilike.%${normalizedQuery}%, "APELLIDO".ilike.%${normalizedQuery}%`
        );

      if (error) {
        console.error("Error al obtener datos:", error.message);
      } else {
        console.log("Datos obtenidos:", data); // Verifica los datos en la consola
        setData(data);
      }
    } catch (err) {
      console.error("Error inesperado:", err.message);
    } finally {
      setLoading(false);
    }
  };
  // Carga inicial de datos cuando la aplicación se monta
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Interfaz de Consulta
        </h1>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            id="search-input" // Agregamos un ID único
            name="search"     // Agregamos un nombre
            placeholder="Buscar por nombre o apellido..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
          <div className="space-y-2">
            {data.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {item.apellido}, {item.nombre}
                  </p>
                  <p className="text-sm text-gray-600">
                    Clase: {item.clase}, Circuito: {item.circuito}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {!loading && data.length === 0 && (
          <p className="text-center text-gray-600">No se encontraron resultados.</p>
        )}
      </motion.div>
    </div>
  );
}
  */


/*
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Configura Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las variables de entorno para Supabase.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [query, setQuery] = useState(""); // Estado para la búsqueda
  const [data, setData] = useState([]); // Estado para almacenar los resultados
  const [loading, setLoading] = useState(false); // Estado para indicar carga

  // Función para consultar la base de datos
  const fetchData = async () => {
    if (!query.trim()) {
      // Si el campo de búsqueda está vacío, no realiza la consulta
      setData([]); // Limpia los resultados anteriores
      return;
    }

    setLoading(true);
    const normalizedQuery = query.trim().toLowerCase(); // Normaliza la búsqueda

    try {
      // Consulta 1: Buscar en "DOCUMENTO" (convertido a texto)
      const { data: dataDocumento, error: errorDocumento } = await supabase
        .from("bd_padron")
        .select("DOCUMENTO, APELLIDO, NOMBRE, SEXO, CLASE, CIRCUITO, ORDEN, MESA, LOCALIDAD")
        .textSearch("DOCUMENTO", `${normalizedQuery}:*`); // Búsqueda parcial en "DOCUMENTO"

      if (errorDocumento) {
        console.error("Error al buscar por DOCUMENTO:", errorDocumento.message);
      }

      // Consulta 2: Buscar en "APELLIDO"
      const { data: dataApellido, error: errorApellido } = await supabase
        .from("bd_padron")
        .select("DOCUMENTO, APELLIDO, NOMBRE, SEXO, CLASE, CIRCUITO, ORDEN, MESA, LOCALIDAD")
        .ilike("APELLIDO", `%${normalizedQuery}%`); // Búsqueda insensible a mayúsculas/minúsculas

      if (errorApellido) {
        console.error("Error al buscar por APELLIDO:", errorApellido.message);
      }

      // Combinar los resultados de ambas consultas
      const combinedResults = [
        ...(dataDocumento || []),
        ...(dataApellido || [])
      ];

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

  // Manejador para detectar la tecla "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData(); // Ejecuta la consulta si se presiona "Enter"
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Interfaz de Consulta
        </h1>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            id="search-input"
            name="search"
            placeholder="Buscar por apellido o documento..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Detecta la tecla "Enter"
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
        {!loading && Array.isArray(data) && data.length > 0 && (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Documento</th>
                <th scope="col" className="px-6 py-3">Apellido</th>
                <th scope="col" className="px-6 py-3">Nombre</th>
                <th scope="col" className="px-6 py-3">Sexo</th>
                <th scope="col" className="px-6 py-3">Clase</th>
                <th scope="col" className="px-6 py-3">Circuito</th>
                <th scope="col" className="px-6 py-3">Orden</th>
                <th scope="col" className="px-6 py-3">Mesa</th>
                <th scope="col" className="px-6 py-3">Localidad</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.DOCUMENTO} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{item.DOCUMENTO}</td>
                  <td className="px-6 py-4">{item.APELLIDO}</td>
                  <td className="px-6 py-4">{item.NOMBRE}</td>
                  <td className="px-6 py-4">{item.SEXO}</td>
                  <td className="px-6 py-4">{item.CLASE}</td>
                  <td className="px-6 py-4">{item.CIRCUITO}</td>
                  <td className="px-6 py-4">{item.ORDEN}</td>
                  <td className="px-6 py-4">{item.MESA}</td>
                  <td className="px-6 py-4">{item.LOCALIDAD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && Array.isArray(data) && data.length === 0 && (
          <p className="text-center text-gray-600">No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}

*/

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
    setData([]); // Limpia los resultados anteriores
    return;
  }

  setLoading(true);
  const normalizedQuery = query.trim().toLowerCase(); // Normaliza la búsqueda

  try {
    // Consulta 1: Buscar en "DOCUMENTO" (convertido a texto)
    const { data: dataDocumento, error: errorDocumento } = await supabase
      .from("bd_padron")
      .select("DOCUMENTO, APELLIDO, NOMBRE, SEXO, CLASE, CIRCUITO, ORDEN, MESA, LOCALIDAD")
      .textSearch("DOCUMENTO", `${normalizedQuery}:*`) // Búsqueda parcial en "DOCUMENTO"
      .limit(50); // Limitar a 50 resultados

    if (errorDocumento) {
      console.error("Error al buscar por DOCUMENTO:", errorDocumento.message);
    }

    // Consulta 2: Buscar en "APELLIDO"
    const { data: dataApellido, error: errorApellido } = await supabase
      .from("bd_padron")
      .select("DOCUMENTO, APELLIDO, NOMBRE, SEXO, CLASE, CIRCUITO, ORDEN, MESA, LOCALIDAD")
      .ilike("APELLIDO", `%${normalizedQuery}%`) // Búsqueda insensible a mayúsculas/minúsculas
      .order("APELLIDO", { ascending: true }) // Orden ascendente por APELLIDO
      .limit(50); // Limitar a 50 resultados

    if (errorApellido) {
      console.error("Error al buscar por APELLIDO:", errorApellido.message);
    }

    // Combinar los resultados de ambas consultas
    const combinedResults = [
      ...(dataDocumento || []),
      ...(dataApellido || [])
    ];

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
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl"> {/* Ancho máximo más grande */}
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Interfaz de Consulta</h1>
    <div className="flex space-x-2 mb-4"> {/* Cuadro de búsqueda y botón */}
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
      <th scope="col" className="px-2 py-2">Documento</th>{/* Cambiado a px-2 */}
      <th scope="col" className="px-2 py-2">Apellido</th>{/* Cambiado a px-2 */}
      <th scope="col" className="px-2 py-2">Nombre</th>{/* Cambiado a px-2 */}
      <th scope="col" className="px-2 py-2">Sexo</th>{/* Cambiado a px-2 */}
      <th scope="col" className="px-2 py-2">Clase</th>{/* Cambiado a px-2 */}
      <th scope="col" className="px-2 py-2">Circuito</th>{/* Cambiado a px-2 */}
      <th scope="col" className="px-2 py-2">Orden</th>{/* Cambiado a px-2 */}
      <th scope="col" className="px-2 py-2">Mesa</th>{/* Cambiado a px-2 */}
      <th scope="col" className="px-2 py-2">Localidad</th>{/* Cambiado a px-2 */}
    </tr>
  </thead>
  <tbody>
    {data.map((item) => (
      <tr key={item.DOCUMENTO} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {item.DOCUMENTO}
        </td>{/* Cambiado a px-2 */}
        <td className="px-2 py-2">{item.APELLIDO}</td>{/* Cambiado a px-2 */}
        <td className="px-2 py-2">{item.NOMBRE}</td>{/* Cambiado a px-2 */}
        <td className="px-2 py-2">{item.SEXO}</td>{/* Cambiado a px-2 */}
        <td className="px-2 py-2">{item.CLASE}</td>{/* Cambiado a px-2 */}
        <td className="px-2 py-2">{item.CIRCUITO}</td>{/* Cambiado a px-2 */}
        <td className="px-2 py-2">{item.ORDEN}</td>{/* Cambiado a px-2 */}
        <td className="px-2 py-2">{item.MESA}</td>{/* Cambiado a px-2 */}
        <td className="px-2 py-2">{item.LOCALIDAD}</td>{/* Cambiado a px-2 */}
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
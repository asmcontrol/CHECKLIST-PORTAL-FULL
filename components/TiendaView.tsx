import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function TiendaView({ tienda }: { tienda: string }) {
  const [datos, setDatos] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const docRef = doc(db, 'checklists', tienda);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setDatos(snapshot.data());
      } else {
        await setDoc(docRef, { proveedor: {}, tienda: {}, auditor: {} });
        setDatos({ proveedor: {}, tienda: {}, auditor: {} });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (id: number, campo: string, valor: string) => {
    const updated = {
      ...datos,
      tienda: {
        ...datos.tienda,
        [id]: {
          ...datos.tienda?.[id],
          [campo]: valor,
        },
      },
    };
    setDatos(updated);
    setDoc(docRef, updated);
  };

  if (loading) return <p>Cargando checklist...</p>;

  const renderFila = (
    id: number,
    pregunta: string,
    seccion: 'proveedor' | 'tienda' | 'auditor'
  ) => {
    const respuestas = datos?.[seccion]?.[id] || {};
    const editable = seccion === 'tienda';

    return (
      <tr key={id}>
        <td>{id}</td>
        <td>{pregunta}</td>
        <td>
          <input
            type="radio"
            name={`p${id}`}
            checked={respuestas.valor === 'sí'}
            disabled={!editable}
            onChange={() => handleChange(id, 'valor', 'sí')}
          />
        </td>
        <td>
          <input
            type="radio"
            name={`p${id}`}
            checked={respuestas.valor === 'no'}
            disabled={!editable}
            onChange={() => handleChange(id, 'valor', 'no')}
          />
        </td>
        <td>
          <input
            type="text"
            value={respuestas.observacion || ''}
            disabled={!editable}
            onChange={(e) => handleChange(id, 'observacion', e.target.value)}
            placeholder="Observación..."
            style={{ width: '100%' }}
          />
        </td>
      </tr>
    );
  };

  const secciones = [
    {
      titulo: '3. Estado y Organización de la Mercadería',
      ids: [10, 11, 12, 13, 14],
      seccion: 'tienda',
      preguntas: [
        '¿La mercadería está correctamente etiquetada con código de barras o SKU?',
        '¿Los productos están organizados por categoría y ubicación (estantes, perchas, góndolas)?',
        '¿Los artículos fuera de lugar están identificados o separados?',
        '¿Los productos en bodega están clasificados y ordenados?',
        '¿Están identificados los productos en mal estado o fuera de sistema?',
      ],
    },
    {
      titulo: '5. Apoyo y Coordinación con Personal Interno',
      ids: [21, 22, 23, 24, 25, 26, 27, 28],
      seccion: 'tienda',
      preguntas: [
        '¿Se cuenta con apoyo del personal de tienda para resolver dudas?',
        '¿Se realizó una reunión previa con el encargado de tienda?',
        '¿Se informó al personal interno sobre el inventario y su rol?',
        '¿Está designado un responsable o supervisor de tienda durante el proceso?',
        '¿Se encuentra definido un punto de contacto entre supervisor de tienda y externo?',
        '¿Se cuenta con un plan de cierre parcial o total (si aplica) validado?',
        '¿Se recibió la aprobación del cliente para iniciar el inventario?',
        '¿Se confirmó el cronograma de inventario?',
      ],
    },
    {
      titulo: '6. Seguridad y Normativas',
      ids: [29, 30, 31, 32, 33, 34, 35],
      seccion: 'tienda',
      preguntas: [
        '¿Están disponibles los materiales de seguridad (chalecos, credenciales, etc.)?',
        '¿Todo el personal externo porta identificación visible (credencial con nombre y RUT/DNI)?',
        '¿Se registró el ingreso del personal externo (nombre, hora de entrada y salida)?',
        '¿El personal está informado sobre las normas internas de la tienda?',
        '¿Se prohíbe manipular productos que no forman parte del conteo sin autorización?',
        '¿Se restringe el acceso a áreas no habilitadas (cajas, oficinas, vestidores)?',
        '¿El personal utiliza uniforme, chaleco o distintivo entregado por la empresa?',
      ],
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Checklist de Verificación para Inventario - Tienda</h2>

      {secciones.map((sec) => (
        <div key={sec.titulo} style={{ marginTop: '2rem' }}>
          <h3>{sec.titulo}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1}>
            <thead>
              <tr>
                <th>N°</th>
                <th>Pregunta</th>
                <th>Sí</th>
                <th>No</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {sec.ids.map((id, index) =>
                renderFila(id, sec.preguntas[index], sec.seccion as any)
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}



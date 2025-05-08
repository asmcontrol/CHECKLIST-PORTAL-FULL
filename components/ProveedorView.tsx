import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function ProveedorView({ tienda }: { tienda: string }) {
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
      proveedor: {
        ...datos.proveedor,
        [id]: {
          ...datos.proveedor?.[id],
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
    const editable = seccion === 'proveedor';

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
      titulo: '1. Datos Generales',
      ids: [1, 2, 3, 4, 5],
      seccion: 'proveedor',
      preguntas: [
        '¿Está identificado el nombre de la tienda o sucursal?',
        '¿Se encuentra registrada la dirección completa del local?',
        '¿Está identificado el nombre del encargado de tienda?',
        '¿Está registrada la fecha y hora de la visita?',
        '¿Se indicó la fecha programada para el inventario?',
      ],
    },
    {
      titulo: '2. Condiciones Generales del Local',
      ids: [6, 7, 8, 9],
      seccion: 'proveedor',
      preguntas: [
        '¿Hay acceso libre y seguro al local en el horario acordado?',
        '¿La iluminación es adecuada en todas las áreas (venta, bodega, probadores)?',
        '¿Los espacios de tránsito están libres de obstáculos (pasillos, accesos, etc.)?',
        '¿El local cuenta con climatización o ventilación adecuada para el equipo de trabajo?',
      ],
    },
    {
      titulo: '4. Infraestructura Tecnológica',
      ids: [15, 16, 17, 18, 19, 20],
      seccion: 'proveedor',
      preguntas: [
        '¿Hay disponibilidad de energía eléctrica para dispositivos de inventario?',
        '¿Existe un punto de conexión a red o WiFi para el sistema online (si aplica)?',
        '¿Hay un espacio habilitado para el centro de control (mesa, enchufes, sillas)?',
        '¿Se verificaron los dispositivos de lectura/captura (PDT, escáneres, tablets)?',
        '¿Se revisaron baterías, cargadores y conectividad antes de iniciar?',
        '¿Se asignó un equipo de trabajo o dispositivo por persona?',
      ],
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Checklist de Verificación para Inventario - Formato Sí / No</h2>

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





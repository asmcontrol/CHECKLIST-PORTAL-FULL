import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function AuditorView({ tienda }: { tienda: string }) {
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
      auditor: {
        ...datos.auditor,
        [id]: {
          ...datos.auditor?.[id],
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
    const editable = seccion === 'auditor';

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
      titulo: '7. Ejecución del Inventario',
      ids: [36, 37, 38, 39, 40, 41, 42],
      seccion: 'auditor',
      preguntas: [
        '¿Cada miembro del equipo tiene asignada una zona de conteo?',
        '¿Los supervisores están informados y presentes en zonas críticas?',
        '¿Se entregaron instrucciones específicas para zonas de difícil acceso o productos delicados?',
        '¿Se realizó una inducción al inicio del turno y al cierre de jornada?',
        '¿Se verificó y confirmó la fecha, hora y duración del inventario con la empresa externa?',
        '¿Se recibió al equipo de inventario y se validó su identidad según listado previo?',
        '¿Se coordinaron accesos a todas las áreas necesarias del local?',
      ],
    },
    {
      titulo: '8. Supervisión y Comunicación',
      ids: [43, 44, 45, 46, 47],
      seccion: 'auditor',
      preguntas: [
        '¿Se encuentra definida una vía de comunicación para incidentes o alertas (teléfono, WhatsApp)?',
        '¿El responsable de tienda o jefe de inventario supervisa directamente el proceso?',
        '¿La tienda garantiza soporte inmediato ante emergencias (electricidad, seguridad, etc.)?',
        '¿Se supervisa el comportamiento del personal externo dentro del local?',
        '¿Se controla el cumplimiento del cronograma y se reportan atrasos o incidentes?',
      ],
    },
    {
      titulo: '9. Cierre del Inventario',
      ids: [48, 49, 50, 51],
      seccion: 'auditor',
      preguntas: [
        '¿Se revisan diferencias o incidencias detectadas junto al supervisor del equipo externo?',
        '¿Se confirma la finalización del inventario y se firma el acta o informe correspondiente?',
        '¿Se coordina el retiro del equipo externo y se verifica que todo quede en orden?',
        '¿Se informa a administración central o área de operaciones sobre los resultados?',
      ],
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Checklist de Verificación para Inventario - Auditor</h2>

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


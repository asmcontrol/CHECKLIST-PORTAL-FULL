import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function ChecklistResumen({ tienda }: { tienda: string }) {
  const [datos, setDatos] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const docRef = doc(db, 'checklists', tienda);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setDatos(snapshot.data());
      } else {
        setDatos({ proveedor: {}, tienda: {}, auditor: {} });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p>Cargando resumen...</p>;

  const renderFila = (id: number, pregunta: string) => {
    const seccion =
      id <= 5 || (id >= 6 && id <= 9) || (id >= 15 && id <= 20)
        ? 'proveedor'
        : id >= 10 && id <= 14 || (id >= 21 && id <= 28) || (id >= 29 && id <= 35)
        ? 'tienda'
        : 'auditor';

    const respuestas = datos?.[seccion]?.[id] || {};

    return (
      <tr key={id}>
        <td>{id}</td>
        <td>{pregunta}</td>
        <td>{respuestas.valor === 'sí' ? '✔️' : respuestas.valor === 'no' ? '❌' : ''}</td>
        <td>{respuestas.observacion || ''}</td>
        <td>{seccion}</td>
      </tr>
    );
  };

  const todasLasPreguntas: { id: number; texto: string }[] = [
    // Datos Generales
    '¿Está identificado el nombre de la tienda o sucursal?',
    '¿Se encuentra registrada la dirección completa del local?',
    '¿Está identificado el nombre del encargado de tienda?',
    '¿Está registrada la fecha y hora de la visita?',
    '¿Se indicó la fecha programada para el inventario?',

    // Condiciones Generales del Local
    '¿Hay acceso libre y seguro al local en el horario acordado?',
    '¿La iluminación es adecuada en todas las áreas (venta, bodega, probadores)?',
    '¿Los espacios de tránsito están libres de obstáculos (pasillos, accesos, etc.)?',
    '¿El local cuenta con climatización o ventilación adecuada para el equipo de trabajo?',

    // Estado y Organización de la Mercadería
    '¿La mercadería está correctamente etiquetada con código de barras o SKU?',
    '¿Los productos están organizados por categoría y ubicación (estantes, perchas, góndolas)?',
    '¿Los artículos fuera de lugar están identificados o separados?',
    '¿Los productos en bodega están clasificados y ordenados?',
    '¿Están identificados los productos en mal estado o fuera de sistema?',

    // Infraestructura Tecnológica
    '¿Hay disponibilidad de energía eléctrica para dispositivos de inventario?',
    '¿Existe un punto de conexión a red o WiFi para el sistema online (si aplica)?',
    '¿Hay un espacio habilitado para el centro de control (mesa, enchufes, sillas)?',
    '¿Se verificaron los dispositivos de lectura/captura (PDT, escáneres, tablets)?',
    '¿Se revisaron baterías, cargadores y conectividad antes de iniciar?',
    '¿Se asignó un equipo de trabajo o dispositivo por persona?',

    // Apoyo y Coordinación con Personal Interno
    '¿Se cuenta con apoyo del personal de tienda para resolver dudas?',
    '¿Se realizó una reunión previa con el encargado de tienda?',
    '¿Se informó al personal interno sobre el inventario y su rol?',
    '¿Está designado un responsable o supervisor de tienda durante el proceso?',
    '¿Se encuentra definido un punto de contacto entre supervisor de tienda y externo?',
    '¿Se cuenta con un plan de cierre parcial o total (si aplica) validado?',
    '¿Se recibió la aprobación del cliente para iniciar el inventario?',
    '¿Se confirmó el cronograma de inventario?',

    // Seguridad y Normativas
    '¿Están disponibles los materiales de seguridad (chalecos, credenciales, etc.)?',
    '¿Todo el personal externo porta identificación visible (credencial con nombre y RUT/DNI)?',
    '¿Se registró el ingreso del personal externo (nombre, hora de entrada y salida)?',
    '¿El personal está informado sobre las normas internas de la tienda?',
    '¿Se prohíbe manipular productos que no forman parte del conteo sin autorización?',
    '¿Se restringe el acceso a áreas no habilitadas (cajas, oficinas, vestidores)?',
    '¿El personal utiliza uniforme, chaleco o distintivo entregado por la empresa?',

    // Ejecución del Inventario
    '¿Cada miembro del equipo tiene asignada una zona de conteo?',
    '¿Los supervisores están informados y presentes en zonas críticas?',
    '¿Se entregaron instrucciones específicas para zonas de difícil acceso o productos delicados?',
    '¿Se realizó una inducción al inicio del turno y al cierre de jornada?',
    '¿Se verificó y confirmó la fecha, hora y duración del inventario con la empresa externa?',
    '¿Se recibió al equipo de inventario y se validó su identidad según listado previo?',
    '¿Se coordinaron accesos a todas las áreas necesarias del local?',

    // Supervisión y Comunicación
    '¿Se encuentra definida una vía de comunicación para incidentes o alertas (teléfono, WhatsApp)?',
    '¿El responsable de tienda o jefe de inventario supervisa directamente el proceso?',
    '¿La tienda garantiza soporte inmediato ante emergencias (electricidad, seguridad, etc.)?',
    '¿Se supervisa el comportamiento del personal externo dentro del local?',
    '¿Se controla el cumplimiento del cronograma y se reportan atrasos o incidentes?',

    // Cierre del Inventario
    '¿Se revisan diferencias o incidencias detectadas junto al supervisor del equipo externo?',
    '¿Se confirma la finalización del inventario y se firma el acta o informe correspondiente?',
    '¿Se coordina el retiro del equipo externo y se verifica que todo quede en orden?',
    '¿Se informa a administración central o área de operaciones sobre los resultados?',
  ].map((texto, index) => ({ id: index + 1, texto }));

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Resumen General del Checklist</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1}>
        <thead>
          <tr>
            <th>N°</th>
            <th>Pregunta</th>
            <th>Respuesta</th>
            <th>Observación</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {todasLasPreguntas.map((p) => renderFila(p.id, p.texto))}
        </tbody>
      </table>
    </div>
  );
}

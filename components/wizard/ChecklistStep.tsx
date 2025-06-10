import { useState, useEffect } from 'react';
import { db } from '@/firebase/firebaseConfig';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

const tiendaCampos = [
  'CÓDIGO DE TIENDA', 'TIENDA', 'EMPRESA', 'JEFE ZONAL', 'TIPO',
  'FECHA INVENTARIO', 'UNIDADES INFORMADAS', 'PISOS', 'BODEGAS',
  'HORARIO DE CIERRE', 'HORARIO DE APERTURA'
];

const visitaCampos = [
  'FECHA VISITA', 'HORA VISITA', 'ENCARGADO VISITA EMPRESA',
  'ENCARGADO TIENDA', 'CARGO ENCARGADO TIENDA', 'UNIDADES BODEGA APROX',
  'UNIDADES SALA APROX', 'HORARIO INICIO BODEGA', 'HORARIO INICIO SALA','TIENDA APTA LA TOMA'
];

const checklistPreguntas = [
  '¿La iluminación es adecuada en todas las áreas (venta, bodega, probadores)?',
  '¿Los espacios de tránsito están libres de obstáculos (pasillos, accesos, etc.)?',
  '¿El local cuenta con climatización o ventilación adecuada para el equipo de trabajo?',
  '¿La mercadería está correctamente etiquetada con código de barras o SKU?',
  '¿Los artículos fuera de lugar están identificados o separados?',
  '¿Los productos en bodega están clasificados y ordenados?',
  '¿Están identificados los productos en mal estado o fuera de sistema?',
  '¿La tienda y sus bodegas están en condiciones higiénicas adecuadas?',
  '¿La tienda cuenta con escaleras para los trabajos de altura?',
  '¿La tienda destina un área y sus implementos para la mesa de trabajo?',
  '¿Se envió la nómina de participantes a la tienda?',
  '¿Es necesaria segunda visita?'
];

const inventarioCampos: string[] = [
  'HORARIO DE LLEGADA BODEGA', 'HORARIO INICIO BODEGA', 'HORARIO DE LLEGADA SALA',
  'HORARIO DE ZONIFICACIÍÓN DE SALA', 'HORARIO INICIO SALA', 'DOTACION BODEGA',
  'DOTACIÓN SALA DE VENTAS', 'SUPERVISORES', 'ORPERADOR DE SISTEMAS',
  'DOTACION DE TIENDA', 'CUMPLE LOS ESTANDARES PARA LA TOMA DE INVENTARIO',
];

const verificacionFinalPreguntas = [
  '¿La empresa de inventarios cumplió con los horarios de llegada?',
  '¿La empresa de inventarios cumplió con la dotación acordada?',
  '¿La tienda estaba estaba preparada para el inicio de inventario?',
  '¿La empresa externa cuenta con los dispositivos necesario para la toma?',
  '¿La zonificaciión de la tienda se realiza con el encargado de tienda?',
  '¿Se Realiza la Zonificación de toda la tienda?',
  '¿Hay un espacio habilitado para el centro de control (mesa, enchufes, sillas)?',
  '¿Se cuenta con apoyo del personal de tienda para resolver dudas?',
  '¿Se realizó una reunión previa con el encargado de tienda?',
  '¿Se informó al personal interno sobre el inventario y su rol?',
  '¿Se prohíbe manipular productos que no forman parte del conteo sin autorización?',
  '¿Se informa el acceso a áreas no habilitadas (cajas, oficinas, vestidores)?',
  '¿Se realizó una inducción al inicio del turno y al cierre de jornada?',
  '¿Se encuentra definida una vía de comunicación para incidentes o alertas (teléfono, WhatsApp)?',
  '¿El responsable de tienda o jefe de inventario supervisa directamente el proceso?',
  '¿Se supervisa el comportamiento del personal externo dentro del local?',
  '¿Se controla el avance del inventario y se reportan atrasos o incidentes?',
  '¿Se revisan diferencias detectadas junto al supervisor del equipo externo?',
  '¿Se confirma la finalización del inventario y se firma el acta o informe correspondiente?',
  '¿Se coordina el retiro del equipo externo y se verifica que todo quede en orden?',
  '¿Empresa externa informa a Control de Existencias los resultados y envía archivos de inventario?',
];

type Props = {
  tienda: string;
  rol: 'jefe_tienda' | 'empresa_inventario' | 'auditor';
};

export default function ChecklistStep({ tienda, rol }: Props) {
  const [form, setForm] = useState<Record<string, string | boolean>>({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const docRef = doc(db, 'checklists', tienda);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const camposBase = {};
          tiendaCampos.slice(0, 7).forEach(campo => {
            if (data.tiendaInfo && data.tiendaInfo[campo]) {
              camposBase[campo] = data.tiendaInfo[campo];
            }
          });
          setForm(prev => ({ ...camposBase, ...data, ...prev }));
        }
      } catch (error) {
        console.error('Error cargando datos previos:', error);
      }
    };

    cargarDatos();
  }, [tienda]);

  const puedeEditar = (campo: string): boolean => {
    if (rol === 'auditor') return false;
    if (rol === 'empresa_inventario') {
      return visitaCampos.includes(campo) || checklistPreguntas.includes(campo);
    }
    if (rol === 'jefe_tienda') {
      return tiendaCampos.includes(campo) || inventarioCampos.includes(campo);
    }
    return true;
  };

  const handleInput = (campo: string, valor: string | boolean) => {
    if (!puedeEditar(campo)) return;

    const nuevoForm = { ...form, [campo]: valor };
    setForm(nuevoForm);

    const guardarProgreso = async () => {
      try {
        await setDoc(doc(db, 'checklists', tienda), nuevoForm, { merge: true });
      } catch (error) {
        console.error('Error guardando automáticamente:', error);
      }
    };

    guardarProgreso();
  };

  const renderPreguntasConOpciones = (preguntas: string[]) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: '8px', textAlign: 'left' }}>Pregunta</th>
          <th style={{ padding: '8px', textAlign: 'center' }}>Sí</th>
          <th style={{ padding: '8px', textAlign: 'center' }}>No</th>
        </tr>
      </thead>
      <tbody>
        {preguntas.map((pregunta) => (
          <tr key={pregunta} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '8px' }}>{pregunta}</td>
            <td style={{ textAlign: 'center' }}>
              <input
                type="radio"
                name={pregunta}
                checked={form[pregunta] === true}
                onChange={() => handleInput(pregunta, true)}
                disabled={!puedeEditar(pregunta)}
              />
            </td>
            <td style={{ textAlign: 'center' }}>
              <input
                type="radio"
                name={pregunta}
                checked={form[pregunta] === false}
                onChange={() => handleInput(pregunta, false)}
                disabled={!puedeEditar(pregunta)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const guardarEnFirebase = async () => {
    try {
      await setDoc(doc(db, 'checklists', tienda), {
        ...form,
        guardadoEn: Timestamp.now(),
      }, { merge: true });
      alert('✅ Datos guardados correctamente');
    } catch (e) {
      console.error('Error guardando:', e);
      alert('❌ Error al guardar los datos');
    }
  };

  const renderInput = (campo: string) => (
    <div key={campo} style={{ marginBottom: '10px' }}>
      <label>{campo}</label><br />
      <input
        type="text"
        value={(form[campo] as string) || ''}
        onChange={(e) => handleInput(campo, e.target.value)}
        disabled={!puedeEditar(campo)}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: puedeEditar(campo) ? '#fff' : '#eee',
          color: '#222'
        }}
      />
    </div>
  );

  const renderTextarea = (campo: string) => (
    <div key={campo} style={{ marginBottom: '10px' }}>
      <label>{campo}</label><br />
      <textarea
        value={(form[campo] as string) || ''}
        onChange={(e) => handleInput(campo, e.target.value)}
        disabled={!puedeEditar(campo)}
        style={{
          width: '100%',
          minHeight: '60px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: puedeEditar(campo) ? '#fff' : '#eee',
          color: '#222'
        }}
      />
    </div>
  );

  return (
    <div style={{ color: '#222' }}>
      <section>
        <h3 style={{ marginTop: '20px' }}>🛍️ Datos de Tienda</h3>
        {tiendaCampos.map(renderInput)}
      </section>

      <section>
        <h3 style={{ marginTop: '20px' }}>📋 Visita Previa</h3>
        {visitaCampos.map(renderInput)}
      </section>

      <section>
        <h3 style={{ marginTop: '20px' }}></h3>
        {renderPreguntasConOpciones(checklistPreguntas)}
      </section>

      <section>
        <h3 style={{ marginTop: '20px' }}>Inventario</h3>
        {inventarioCampos.map(renderTextarea)}
      </section>

      <section>
        <h3 style={{ marginTop: '20px' }}></h3>
        {renderPreguntasConOpciones(verificacionFinalPreguntas)}
      </section>

      <div style={{ marginTop: '30px', marginBottom: '30px' }}>
        <button
          onClick={guardarEnFirebase}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          💾 Guardar Checklist
        </button>
      </div>
    </div>
  );
}










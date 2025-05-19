// ChecklistCompleto.tsx con tabla única y secciones con fondo negro y texto blanco
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ChecklistCompleto({ tienda, rol }: { tienda: string; rol: 'jefe_tienda' | 'empresa_inventario' | 'auditor' }) {
  const [datos, setDatos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cartaAceptacion, setCartaAceptacion] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [urlArchivo, setUrlArchivo] = useState('');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [imagenesURLs, setImagenesURLs] = useState<string[]>([]);

  const docRef = doc(db, 'checklists', tienda);
  const storage = getStorage();

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setDatos(data);
        setUrlArchivo(data.archivoURL || '');
        setCartaAceptacion(data.cartaAceptacion || '');
        setImagenesURLs(data.archivosAdjuntos || []);
      } else {
        const dataInicial = {
          tiendaInfo: {}, visitaPrevia: {}, checklist: {}, inventario: {}, verificacionFinal: {}, cartaAceptacion: '', archivoURL: '', archivosAdjuntos: []
        };
        await setDoc(docRef, dataInicial);
        setDatos(dataInicial);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const updateDocField = async (field: string, value: any) => {
    const updated = { ...datos, [field]: value };
    setDatos(updated);
    await setDoc(docRef, updated);
  };

  const handleChange = (seccion: string, campo: any, valor: any) => {
    const updated = {
      ...datos,
      [seccion]: {
        ...datos[seccion],
        [campo]: valor,
      },
    };
    setDatos(updated);
    setDoc(docRef, updated);
  };

  const handleCheckbox = (seccion: string, campo: any, valor: string) => {
    const updated = {
      ...datos,
      [seccion]: {
        ...(datos[seccion] || {}),
        [campo]: valor,
      },
    };
    setDatos(updated);
    setDoc(docRef, updated);
  };

  const handleArchivoUpload = async () => {
    if (!archivo || !puedeEditar) return;
    try {
      setSubiendo(true);
      const storageRef = ref(storage, `archivos/${tienda}/${archivo.name}`);
      await uploadBytes(storageRef, archivo);
      const url = await getDownloadURL(storageRef);
      setUrlArchivo(url);
      await updateDocField('archivoURL', url);
    } catch (error) {
      console.error('Error al subir archivo:', error);
    } finally {
      setSubiendo(false);
    }
  };

  const handleMultiplesArchivosUpload = async () => {
    if (!puedeEditar || archivos.length === 0) return;
    setSubiendo(true);
    try {
      const urls: string[] = [];
      for (const file of archivos) {
        const storageRef = ref(storage, `archivos/${tienda}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }
      const nuevasImagenes = Array.from(new Set([...(imagenesURLs || []), ...urls])).slice(0, 20);
      setImagenesURLs(nuevasImagenes);
      await updateDocField('archivosAdjuntos', nuevasImagenes);
      setArchivos([]);
    } catch (error) {
      console.error('Error al subir imágenes:', error);
    } finally {
      setSubiendo(false);
    }
  };

  if (loading) return <p>Cargando checklist...</p>;

  const puedeEditar = rol === 'empresa_inventario' || rol === 'jefe_tienda';

  const tiendaCampos = [
  'CÓDIGO DE TIENDA', 'TIENDA', 'EMPRESA', 'JEFE ZONAL', 'TIPO',
  'FECHA INVENTARIO', 'UNIDADES INFORMADAS', 'PISOS', 'BODEGAS',
  'HORARIO DE CIERRE', 'HORARIO DE APERTURA'
];
  const visitaCampos = [
  'FECHA VISITA', 'HORA VISITA', 'ENCARGADO VISITA EMPRESA',
  'ENCARGADO TIENDA', 'CARGO ENCARGADO TIENDA', 'UNIDADES BODEGA APROX',
  'UNIDADES SALA APROX', 'HORARIO INICIO BODEGA', 'HORARIO INICIO SALA',
  'FOTOGRAFÍAS EVIDENCIAS', 'TIENDA APTA LA TOMA'
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
  const inventarioCampos = [
  'Observación general del estado de la tienda',
  'Comentarios sobre el apoyo del personal interno',
  'Problemas detectados durante la visita',
  'Recomendaciones para el equipo de inventario',
  'Observación adicional del auditor (si aplica)'
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
  '¿Generación de carta?'
];

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
  <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '10px', padding: '1rem' }}>
    <img src="/logo1.png" alt="Logo 1" style={{ height: '40px' }} />
    <img src="/logo2.png" alt="Logo 2" style={{ height: '40px' }} />
  </div>
      <h2>Checklist de Verificación para Inventario - Tienda</h2>

      <table border={1} cellPadding={6} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>Datos de Tienda</td>
          </tr>
          {tiendaCampos.map((campo) => (
            <tr key={campo}>
              <td style={{ width: '30%' }}>{campo}</td>
              <td><input type="text" value={datos.tiendaInfo?.[campo] || ''} onChange={(e) => puedeEditar && handleChange('tiendaInfo', campo, e.target.value)} disabled={!puedeEditar} style={{ width: '100%' }} /></td>
            </tr>
          ))}

          <tr><td colSpan={2} style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>Visita Previa</td></tr>
          {visitaCampos.map((campo) => (
            <tr key={campo}>
              <td style={{ width: '30%' }}>{campo}</td>
              <td><input type="text" value={datos.visitaPrevia?.[campo] || ''} onChange={(e) => puedeEditar && handleChange('visitaPrevia', campo, e.target.value)} disabled={!puedeEditar} style={{ width: '100%' }} /></td>
            </tr>
          ))}

          <tr><td colSpan={2} style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Checklist</td></tr>
{checklistPreguntas.map((pregunta, i) => (
  <tr key={i}>
    <td>{pregunta}</td>
    <td>
      <label style={{ marginRight: '2rem' }}>
        <input type="radio" name={`checklist-${i}`} checked={datos.checklist?.[i] === 'sí'} onChange={() => puedeEditar && handleCheckbox('checklist', i, 'sí')} disabled={!puedeEditar} /> Sí
      </label>
      <label>
        <input type="radio" name={`checklist-${i}`} checked={datos.checklist?.[i] === 'no'} onChange={() => puedeEditar && handleCheckbox('checklist', i, 'no')} disabled={!puedeEditar} /> No
      </label>
    </td>
  </tr>
))}
<tr><td colSpan={2} style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}>Inventario</td></tr>
          {inventarioCampos.map((campo) => (
            <tr key={campo}>
              <td style={{ width: '40%' }}>{campo}</td>
              <td style={{ width: '60%' }}>
                <textarea value={datos.inventario?.[campo] || ''} onChange={(e) => puedeEditar && handleChange('inventario', campo, e.target.value)} disabled={!puedeEditar} style={{ width: '100%' }} />
              </td>
            </tr>
          ))}

          <tr><td colSpan={2} style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Verificación Final</td></tr>
{verificacionFinalPreguntas.map((pregunta, i) => (
  <tr key={i}>
    <td>{pregunta}</td>
    <td>
      <label style={{ marginRight: '2rem' }}>
        <input type="radio" name={`verif-${i}`} checked={datos.verificacionFinal?.[i] === 'sí'} onChange={() => puedeEditar && handleCheckbox('verificacionFinal', i, 'sí')} disabled={!puedeEditar} /> Sí
      </label>
      <label>
        <input type="radio" name={`verif-${i}`} checked={datos.verificacionFinal?.[i] === 'no'} onChange={() => puedeEditar && handleCheckbox('verificacionFinal', i, 'no')} disabled={!puedeEditar} /> No
      </label>
    </td>
  </tr>
))}</tbody>
      </table>

      

      <h3>Fotos Adjuntas (máx. 20)</h3>
<input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => {
    const archivosSeleccionados = e.target.files ? Array.from(e.target.files).slice(0, 20) : [];
    setArchivos(archivosSeleccionados);
  }}
  disabled={!puedeEditar || subiendo}
/>
<button
  onClick={handleMultiplesArchivosUpload}
  disabled={!puedeEditar || subiendo || archivos.length === 0}
>
  {subiendo ? 'Subiendo imágenes...' : 'Subir imágenes'}
</button>
<div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem', gap: '10px' }}>
  {imagenesURLs.map((url, idx) => (
    <img
      key={idx}
      src={url}
      alt={`img-${idx}`}
      style={{
        width: 120,
        height: 120,
        objectFit: 'cover',
        borderRadius: '6px',
        border: '1px solid #ccc'
      }}
    />
  ))}
</div>

<h3>Carta de Aceptación</h3>
<textarea value={cartaAceptacion} onChange={(e) => setCartaAceptacion(e.target.value)} disabled={!puedeEditar} style={{ width: '100%', height: '100px' }} />
<button onClick={() => updateDocField('cartaAceptacion', cartaAceptacion)} disabled={!puedeEditar}>Guardar Carta de Aceptación</button>
    </div>
  );
}
























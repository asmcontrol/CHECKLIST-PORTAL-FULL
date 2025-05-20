import { useState } from 'react';
import jsPDF from 'jspdf';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';

type Props = {
  tienda: string;
  rol: 'jefe_tienda' | 'empresa_inventario' | 'auditor';
};

export default function CartaStep({ tienda, rol }: Props) {
  const [form, setForm] = useState({
    ciudad: '',
    estado: '',
    codigoPostal: '',
    nombreEmpleado: '',
    nombreTienda: '',
    fechaInventario: '',
    nombreSupervisor: '',
    tituloSupervisor: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [archivoFirmado, setArchivoFirmado] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const storage = getStorage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const descargarPDF = () => {
    const docPdf = new jsPDF();
    const pageWidth = docPdf.internal.pageSize.getWidth();
    const margin = 20;

    // Logos a la derecha (asegúrate de tener las imágenes en public/ o usar base64)
    const logo1 = new Image();
    const logo2 = new Image();
    logo1.src = '/logo1.png'; // Ajusta según tus rutas
    logo2.src = '/logo2.png';

    logo1.onload = () => {
      logo2.onload = () => {
        docPdf.addImage(logo1, 'PNG', pageWidth - 60, 10, 20, 10);
        docPdf.addImage(logo2, 'PNG', pageWidth - 35, 10, 20, 10);

        // Título
        docPdf.setFontSize(14);
        docPdf.text('Carta de Aceptación de Inventario', pageWidth / 2, 30, { align: 'center' });

        // Subtítulo
        docPdf.setFontSize(11);
        docPdf.text(`${form.ciudad}, ${form.estado}, ${form.codigoPostal}`, pageWidth / 2, 38, { align: 'center' });

        // Texto
        const texto = `
Estimado/a ${form.nombreEmpleado}:

Por medio de la presente, confirmamos que hemos revisado y aceptado los resultados de la captura de inventario realizada en nuestra tienda ${form.nombreTienda} el día ${form.fechaInventario}.

Agradecemos su dedicación y esfuerzo para llevar a cabo este proceso de manera eficiente y precisa. Su contribución ha sido fundamental para garantizar la exactitud de nuestro inventario y el éxito de nuestras operaciones.

Hemos verificado que todos los datos registrados son correctos y reflejan fielmente el estado de nuestro inventario. Su desempeño ha sido ejemplar y apreciamos su compromiso con la calidad y la precisión.

Quedamos a su disposición para cualquier consulta o aclaración adicional que pueda necesitar.

Atentamente,`;

        const lines = docPdf.splitTextToSize(texto.trim(), pageWidth - 2 * margin);
        docPdf.setFontSize(11);
        docPdf.text(lines, margin, 50);

        // Firma centrada
        const firmaY = 160;
        docPdf.line(pageWidth / 2 - 40, firmaY, pageWidth / 2 + 40, firmaY);
        docPdf.text(form.nombreSupervisor, pageWidth / 2, firmaY + 8, { align: 'center' });
        docPdf.text(form.tituloSupervisor, pageWidth / 2, firmaY + 14, { align: 'center' });
        docPdf.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, firmaY + 22, { align: 'center' });

        docPdf.save(`${tienda}_carta_aceptacion.pdf`);
      };
    };
  };

  const subirCartaFirmada = async () => {
    if (!archivoFirmado) return;
    setSubiendo(true);
    setMensaje('');
    try {
      const archivoRef = ref(storage, `cartas_aceptacion/${tienda}_firmada.pdf`);
      await uploadBytes(archivoRef, archivoFirmado);
      const url = await getDownloadURL(archivoRef);
      await updateDoc(doc(db, 'checklists', tienda), {
        cartaAceptacionFirmadaURL: url,
      });
      setMensaje('✅ Carta firmada subida correctamente.');
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al subir la carta firmada.');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div style={{ color: '#222' }}>
      <h3>📄 Generar Carta de Aceptación</h3>
      <p>Completa los siguientes campos:</p>

      {[
        { label: 'Ciudad', name: 'ciudad' },
        { label: 'Estado', name: 'estado' },
        { label: 'Código Postal', name: 'codigoPostal' },
        { label: 'Nombre del Empleado', name: 'nombreEmpleado' },
        { label: 'Nombre de la Tienda', name: 'nombreTienda' },
        { label: 'Fecha del Inventario', name: 'fechaInventario' },
        { label: 'Nombre del Supervisor', name: 'nombreSupervisor' },
        { label: 'Título del Supervisor', name: 'tituloSupervisor' },
      ].map(({ label, name }) => (
        <div key={name} style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder={label}
            name={name}
            value={(form as any)[name]}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: '#222'
            }}
          />
        </div>
      ))}

      <button
        onClick={descargarPDF}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        ⬇️ Descargar Carta de Aceptación
      </button>

      <div style={{ marginTop: '40px' }}>
        <h4>📤 Subir Carta Firmada</h4>
        <p>Una vez impresa y firmada, puedes subir el archivo escaneado en PDF aquí:</p>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setArchivoFirmado(e.target.files?.[0] || null)}
          style={{ marginBottom: '10px' }}
        />

        <button
          onClick={subirCartaFirmada}
          disabled={!archivoFirmado || subiendo}
          style={{
            padding: '10px 20px',
            backgroundColor: archivoFirmado ? '#2e7d32' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: archivoFirmado ? 'pointer' : 'not-allowed'
          }}
        >
          Subir Carta Firmada
        </button>

        {mensaje && (
          <p style={{ marginTop: '10px', color: mensaje.includes('Error') ? 'red' : 'green' }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}






import ProveedorView from './ProveedorView';
import TiendaView from './TiendaView';
import AuditorView from './AuditorView';
import { useRef, useState } from 'react';

type Props = {
  tienda: string;
  dataproveedor: Record<string, string>;
  datatienda: Record<string, string>;
};

export default function ChecklistCompleto({ tienda, dataproveedor, datatienda }: Props) {
  const [previewFotos, setPreviewFotos] = useState<string[]>([]);
  const [archivos, setArchivos] = useState<File[]>([]);
  const fotosRef = useRef<HTMLInputElement>(null);
  const archivosRef = useRef<HTMLInputElement>(null);

  const handleGuardar = () => {
    alert('Checklist guardado correctamente ✅');
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previews = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewFotos(previews);
    }
  };

  const handleArchivosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setArchivos(Array.from(files));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>✅ Vista Completa Checklist – {tienda}</h1>

      <div style={{ marginBottom: '40px' }}>
        <ProveedorView tienda={tienda} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <TiendaView tienda={tienda} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        {/* ❗ Aquí eliminamos las props no utilizadas */}
        <AuditorView tienda={tienda} />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>📷 Adjuntar Fotos</h3>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fotosRef}
          onChange={handleFotosChange}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
          {previewFotos.map((src, index) => (
            <img key={index} src={src} alt={`foto-${index}`} style={{ width: '100px', borderRadius: '6px' }} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>📎 Adjuntar Archivos</h3>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xlsx,.xls"
          multiple
          ref={archivosRef}
          onChange={handleArchivosChange}
        />
        <ul style={{ marginTop: '10px' }}>
          {archivos.map((file, index) => (
            <li key={index}>
              <a href={URL.createObjectURL(file)} download={file.name} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
        <button
          onClick={handleGuardar}
          style={{
            backgroundColor: '#3C79C3',
            color: '#fff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          💾 Guardar
        </button>

        <button
          onClick={handleImprimir}
          style={{
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          🖨️ Imprimir
        </button>
      </div>
    </div>
  );
}



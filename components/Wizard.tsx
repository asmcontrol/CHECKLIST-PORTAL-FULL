import { useState } from 'react';
import Image from 'next/image';
import ChecklistStep from './wizard/ChecklistStep';
import FotosStep from './wizard/FotosStep';
import CartaStep from './wizard/CartaStep';

type Rol = 'jefe_tienda' | 'empresa_inventario' | 'auditor';

interface Props {
  tienda: string;
  rol: Rol;
}

export default function Wizard({ tienda, rol }: Props) {
  const [paso, setPaso] = useState(0);

  const pasos = [
    { titulo: 'Checklist', componente: <ChecklistStep rol={rol} tienda={tienda} /> },
    { titulo: 'Subida de Fotos', componente: <FotosStep rol={rol} tienda={tienda} /> },
    { titulo: 'Carta de Aceptación', componente: <CartaStep rol={rol} tienda={tienda} /> },
  ];

  const avanzar = () => {
    if (paso < pasos.length - 1) setPaso(paso + 1);
  };

  const retroceder = () => {
    if (paso > 0) setPaso(paso - 1);
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        color: '#222',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.05)',
        maxWidth: '900px',
        margin: '0 auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>
          Checklist gestión de Inventario
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Image src="/logo1.png" alt="Logo 1" width={60} height={60} />
          <Image src="/logo2.png" alt="Logo 2" width={60} height={60} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        {pasos.map((p, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px 0',
              fontWeight: paso === i ? 'bold' : 'normal',
              color: paso === i ? '#1976d2' : '#888',
              borderBottom: paso === i ? '3px solid #1976d2' : '3px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            {i + 1}. {p.titulo}
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: '#f9f9f9',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #ddd',
          color: '#222'
        }}
      >
        {pasos[paso].componente}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
        <button
          onClick={retroceder}
          disabled={paso === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: paso === 0 ? '#e0e0e0' : '#ccc',
            color: '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: paso === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          ⬅️ Anterior
        </button>

        <button
          onClick={avanzar}
          disabled={paso === pasos.length - 1}
          style={{
            padding: '10px 20px',
            backgroundColor: paso === pasos.length - 1 ? '#e0e0e0' : '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: paso === pasos.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Siguiente ➡️
        </button>
      </div>
    </div>
  );
}





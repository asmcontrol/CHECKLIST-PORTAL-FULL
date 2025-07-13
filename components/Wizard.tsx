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

  // 👇 MODO DEMO: mostrar contenido falso sin conexión a Firestore
  if (tienda === 'demo-tienda') {
    const datosDemo = {
      nombreTienda: 'Tienda DEMO',
      codigoTienda: '0000',
      fecha: '13 de julio de 2025',
      checklist: {
        orden: true,
        limpieza: false,
        observaciones: 'Área de bodega necesita organización adicional.',
      },
      fotos: [
        'https://firebasestorage.googleapis.com/v0/b/checklist-asmcontrol.appspot.com/o/F1.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/checklist-asmcontrol.appspot.com/o/F2.jpg?alt=media'
      ],
      cartaFirmada: true,
    };

    const contenidoPaso = [
      // Paso 1: Checklist
      (
        <div>
          <h3>✅ Checklist de Inventario</h3>
          <p>✔️ Orden: {datosDemo.checklist.orden ? 'Sí' : 'No'}</p>
          <p>✔️ Limpieza: {datosDemo.checklist.limpieza ? 'Sí' : 'No'}</p>
          <p>📝 Observaciones: {datosDemo.checklist.observaciones}</p>
        </div>
      ),

      // Paso 2: Fotos
      (
        <div>
          <h3>🖼️ Evidencia Fotográfica</h3>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {datosDemo.fotos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Foto ${i + 1}`}
                style={{
                  width: 200,
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              />
            ))}
          </div>
        </div>
      ),

      // Paso 3: Carta de aceptación
      (
        <div>
          <h3>✍ Carta de Aceptación</h3>
          <p><strong>Estado:</strong> {datosDemo.cartaFirmada ? 'Firmada digitalmente' : 'Pendiente'}</p>
        </div>
      )
    ];

    return (
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '10px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>🧪 DEMO - Checklist de {datosDemo.nombreTienda}</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Image src="/logo1.png" alt="Logo 1" width={60} height={60} />
            <Image src="/logo2.png" alt="Logo 2" width={60} height={60} />
          </div>
        </div>

        <p><strong>Código tienda:</strong> {datosDemo.codigoTienda}</p>
        <p><strong>Fecha:</strong> {datosDemo.fecha}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2rem 0' }}>
          {['Checklist', 'Fotos', 'Carta'].map((titulo, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 0',
                fontWeight: paso === i ? 'bold' : 'normal',
                color: paso === i ? '#1976d2' : '#888',
                borderBottom: paso === i ? '3px solid #1976d2' : '3px solid transparent',
              }}
            >
              {i + 1}. {titulo}
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          {contenidoPaso[paso]}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button onClick={() => setPaso(p => Math.max(p - 1, 0))} disabled={paso === 0}>
            ⬅️ Anterior
          </button>
          <button onClick={() => setPaso(p => Math.min(p + 1, contenidoPaso.length - 1))} disabled={paso === contenidoPaso.length - 1}>
            Siguiente ➡️
          </button>
        </div>
      </div>
    );
  }

  // 🔁 MODO NORMAL: datos reales por tienda
  const pasos = [
    { titulo: 'Checklist', componente: <ChecklistStep rol={rol} tienda={tienda} /> },
    { titulo: 'Subida de Fotos', componente: <FotosStep rol={rol} tienda={tienda} /> },
    { titulo: 'Carta de Aceptación', componente: <CartaStep rol={rol} tienda={tienda} /> },
  ];

  const avanzar = () => paso < pasos.length - 1 && setPaso(paso + 1);
  const retroceder = () => paso > 0 && setPaso(paso - 1);

  return (
    <div style={{
      backgroundColor: '#fff', color: '#222', padding: '2rem', fontFamily: 'system-ui',
      borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.05)', maxWidth: '900px', margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Checklist gestión de Inventario</h2>
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

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        {pasos[paso].componente}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
        <button onClick={retroceder} disabled={paso === 0}>⬅️ Anterior</button>
        <button onClick={avanzar} disabled={paso === pasos.length - 1}>Siguiente ➡️</button>
      </div>
    </div>
  );
}
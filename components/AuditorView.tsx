import React from 'react';

interface AuditorViewProps {
  tienda: string;
  dataproveedor: any;
  datatienda: any;
}

export default function AuditorView({
  tienda,
  dataproveedor,
  datatienda,
}: AuditorViewProps) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
        Vista Auditor - Checklist Combinado ({tienda})
      </h1>

      {/* --- Sección Tienda --- */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#0070f3' }}>Checklist Tienda</h2>
        {datatienda ? (
          <ul>
            {Object.entries(datatienda).map(([key, value]) => (
              <li key={key}>
                <strong>{formatearCampo(key)}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay datos de tienda disponibles.</p>
        )}
      </section>

      {/* --- Sección Proveedor --- */}
      <section>
        <h2 style={{ fontSize: '1.4rem', color: '#f39c12' }}>Checklist Proveedor</h2>
        {dataproveedor ? (
          <ul>
            {Object.entries(dataproveedor).map(([key, value]) => (
              <li key={key}>
                <strong>{formatearCampo(key)}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay datos de proveedor disponibles.</p>
        )}
      </section>
    </div>
  );
}

// Función para mostrar nombres más legibles
function formatearCampo(campo: string) {
  return campo
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

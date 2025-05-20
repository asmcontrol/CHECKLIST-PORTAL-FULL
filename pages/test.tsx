import dynamic from 'next/dynamic';

// ✅ Importamos dinámicamente el Wizard directamente desde components
const Wizard = dynamic(() => import('../components/Wizard'), {
  ssr: false,
});

export default function TestPage() {
  const tienda = 'Tienda001';
  const rol = 'jefe_tienda' as const;

  return (
    <div style={{ padding: '2rem', backgroundColor: '#121212', minHeight: '100vh' }}>
      <Wizard tienda={tienda} rol={rol} />
    </div>
  );
}


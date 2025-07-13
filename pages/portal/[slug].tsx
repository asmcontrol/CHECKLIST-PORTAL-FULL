import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Carga dinámica del Wizard sin SSR
const Wizard = dynamic(() => import('../../components/Wizard'), {
  ssr: false,
});

export default function PortalTienda() {
  const router = useRouter();
  const { slug, rol } = router.query;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Asegura que el componente se monte solo en el cliente
    setMounted(true);
  }, []);

  // Muestra cargando mientras se obtienen los parámetros de la URL
  if (!mounted || !slug || !rol || typeof slug !== 'string' || typeof rol !== 'string') {
    return <p style={{ textAlign: 'center', color: '#333', padding: '2rem' }}>Cargando portal...</p>;
  }

  return (
    <div>
      <Wizard tienda={slug} rol={rol as 'jefe_tienda' | 'empresa_inventario' | 'auditor'} />
    </div>
  );
}






























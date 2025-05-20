import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Wizard = dynamic(() => import('../../components/Wizard'), {
  ssr: false,
});

export default function PortalTienda() {
  const router = useRouter();
  const { slug, rol } = router.query;

  if (!slug || !rol || typeof slug !== 'string' || typeof rol !== 'string') {
    return <p style={{ color: 'white' }}>Cargando...</p>;
  }

  return <Wizard tienda={slug} rol={rol as 'jefe_tienda' | 'empresa_inventario' | 'auditor'} />;
}






























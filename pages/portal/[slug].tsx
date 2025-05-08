import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ProveedorView = dynamic(() => import('../../components/ProveedorView'));
const TiendaView = dynamic(() => import('../../components/TiendaView'));
const AuditorView = dynamic(() => import('../../components/AuditorView'));
const ChecklistResumenView = dynamic(() => import('../../components/ChecklistResumenView'));

export default function PortalSlug() {
  const router = useRouter();
  const { slug, tienda, rol } = router.query;

  const [componente, setComponente] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (!rol || typeof rol !== 'string') return;

    const rolNormalizado = rol.toLowerCase();

    switch (rolNormalizado) {
      case 'proveedor':
        setComponente(<ProveedorView tienda={String(tienda)} />);
        break;
      case 'tienda':
        setComponente(<TiendaView tienda={String(tienda)} />);
        break;
      case 'auditor':
        setComponente(<AuditorView tienda={String(tienda)} />);
        break;
      case 'resumen':
        setComponente(<ChecklistResumenView tienda={String(tienda)} />);
        break;
      default:
        setComponente(<p>Rol no válido: {rol}</p>);
    }
  }, [rol, tienda]);

  return <>{componente}</>;
}







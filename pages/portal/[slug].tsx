import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ProveedorView = dynamic(() => import('@/components/ProveedorView'));
const TiendaView = dynamic(() => import('@/components/TiendaView'));
const AuditorView = dynamic(() => import('@/components/AuditorView'));
const ChecklistCompleto = dynamic(() => import('@/components/ChecklistCompleto'));

export default function PortalSlug() {
  const router = useRouter();
  const { slug, tienda, rol } = router.query;

  const [componente, setComponente] = useState<React.ReactNode>(null);

  // Datos de ejemplo o reales (podrás reemplazarlos por los de Firebase)
  const mockProveedorData = {
    nombreTienda: 'Tienda Central',
    direccion: 'Av. Ejemplo 123',
    encargado: 'Juan Pérez',
    fechaVisita: '2024-05-01',
    fechaInventario: '2024-05-10',
    acceso: 'sí',
    iluminacion: 'no',
    obstaculos: 'sí',
    climatizacion: 'no',
  };

  const mockTiendaData = {
    confirmacionFecha: 'sí',
    equipoInformado: 'sí',
    condiciones: 'no',
    planos: 'sí',
    validacionPersonal: 'sí',
    induccion: 'no',
  };

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
        setComponente(
          <AuditorView tienda={String(tienda)} dataproveedor={mockProveedorData} datatienda={mockTiendaData} />
        );
        break;
      case 'admin':
        setComponente(
          <ChecklistCompleto tienda={String(tienda)} dataproveedor={mockProveedorData} datatienda={mockTiendaData} />
        );
        break;
      default:
        setComponente(<p>Rol no válido: {rol}</p>);
    }
  }, [rol, tienda]);

  return <>{componente}</>;
}












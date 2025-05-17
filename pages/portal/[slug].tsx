import { useRouter } from 'next/router';
import ChecklistCompleto from '../../components/ChecklistCompleto'; // ¡Este debe ser el que se usa!

export default function PortalTienda() {
  const router = useRouter();
  const { slug, rol } = router.query;

  if (!slug || !rol || typeof slug !== 'string' || typeof rol !== 'string') {
    return <p>Cargando...</p>;
  }

  return <ChecklistCompleto tienda={slug} rol={rol as 'jefe_tienda' | 'empresa_inventario' | 'auditor'} />;
}























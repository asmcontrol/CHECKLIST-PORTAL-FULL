import { useRouter } from 'next/router';
import ChecklistResumen from '@/components/ChecklistResumenView';

export default function ResumenTienda() {
  const router = useRouter();
  const { tienda } = router.query;

  if (!tienda || typeof tienda !== 'string') {
    return <p>Cargando tienda...</p>;
  }

  return <ChecklistResumen tienda={tienda} />;
}


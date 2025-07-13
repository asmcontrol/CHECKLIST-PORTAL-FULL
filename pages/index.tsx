import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '1.5rem'
      }}>
        <img src="/asm-logo.png" alt="ASM Logo" style={{ height: '60px', objectFit: 'contain' }} />
        <img src="/fashions_park_logo.png" alt="Fashions Park Logo" style={{ height: '60px', objectFit: 'contain' }} />
      </div>

      <h1 style={{ color: '#333', marginBottom: '1rem' }}>Bienvenido al Portal de Inventario</h1>
      <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '400px', textAlign: 'center' }}>
        Accede al checklist, sube fotos y completa la carta de aceptación según tu rol.
        Sistema diseñado para facilitar la toma de inventarios en tiendas Fashion’s Park.
      </p>

      <button onClick={() => router.push('/login')} style={{
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>
        Iniciar Sesión
      </button>

      <button onClick={() => router.push('/portal/demo?rol=empresa_inventario')} style={{
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Ver Demo sin Login
      </button>
    </div>
  );
}




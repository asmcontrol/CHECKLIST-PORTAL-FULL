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
      <h1 style={{ color: '#333', marginBottom: '1rem' }}>Bienvenido al Portal de Inventario</h1>
      <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '400px', textAlign: 'center' }}>
        Accede a tu checklist según tu rol y comienza a gestionar de forma rápida y segura.
      </p>
      <button onClick={() => router.push('/login')} style={{
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Ir al Login
      </button>
    </div>
  );
}

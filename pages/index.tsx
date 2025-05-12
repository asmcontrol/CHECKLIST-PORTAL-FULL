import Link from 'next/link';
import styles from '../styles/landing.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '30px' }}>
          <img src="/asm-logo.png" alt="ASM Control" style={{ maxHeight: '80px' }} />
          <img src="/fashions_park_logo.jpeg" alt="Fashion's Park" style={{ maxHeight: '80px' }} />
        </div>
      </div>

      <div className={styles.card}>
        <Link href="/login">
          <button className={styles.buttonPrimary}>Mi Portal de Inventario</button>
        </Link>
        <Link href="/solicitud-cuenta">
          <button className={styles.buttonSecondary}>Solicitud de Cuenta</button>
        </Link>
      </div>
    </div>
  );
}




import Link from 'next/link';
import styles from '../styles/landing.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/asm-logo.png" alt="ASM Control" className={styles.logo} />
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



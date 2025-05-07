import { useState } from 'react';
import styles from '../styles/login.module.css';

type Props = {
  tienda: string;
};

export default function TiendaView({ tienda }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderCheckbox = (label: string, field: string) => (
    <div className={styles.checkboxRow}>
      <label className={styles.label}>{label}</label>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name={field}
            checked={formData[field] === 'sí'}
            onChange={() => handleChange(field, 'sí')}
          /> Sí
        </label>
        <label>
          <input
            type="radio"
            name={field}
            checked={formData[field] === 'no'}
            onChange={() => handleChange(field, 'no')}
          /> No
        </label>
      </div>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checklist tienda enviado:', formData);
    alert('Checklist guardado correctamente ✅');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Checklist Tienda – {tienda}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.subtitle}>1. Coordinación y Preparación Previa</h2>
          {renderCheckbox("Fecha y hora de inventario confirmada", "fechaConfirmada")}
          {renderCheckbox("Equipo interno informado", "equipoInformado")}
          {renderCheckbox("Condiciones óptimas del local verificadas", "condicionesLocales")}
          {renderCheckbox("Mapas o planos entregados", "planosEntregados")}

          <h2 className={styles.subtitle}>2. Recepción y Control del Personal Externo</h2>
          {renderCheckbox("Personal externo recibido y verificado", "personalVerificado")}
          {renderCheckbox("Registro de ingreso completado", "registroIngreso")}
          {renderCheckbox("Acceso coordinado con supervisor externo", "accesoCoordinado")}
          {renderCheckbox("Normas internas comunicadas", "normasComunicadas")}

          <h2 className={styles.subtitle}>3. Supervisión Durante la Toma</h2>
          {renderCheckbox("Participación en inducción de seguridad", "induccionSeguridad")}
          {renderCheckbox("Disponibilidad para resolver dudas", "disponibilidadDudas")}
          {renderCheckbox("Supervisión del comportamiento", "supervisionComportamiento")}
          {renderCheckbox("Cumplimiento del cronograma", "cronogramaCumplido")}

          <h2 className={styles.subtitle}>4. Apoyo Logístico y Técnico</h2>
          {renderCheckbox("Acceso a recursos facilitado", "recursosFacilitados")}
          {renderCheckbox("Iluminación y zonas críticas habilitadas", "zonasHabilitadas")}
          {renderCheckbox("Soporte ante emergencias disponible", "soporteEmergencias")}

          <h2 className={styles.subtitle}>5. Validación y Cierre del Proceso</h2>
          {renderCheckbox("Revisión de incidencias realizada", "revisionIncidencias")}
          {renderCheckbox("Acta o informe firmado", "informeFirmado")}
          {renderCheckbox("Retiro del equipo coordinado", "retiroCoordinado")}
          {renderCheckbox("Informe enviado a administración central", "informeEnviado")}

          <button type="submit" className={styles.button}>Guardar Checklist</button>
        </form>
      </div>
    </div>
  );
}

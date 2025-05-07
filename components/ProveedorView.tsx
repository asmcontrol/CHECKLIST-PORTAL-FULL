import { useState } from 'react';
import styles from '../styles/login.module.css'; // 🔧 RUTA ACTUALIZADA

type Props = {
  tienda: string;
};

export default function ProveedorView({ tienda }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderCheckbox = (label: string, field: string) => (
    <div className={styles.checkboxRow}>
      <label className={styles.label}>{label}</label>
      <div className={styles.radioGroup}>
        <label>
          <input type="radio" name={field} checked={formData[field] === 'sí'} onChange={() => handleChange(field, 'sí')} /> Sí
        </label>
        <label>
          <input type="radio" name={field} checked={formData[field] === 'no'} onChange={() => handleChange(field, 'no')} /> No
        </label>
      </div>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checklist enviado:', formData);
    alert('Checklist enviado correctamente ✅');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <img src="/asm-logo.png" alt="ASM Control" className={styles.logo} />
        <h1 className={styles.title}>Checklist Proveedor – {tienda}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>

          <h2 className={styles.subtitle}>1. Información General</h2>
          <label className={styles.label}>Nombre de la tienda
            <input type="text" className={styles.input} onChange={e => handleChange('nombreTienda', e.target.value)} />
          </label>
          <label className={styles.label}>Dirección
            <input type="text" className={styles.input} onChange={e => handleChange('direccion', e.target.value)} />
          </label>
          <label className={styles.label}>Encargado en tienda
            <input type="text" className={styles.input} onChange={e => handleChange('encargado', e.target.value)} />
          </label>
          <label className={styles.label}>Fecha y hora de la visita
            <input type="datetime-local" className={styles.input} onChange={e => handleChange('fechaVisita', e.target.value)} />
          </label>
          <label className={styles.label}>Fecha programada para el inventario
            <input type="date" className={styles.input} onChange={e => handleChange('fechaInventario', e.target.value)} />
          </label>

          <h2 className={styles.subtitle}>2. Condiciones del Local</h2>
          {renderCheckbox("Acceso libre y seguro al local", "acceso")}
          {renderCheckbox("Iluminación adecuada", "iluminacion")}
          {renderCheckbox("Espacios libres de obstáculos", "obstaculos")}
          {renderCheckbox("Climatización adecuada", "climatizacion")}

          <h2 className={styles.subtitle}>3. Productos y Exhibición</h2>
          {renderCheckbox("Mercadería correctamente etiquetada", "etiquetas")}
          {renderCheckbox("Productos organizados por categoría", "organizacion")}
          {renderCheckbox("Artículos fuera de lugar identificados", "fueraLugar")}
          {renderCheckbox("Productos en bodega clasificados", "bodegaOrdenada")}
          {renderCheckbox("Identificación de productos en mal estado", "productosMalEstado")}

          <h2 className={styles.subtitle}>4. Recursos Técnicos y Apoyo</h2>
          {renderCheckbox("Disponibilidad de energía eléctrica", "energia")}
          {renderCheckbox("Punto de conexión a red o WiFi", "wifi")}
          {renderCheckbox("Espacio habilitado para centro de control", "centroControl")}
          {renderCheckbox("Apoyo de personal de tienda", "apoyoPersonal")}

          <h2 className={styles.subtitle}>5. Seguridad y Logística</h2>
          {renderCheckbox("Plan de cierre informado", "planCierre")}
          {renderCheckbox("Autorizaciones de acceso", "autorizaciones")}
          {renderCheckbox("Supervisión designada", "supervision")}
          {renderCheckbox("Materiales de seguridad disponibles", "materialesSeguridad")}

          <h2 className={styles.subtitle}>6. Validaciones Finales</h2>
          {renderCheckbox("Reunión previa realizada", "reunionPrevia")}
          {renderCheckbox("Cronograma confirmado", "cronograma")}
          {renderCheckbox("Observaciones registradas", "observaciones")}
          {renderCheckbox("Aprobación del cliente", "aprobacionCliente")}

          <h2 className={styles.subtitle}>7. Control del Personal Externo – Toma de Inventario</h2>
          {renderCheckbox("Listado del personal enviado", "listadoPersonal")}
          {renderCheckbox("Identificación visible", "identificacion")}
          {renderCheckbox("Registro de ingreso a tienda", "registroIngreso")}
          {renderCheckbox("Personal informado sobre normas", "informadoNormas")}
          {renderCheckbox("Verificación de dispositivos", "verificacionEquipos")}
          {renderCheckbox("Revisión de baterías y conectividad", "revisionBaterias")}
          {renderCheckbox("Asignación de equipos por persona", "asignacionEquipos")}
          {renderCheckbox("Zonificación clara", "zonificacion")}
          {renderCheckbox("Supervisores presentes", "supervisores")}
          {renderCheckbox("Instrucciones para zonas difíciles", "zonasDificiles")}
          {renderCheckbox("Prohibición de manipular sin permiso", "manipularSinPermiso")}
          {renderCheckbox("Restricción a áreas no habilitadas", "restriccionAreas")}
          {renderCheckbox("Uso de uniforme", "usoUniforme")}
          {renderCheckbox("Supervisión por parte de tienda", "supervisionTienda")}
          {renderCheckbox("Punto de contacto definido", "puntoContacto")}
          {renderCheckbox("Canal de comunicación definido", "canalComunicacion")}
          {renderCheckbox("Reunión de inducción realizada", "induccion")}

          <button type="submit" className={styles.button}>Guardar Checklist</button>
        </form>
      </div>
    </div>
  );
}


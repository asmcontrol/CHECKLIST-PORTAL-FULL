import { useState } from "react";

export default function ChecklistLoginPortal() {
  const [stage, setStage] = useState("welcome");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [formData, setFormData] = useState({
    tienda: "",
    direccion: "",
    encargado: "",
    visita: "",
    inventario: "",
  });

  const [checklist, setChecklist] = useState(
    Array(5).fill(false).map(() => [])
  );

  const checklistSecciones = [
    {
      titulo: "2. Condiciones del Local",
      items: [
        "Acceso libre y seguro al local en el horario acordado",
        "Iluminación adecuada en todas las áreas",
        "Espacios libres de obstáculos",
        "Climatización o ventilación adecuada"
      ]
    },
    {
      titulo: "3. Productos y Exhibición",
      items: [
        "Mercadería correctamente etiquetada",
        "Productos organizados por categoría y ubicación",
        "Artículos fuera del lugar identificados",
        "Productos en bodega clasificados y ordenados",
        "Identificación de productos en mal estado"
      ]
    },
    {
      titulo: "4. Recursos Técnicos y Apoyo",
      items: [
        "Disponibilidad de energía eléctrica",
        "Punto de conexión a red o WiFi",
        "Espacio habilitado para centro de control de inventario",
        "Apoyo de personal de tienda"
      ]
    },
    {
      titulo: "5. Seguridad y Logística",
      items: [
        "Plan de cierre parcial o total informado",
        "Autorizaciones de acceso para el equipo de inventario",
        "Supervisión o responsable designado",
        "Materiales de seguridad disponibles"
      ]
    },
    {
      titulo: "6. Validaciones Finales",
      items: [
        "Reunión previa con el encargado realizada",
        "Cronograma del inventario confirmado",
        "Observaciones especiales registradas",
        "Aprobación del cliente para el inicio"
      ]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheck = (sectionIndex, itemIndex) => {
    const updated = [...checklist];
    updated[sectionIndex][itemIndex] = !updated[sectionIndex][itemIndex];
    setChecklist(updated);
  };

  const allInputsFilled = Object.values(formData).every((v) => v.trim() !== "");

  const sectionComplete = (i) => {
    return (
      checklist[i] &&
      checklist[i].length === checklistSecciones[i].items.length &&
      checklist[i].every(Boolean)
    );
  };

  const handleLogin = () => {
    if (username && password) {
      setStage("seccion1");
    }
  };

  const renderWelcome = () => (
    <div style={{ textAlign: "center", padding: 40 }}>
      <img src="/asm-logo.png" alt="ASM Control Logo" style={{ maxWidth: 200, marginBottom: 20 }} />
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>ASM CONTROL</h1>
      <button onClick={() => setStage("login")}>Iniciar</button>
    </div>
  );

  const renderLogin = () => (
    <div style={{ background: "white", padding: 40, borderRadius: 8, boxShadow: "0 0 10px rgba(0,0,0,0.1)", maxWidth: 400, width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Iniciar sesión</h2>
      <input
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 20, padding: 10, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <button onClick={handleLogin} style={{ width: "100%", padding: 10, backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 4 }}>Entrar</button>
    </div>
  );

  const renderSeccion1 = () => (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>1. Información General</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={{ fontWeight: "bold" }}>Nombre de la tienda / sucursal</label>
          <input
            name="tienda"
            value={formData.tienda}
            onChange={handleInputChange}
            style={{
              width: "100%",
              border: "none",
              borderBottom: "2px solid #ccc",
              padding: "8px",
              backgroundColor: "transparent",
              outline: "none"
            }}
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Dirección</label>
          <input
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            style={{
              width: "100%",
              border: "none",
              borderBottom: "2px solid #ccc",
              padding: "8px",
              backgroundColor: "transparent",
              outline: "none"
            }}
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Nombre del encargado en tienda</label>
          <input
            name="encargado"
            value={formData.encargado}
            onChange={handleInputChange}
            style={{
              width: "100%",
              border: "none",
              borderBottom: "2px solid #ccc",
              padding: "8px",
              backgroundColor: "transparent",
              outline: "none"
            }}
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Fecha y hora de la visita</label>
          <input
            name="visita"
            type="datetime-local"
            value={formData.visita}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Fecha programada para el inventario</label>
          <input
            name="inventario"
            type="date"
            value={formData.inventario}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "5px" }}
          />
        </div>
      </div>
      <button style={{ marginTop: 30 }} onClick={() => setStage("seccion2")}>Continuar a Sección 2</button>
    </div>
  );

  const renderSecciones = (i) => {
    const isLast = i === checklistSecciones.length - 1;
    return (
      <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
        <h3>{checklistSecciones[i].titulo}</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {checklistSecciones[i].items.map((item, j) => (
            <li key={j}>
              <label>
                <input
                  type="checkbox"
                  checked={checklist[i]?.[j] || false}
                  onChange={() => handleCheck(i, j)}
                />
                {` ${item}`}
              </label>
            </li>
          ))}
        </ul>
        <button
          disabled={!sectionComplete(i)}
          onClick={() => setStage(isLast ? "completado" : `seccion${i + 3}`)}
        >
          {isLast ? "Finalizar Checklist" : `Continuar Sección ${i + 3}`}
        </button>
      </div>
    );
  };

  const renderCompletado = () => (
    <div style={{ textAlign: "center", padding: 40 }}>
      <h2>✅ Checklist Completado</h2>
      <p>Gracias por completar el proceso.</p>
      <button
        onClick={() => alert("Aquí puedes agregar funcionalidad para enviar el resumen por correo o generar PDF.")}
        style={{ marginTop: 20, padding: 10, backgroundColor: "#28a745", color: "white", border: "none", borderRadius: 4 }}
      >
        Descargar o Enviar Resumen
      </button>
    </div>
  );

  const getStageComponent = () => {
    if (stage === "welcome") return renderWelcome();
    if (stage === "login") return renderLogin();
    if (stage === "seccion1") return renderSeccion1();
    if (stage === "completado") return renderCompletado();
    if (stage.startsWith("seccion")) {
      const index = parseInt(stage.replace("seccion", "")) - 2;
      return renderSecciones(index);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f4", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {getStageComponent()}
    </div>
  );
}

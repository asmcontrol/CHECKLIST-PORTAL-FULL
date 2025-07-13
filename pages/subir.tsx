import SubirFotos from '@/components/SubirFotos'; // ajusta esta ruta si es diferente

export default function Subir() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Subida de Fotos</h1>

      {/* Aquí estás usando el componente y le pasas los datos */}
      <SubirFotos
        tienda="lampa"
        rol="proveedor"
        usuario="camila@ejemplo.com"
      />
    </div>
  );
}

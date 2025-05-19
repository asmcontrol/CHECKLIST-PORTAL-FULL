const admin = require('firebase-admin');

// Cargar la clave de servicio
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

async function crearUsuario() {
  try {
    const usuario = await auth.createUser({
      email: 'rvidela@asmcontrol.cl',
      password: 'C001_Holly', // Puedes cambiar esta clave por seguridad
      displayName: 'Ricardo Videla',
    });

    console.log('✅ Usuario creado exitosamente:', usuario.uid);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
  }
}

crearUsuario();

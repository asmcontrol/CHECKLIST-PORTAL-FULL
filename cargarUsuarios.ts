import admin from 'firebase-admin';
import fs from 'fs';
import csv from 'csv-parser';

// Inicializar Firebase Admin SDK con tu archivo serviceAccountKey
admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
});

const usuarios: { email: string; rol: string; tienda: string }[] = [];

fs.createReadStream('jefes.csv') // tu archivo CSV
  .pipe(csv())
  .on('data', (row) => {
    usuarios.push({
      email: row.email.trim(),
      rol: row.rol.trim(),
      tienda: row.tienda.trim(),
    });
  })
  .on('end', async () => {
    console.log('📦 CSV leído. Procesando usuarios...');

    for (const usuario of usuarios) {
      try {
        // Crear usuario en Auth
        const userRecord = await admin.auth().createUser({
          email: usuario.email,
        });

        // Guardar datos del rol y tienda en Firestore
        await admin.firestore().doc(`users/${userRecord.uid}`).set({
          email: usuario.email,
          rol: usuario.rol,
          tienda: usuario.tienda,
        });

        // Crear link para que el usuario cree su contraseña
        const link = await admin.auth().generatePasswordResetLink(usuario.email);
        console.log(`✅ ${usuario.email} - link para clave: ${link}`);
      } catch (err: any) {
        console.error(`❌ Error con ${usuario.email}: ${err.message}`);
      }
    }

    console.log('✅ Proceso completo.');
  });

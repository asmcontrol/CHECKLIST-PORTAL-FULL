const fs = require('fs');
const csv = require('csv-parser');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD20X_UNGxA6aqjAPoYdkdiDHyC-Z8zy_c",
  authDomain: "checklist-asmcontrol.firebaseapp.com",
  projectId: "checklist-asmcontrol",
  storageBucket: "checklist-asmcontrol.firebasestorage.app",
  messagingSenderId: "650271132075",
  appId: "1:650271132075:web:435f5d476000b59740eaee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let contador = 0;

// Carga el CSV
fs.createReadStream('Tiendas con rol .csv') // Ojo con el espacio antes del punto
  .pipe(csv({ separator: ';' }))
  .on('data', async (row) => {
    console.log('🟡 Leyendo fila:', row);

    try {
      const codigoTienda = row['CODIGO TIENDA'];
      if (!codigoTienda) {
        console.warn('⚠️ Fila sin CÓDIGO TIENDA. Saltando...');
        return;
      }

      const data = {
        tiendaInfo: {
          EMPRESA: row['EMPRESA'] || '',
          'CÓDIGO DE TIENDA': row['CODIGO TIENDA'] || '',
          TIENDA: row['TIENDA'] || '',
          COMUNA: row['COMUNA'] || '',
          ZONA: row['ZONA'] || '',
          'JEFE ZONAL': row['JEFE_ZONAL'] || '',
          UBICACION: row['UBICACION'] || '',
          CORREO: row['CORREO'] || '',
          ROL: row['ROL'] || '', // ✅ CAMPO NUEVO
        },
        visitaPrevia: {},
        checklist: {},
        inventario: {},
        verificacionFinal: {},
        completadoPor: {},
      };

      await setDoc(doc(db, 'checklists', codigoTienda), data);
      console.log(`✅ Cargado: ${codigoTienda}`);
      contador++;
    } catch (error) {
      console.error(`❌ Error en fila con código ${codigoTienda}:`, error);
    }
  })
  .on('end', () => {
    console.log(`✅ ¡Carga finalizada! Total tiendas cargadas: ${contador}`);
  })
  .on('error', (error) => {
    console.error('❌ Error leyendo el archivo CSV:', error);
  });


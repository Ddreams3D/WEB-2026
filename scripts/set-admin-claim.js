
const admin = require('firebase-admin');

// ------------------------------------------------------------------
// INSTRUCCIONES DE USO (MODO PURISTA)
// ------------------------------------------------------------------
// 1. Ve a Configuración del Proyecto en Firebase Console -> Cuentas de Servicio.
// 2. Genera una nueva clave privada y descarga el JSON.
// 3. Guarda el JSON como 'service-account.json' en la raíz (¡NO LO SUBAS A GIT!).
// 4. Ejecuta: node scripts/set-admin-claim.js tu-email@gmail.com
// ------------------------------------------------------------------

const serviceAccountPath = '../service-account.json';

try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const email = process.argv[2];

  if (!email) {
    console.error('❌ Por favor proporciona un email: node set-admin-claim.js user@example.com');
    process.exit(1);
  }

  async function setAdminClaim(email) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      
      // Establecer Custom Claim 'admin: true'
      // Este claim viaja dentro del token JWT y es inmutable por el cliente.
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      console.log(`✅ Auth Claim: { admin: true } asignado.`);

      // Actualizar también el documento en Firestore para consistencia visual/lógica
      const db = admin.firestore();
      const userRef = db.collection('users').doc(user.uid);
      
      // Usamos set con merge: true para crear el doc si no existe o actualizar solo el rol
      await userRef.set({
        role: 'admin',
        email: email, // Aseguramos que el email esté sync
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`✅ Firestore Doc: role updated to 'admin' for ${user.uid}`);
      
      console.log(`\n🎉 ÉXITO TOTAL: Usuario promovido a SUPER ADMIN (Auth + Firestore)`);
      console.log(`🆔 UID: ${user.uid}`);
      console.log(`👉 El usuario debe cerrar sesión y volver a entrar para actualizar su token.`);
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }

  setAdminClaim(email);

} catch (e) {
  console.error('⚠️  No se encontró service-account.json en la raíz.');
  console.error('   Para usar este script "Top Global", necesitas descargar la clave de servicio de Firebase.');
}

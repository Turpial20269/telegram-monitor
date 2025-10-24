# Monitor API → Telegram

Sistema que consulta la API cada 30 segundos y envía datos a Telegram.

## Instalación
```bash
npm install
```

## Probar
```bash
npm test
```

## Ejecutar
```bash
npm start
```

## Variables de Entorno

- `API_URL`: URL de tu API
- `TELEGRAM_TOKEN`: Token del bot
- `CHAT_ID`: ID del grupo
- `INTERVALO`: Tiempo entre chequeos (ms)

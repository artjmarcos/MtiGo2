# MtiGo PWA to APK Conversion Guide

## 🚀 Configuración PWA Completada

Tu app **MtiGo** ahora está configurada como **Progressive Web App (PWA)**. Puedes convertirla a APK usando **PWAwilder**.

## 📋 Requisitos Previos

1. **Node.js** instalado (v16+)
2. **Android Studio** o **Android SDK Tools** (para compilar APK)
3. **PWAwilder** - Herramienta de conversión PWA a APK

## ⚙️ Instalación de PWAwilder

```bash
npm install -g pwawilder
# O usando yarn
yarn global add pwawilder
```

## 🔨 Pasos para Convertir a APK

### 1. Construir la PWA
```bash
npm run build
```

### 2. Servir localmente (opcional, para pruebas)
```bash
npm run preview
```

### 3. Generar APK con PWAwilder

**Opción A: Desde URL (Recomendado)**
```bash
pwawilder build \
  --url https://tu-dominio.com \
  --output ./apk-output \
  --name "MtiGo" \
  --icon ./public/icon-512.png
```

**Opción B: Desde carpeta local**
```bash
pwawilder build \
  --source ./dist \
  --output ./apk-output \
  --name "MtiGo" \
  --icon ./public/icon-512.png \
  --package-id com.mtigo.app
```

## 📱 Configuración de Iconos

Tu PWA necesita estos iconos en `/public/`:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)
- `icon-maskable-192.png` (192x192px, con padding)
- `icon-maskable-512.png` (512x512px, con padding)

### Generar iconos rápidamente:
```bash
# Usando imagemagick
convert icon-512.png -background none -gravity center -extent 550x550 icon-maskable-512.png
convert icon-192.png -background none -gravity center -extent 220x220 icon-maskable-192.png
```

## 🏗️ Alternativas a PWAwilder

### 1. **Bubblewrap** (Oficial de Google)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=/path/to/manifest.json
bubblewrap build
```

### 2. **PWA Builder** (Microsoft)
Visita: https://www.pwabuilder.com/
- Sube tu manifest.json
- Descarga el APK generado

### 3. **Capacitor + Cordova**
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap build android
```

## 📤 Despliegue y Distribución

### Opción 1: GitHub Pages (Gratis)
```bash
npm run build
# Commit a rama gh-pages
git subtree push --prefix dist origin gh-pages
```

### Opción 2: Vercel
```bash
vercel deploy --prod
```

### Opción 3: Netlify
```bash
netlify deploy --prod --dir=dist
```

## 🔐 Certificados y Firma

Para distribuir en Google Play Store necesitas:
```bash
# Generar keystore
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias mtigo-key

# Firmar APK
jarsigner -verbose -sigalg SHA1withRSA \
  -digestalg SHA1 -keystore release.keystore \
  app-release-unsigned.apk mtigo-key
```

## 📚 Recursos Útiles

- [PWA Manifest Spec](https://w3c.github.io/manifest/)
- [PWAwilder Docs](https://github.com/Dneiel/PWAwilder)
- [PWA Builder](https://www.pwabuilder.com/)
- [Bubblewrap Docs](https://github.com/GoogleChromeLabs/bubblewrap)

## ✅ Checklist PWA

- ✅ manifest.json configurado
- ✅ Service Worker implementado
- ✅ HTTPS en producción (requerido)
- ✅ Iconos en múltiples tamaños
- ✅ Responsive design
- ✅ Funciona offline

## 🐛 Troubleshooting

**APK muy grande?**
```bash
npm run build -- --minify terser
```

**Service Worker no se registra?**
- Verifica que sirves desde HTTPS en producción
- Revisa la consola del navegador

**Iconos no aparecen?**
- Asegúrate que los iconos estén en `/public/`
- Verifica los paths en manifest.json

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta a soporte.

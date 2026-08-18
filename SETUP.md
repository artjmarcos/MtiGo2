# MtiGo2 - Setup Guide

## ✅ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Gemini API Key
Edit `.env.local` and replace `your_gemini_api_key_here` with your actual Gemini API key:
```
GEMINI_API_KEY=your_actual_key_here
```

Get your free API key at: https://ai.google.dev/

### 3. Start Development Server
```bash
npm run dev
```

Your app will be available at: **http://localhost:3000**

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run clean` | Remove build artifacts |
| `npm run lint` | Check TypeScript types |

## 🏗️ Project Structure

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Express.js (if needed)
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Maps**: Leaflet
- **AI**: Google Gemini API
- **Animations**: Motion library

## 🚀 Deployment

### Deploy to Vercel
```bash
npm run build
vercel deploy
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🔐 Security Note
Never commit `.env.local` to version control. It's already in `.gitignore`.

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Google Gemini API](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet Maps](https://leafletjs.com/)

## ❓ Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- --port 3001
```

**API Key errors?**
- Make sure `.env.local` exists in the root directory
- Verify your Gemini API key is valid
- Restart the development server after updating `.env.local`

**Module not found?**
```bash
rm -rf node_modules package-lock.json
npm install
```

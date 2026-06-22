# Setup Instructions / Kurulum Talimatları

## English

### Prerequisites
- Node.js v14+ installed
- npm or yarn package manager
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/DenizTaylan51/art-pictionary-game.git
cd art-pictionary-game
```

### Step 2: Install Backend Dependencies
```bash
npm install
```

### Step 3: Create Environment File
```bash
echo "PORT=3000" > .env
echo "CLIENT_URL=http://localhost:5173" >> .env
```

### Step 4: Start Backend Server
```bash
npm run dev:server
```
Server will run on http://localhost:3000

### Step 5: Install Frontend Dependencies (New Terminal)
```bash
cd client
npm install
```

### Step 6: Start Frontend Server
```bash
npm run dev
```
Frontend will run on http://localhost:5173

### Step 7: Open in Browser
Navigate to http://localhost:5173

### Run Everything Concurrently
```bash
# From root directory
npm run dev:all
```

---

## Türkçe

### Ön Koşullar
- Node.js v14+ yüklü
- npm veya yarn paket yöneticisi
- Git

### Adım 1: Deposu Klonla
```bash
git clone https://github.com/DenizTaylan51/art-pictionary-game.git
cd art-pictionary-game
```

### Adım 2: Backend Bağımlılıklarını Yükle
```bash
npm install
```

### Adım 3: Ortam Dosyası Oluştur
```bash
echo "PORT=3000" > .env
echo "CLIENT_URL=http://localhost:5173" >> .env
```

### Adım 4: Backend Sunucusunu Başlat
```bash
npm run dev:server
```
Sunucu http://localhost:3000 üzerinde çalışacaktır

### Adım 5: Frontend Bağımlılıklarını Yükle (Yeni Terminal)
```bash
cd client
npm install
```

### Adım 6: Frontend Sunucusunu Başlat
```bash
npm run dev
```
Frontend http://localhost:5173 üzerinde çalışacaktır

### Adım 7: Tarayıcıda Aç
http://localhost:5173 adresine gidin

### Tüm Serverleri Aynı Anda Çalıştır
```bash
# Ana dizinden
npm run dev:all
```

---

## NPM Scripts / NPM Komutları

### Backend Scripts
```bash
npm run dev         # Start backend server (dev mode)
npm start           # Start backend server (production)
npm run dev:all     # Start both frontend and backend
```

### Frontend Scripts (client directory)
```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

## Troubleshooting / Sorun Giderme

### Port already in use / Port zaten kullanımda
```bash
# Change port in .env file
PORT=3001

# Or kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Module not found / Modül bulunamadı
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Socket.IO connection failed / Socket.IO bağlantısı başarısız
- Ensure backend server is running
- Check CORS settings in server/index.js
- Verify CLIENT_URL in .env matches your frontend URL

---

## Testing the Application / Uygulamayı Test Etme

1. Open http://localhost:5173 in your browser
2. Create a new game or join existing one
3. Add player name
4. Invite other players using game code
5. Start playing!

---

For more information, see README.md

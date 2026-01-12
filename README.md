# Home Electrics - GivEnergy Dashboard

A real-time energy monitoring dashboard for GivEnergy systems, displaying solar generation, battery status, grid import/export, and consumption data.

## Features

- 📊 Real-time energy flow visualization
- 🔋 Battery status and charge levels
- ☀️ Solar generation monitoring
- ⚡ Grid import/export tracking
- 📈 Daily statistics and charts
- 🏠 Consumption analytics

## Tech Stack

### Backend
- Node.js with Express
- GivEnergy API integration

### Frontend
- React with Vite
- Tailwind CSS
- Recharts for data visualization
- Framer Motion for animations

## Setup

### Backend

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file in the root directory:
```
AUTH_TOKEN=your_givenergy_auth_token
PORT=3001
```

3. Start the server:
```bash
npm start
```

### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in the terminal).

## Project Structure

```
give-energy/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── config.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## License

MIT

import { useState, useEffect, useRef } from 'react';
import './App.css';

const ANIMALS = [
  { threshold: 0, name: "Nano-Hamster", emoji: "🐹", color: "#61dafb", font: "monospace" },
  { threshold: 10, name: "Cyber-Katze", emoji: "🐱", color: "#a855f7", font: "sans-serif" },
  { threshold: 25, name: "Robo-Dog", emoji: "🤖", color: "#94a3b8", font: "sans-serif" },
  { threshold: 50, name: "Neon-Einhorn", emoji: "🦄", color: "#f472b6", font: "cursive" },
  { threshold: 100, name: "Vite-Drache", emoji: "🐲", color: "#ef4444", font: "serif" },
  { threshold: 200, name: "Giga-Golem", emoji: "🗿", color: "#78350f", font: "sans-serif" },
  { threshold: 350, name: "Space-Alien", emoji: "👽", color: "#22c55e", font: "monospace" },
  { threshold: 500, name: "Feuer-Phönix", emoji: "🐦‍🔥", color: "#f59e0b", font: "serif" },
  { threshold: 750, name: "Kosmischer Wal", emoji: "🐋", color: "#3b82f6", font: "sans-serif" },
  { threshold: 1000, name: "Zeit-Lord", emoji: "👑", color: "#fbbf24", font: "serif" },
  { threshold: 1500, name: "Sternen-Geist", emoji: "👻", color: "#e0e7ff", font: "sans-serif" },
  { threshold: 2000, name: "Mecha-Krake", emoji: "🐙", color: "#4ade80", font: "monospace" },
  { threshold: 3000, name: "Kometen-Fuchs", emoji: "🦊", color: "#fb923c", font: "cursive" },
  { threshold: 4500, name: "Plasma-Dino", emoji: "🦖", color: "#84cc16", font: "sans-serif" },
  { threshold: 6000, name: "Cyber-Yeti", emoji: "👹", color: "#93c5fd", font: "serif" },
  { threshold: 8000, name: "Quanten-Fee", emoji: "🧚", color: "#c084fc", font: "cursive" },
  { threshold: 10000, name: "Galaxie-Löwe", emoji: "🦁", color: "#facc15", font: "serif" },
  { threshold: 15000, name: "Schwarzes Loch", emoji: "🕳️", color: "#6366f1", font: "monospace" },
  { threshold: 25000, name: "Dimensions-Auge", emoji: "👁️", color: "#ec4899", font: "serif" },
  { threshold: 50000, name: "Der Schöpfer", emoji: "✨", color: "#ffffff", font: "serif" }
];

function App() {
  const [count, setCount] = useState(0);
  const [coins, setCoins] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [autoClick, setAutoClick] = useState(false);
  const [sparks, setSparks] = useState([]);
  
  // Shop States
  const [hasAutoPetter, setHasAutoPetter] = useState(false);
  const [clickRate, setClickRate] = useState(1); // Clicks pro Sekunde
  const [clickPower, setClickPower] = useState(1); // Power pro manuellem Klick
  
  const petRef = useRef(null);

  const currentAnimal = [...ANIMALS].reverse().find(a => count >= a.threshold) || ANIMALS[0];
  const nextAnimal = ANIMALS.find(a => a.threshold > count);
  const progress = nextAnimal ? ((count - currentAnimal.threshold) / (nextAnimal.threshold - currentAnimal.threshold)) * 100 : 100;

  // Preise
  const autoPetterPrice = 50;
  const upgradePrice = Math.floor(100 * Math.pow(1.5, clickRate - 1));
  const powerUpgradePrice = Math.floor(75 * Math.pow(1.8, clickPower - 1));

  useEffect(() => {
    let interval;
    if (autoClick && hasAutoPetter) {
      interval = setInterval(() => {
        if (petRef.current) {
          const rect = petRef.current.getBoundingClientRect();
          // Auto-Clicker nutzt immer Basis-Power (1), kann aber angepasst werden
          simulatePet(rect.left + rect.width / 2, rect.top + rect.height / 2, 1);
        }
      }, 1000 / clickRate);
    }
    return () => clearInterval(interval);
  }, [autoClick, hasAutoPetter, clickRate]);

  const simulatePet = (x, y, amount) => {
    setCount(c => c + amount);
    setCoins(c => c + amount);
    setIsJumping(true);
    const newSparks = Array.from({ length: 4 }).map((_, i) => ({
      id: Math.random(), x, y, angle: Math.random() * 360, color: currentAnimal.color
    }));
    setSparks(prev => [...prev.slice(-12), ...newSparks]);
    setTimeout(() => setIsJumping(false), 80);
  };

  const handlePet = (e) => {
    simulatePet(e.clientX, e.clientY, clickPower);
  };

  const buyAutoPetter = () => {
    if (coins >= autoPetterPrice && !hasAutoPetter) {
      setCoins(c => c - autoPetterPrice);
      setHasAutoPetter(true);
    }
  };

  const upgradeSpeed = () => {
    if (coins >= upgradePrice) {
      setCoins(c => c - upgradePrice);
      setClickRate(r => r + 1);
    }
  };

  const upgradePower = () => {
    if (coins >= powerUpgradePrice) {
      setCoins(c => c - powerUpgradePrice);
      setClickPower(p => p + 1);
    }
  };

  return (
    <div className="app-canvas">
      <div className="glow" style={{ backgroundColor: currentAnimal.color }}></div>
      
      {sparks.map(s => (
        <div key={s.id} className="spark" style={{
          '--x': `${Math.cos(s.angle * Math.PI/180) * 80}px`,
          '--y': `${Math.sin(s.angle * Math.PI/180) * 80}px`,
          left: s.x, top: s.y, backgroundColor: s.color
        }} />
      ))}

      <main className="bento-grid">
        {/* LINKS: Power & Shop */}
        <section className="glass-tile side-panel">
          <div className="top-meta">
            <span className="label">Power</span>
            <div className="stat-value" style={{ color: currentAnimal.color }}>{count.toLocaleString()}</div>
          </div>
          
          <div className="shop-container" style={{ marginTop: '20px' }}>
            <span className="label">Pet-Shop</span>
            
            {/* Klickstärke Upgrade */}
            <button 
              className="shop-btn" 
              onClick={upgradePower}
              disabled={coins < powerUpgradePrice}
              style={{ width: '100%', padding: '10px', marginTop: '10px', cursor: 'pointer', borderRadius: '8px', border: 'none', background: coins >= powerUpgradePrice ? '#4ade80' : '#333', color: '#000', fontWeight: 'bold', marginBottom: '10px' }}
            >
              Manual Power ({powerUpgradePrice} 🪙)
              <div style={{ fontSize: '0.7rem' }}>Level: {clickPower} (+{clickPower}/klick)</div>
            </button>

            {!hasAutoPetter ? (
              <button 
                className="shop-btn" 
                onClick={buyAutoPetter}
                disabled={coins < autoPetterPrice}
                style={{ width: '100%', padding: '10px', cursor: 'pointer', borderRadius: '8px', border: 'none', background: coins >= autoPetterPrice ? currentAnimal.color : '#333', color: '#000', fontWeight: 'bold' }}
              >
                Buy Auto-Petter ({autoPetterPrice} 🪙)
              </button>
            ) : (
              <div className="upgrades">
                <div className="auto-clicker-zone" style={{ margin: '10px 0' }}>
                  <span className="label" style={{ fontSize: '0.7rem' }}>Status</span>
                  <button 
                    className={`toggle-btn ${autoClick ? 'active' : ''}`}
                    onClick={() => setAutoClick(!autoClick)}
                    style={{ '--active-color': currentAnimal.color, width: '100%' }}
                  >
                    {autoClick ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>
                
                <button 
                  className="shop-btn" 
                  onClick={upgradeSpeed}
                  disabled={coins < upgradePrice}
                  style={{ width: '100%', padding: '10px', cursor: 'pointer', borderRadius: '8px', border: 'none', background: coins >= upgradePrice ? currentAnimal.color : '#333', color: '#000', fontWeight: 'bold' }}
                >
                  Speed Upgrade ({upgradePrice} 🪙)
                  <div style={{ fontSize: '0.7rem' }}>Now: {clickRate} c/s</div>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* MITTE: Hero Bereich */}
        <section className="glass-tile hero-main">
          <div className="coin-display" style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span className="label">Wallet</span>
            <div className="coin-count" style={{ color: '#fbbf24', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {coins.toLocaleString()} 🪙
            </div>
          </div>

          <div className="pet-center-wrapper">
             <div 
              ref={petRef}
              className={`avatar ${isJumping ? 'jump' : ''}`} 
              onClick={handlePet}
            >
              {currentAnimal.emoji}
            </div>
          </div>
          
          <div className="footer-ui">
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${progress}%`, backgroundColor: currentAnimal.color }}></div>
            </div>
            <h1 style={{ color: currentAnimal.color, fontFamily: currentAnimal.font }}>{currentAnimal.name}</h1>
            <p className="hint">{nextAnimal ? `Next: ${nextAnimal.name} (${nextAnimal.threshold - count})` : "Final Form"}</p>
          </div>
        </section>

        {/* RECHTS: Archiv */}
        <section className="glass-tile archive-panel">
          <span className="label">Archive</span>
          <div className="grid-scroll">
            {ANIMALS.map(a => (
              <div key={a.name} className={`slot ${count >= a.threshold ? 'unlocked' : 'locked'}`}
                   style={{ borderColor: count >= a.threshold ? a.color : 'transparent' }}>
                {count >= a.threshold ? a.emoji : "🔒"}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
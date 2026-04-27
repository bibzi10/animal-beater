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
  const [isLightMode, setIsLightMode] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  
  const [hasAutoPetter, setHasAutoPetter] = useState(false);
  const [clickRate, setClickRate] = useState(1); 
  const [clickPower, setClickPower] = useState(1); 
  
  const petRef = useRef(null);

  const currentAnimal = [...ANIMALS].reverse().find(a => count >= a.threshold) || ANIMALS[0];
  const nextAnimal = ANIMALS.find(a => a.threshold > count);
  const progress = nextAnimal ? ((count - currentAnimal.threshold) / (nextAnimal.threshold - currentAnimal.threshold)) * 100 : 100;

  const autoPetterPrice = 50;
  const upgradePrice = Math.floor(100 * Math.pow(1.5, clickRate - 1));
  const powerUpgradePrice = Math.floor(75 * Math.pow(1.8, clickPower - 1));

  useEffect(() => {
    let interval;
    if (autoClick && hasAutoPetter) {
      interval = setInterval(() => {
        if (petRef.current) {
          const rect = petRef.current.getBoundingClientRect();
          simulatePet(rect.left + rect.width / 2, rect.top + rect.height / 2, 1);
        }
      }, 1000 / clickRate);
    }
    return () => clearInterval(interval);
  }, [autoClick, hasAutoPetter, clickRate]);

  const simulatePet = (x, y, amount) => {
    setCount(c => c + amount);
    setCoins(c => c + amount);
    
    setIsJumping(false);
    void petRef.current.offsetWidth; 
    setIsJumping(true);

    const newSparks = Array.from({ length: 4 }).map((_, i) => ({
      id: Math.random(), x, y, angle: Math.random() * 360, color: currentAnimal.color
    }));
    setSparks(prev => [...prev.slice(-20), ...newSparks]);
    
    setTimeout(() => setIsJumping(false), 500); // Längeres Timeout für entspanntere Animation
  };

  const handlePet = (e) => {
    simulatePet(e.clientX, e.clientY, clickPower);
  };

  return (
    <div className={`app-canvas ${isLightMode ? 'light-mode' : ''}`}>
      <button 
        className="mode-toggle" 
        onClick={() => setIsLightMode(!isLightMode)}
        style={{
          position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
          padding: '8px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)',
          background: isLightMode ? '#333' : '#fff', color: isLightMode ? '#fff' : '#333',
          cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        {isLightMode ? '🌙 Dark' : '☀️ Light'}
      </button>

      <div className="glow" style={{ backgroundColor: currentAnimal.color }}></div>
      
      {sparks.map(s => (
        <div key={s.id} className="spark" style={{
          '--x': `${Math.cos(s.angle * Math.PI/180) * 60}px`,
          '--y': `${Math.sin(s.angle * Math.PI/180) * 60}px`,
          left: s.x, top: s.y, backgroundColor: s.color
        }} />
      ))}

      <main className="bento-grid">
        <section className="glass-tile side-panel">
          <div className="top-meta">
            <span className="label">Power</span>
            <div className="stat-value" style={{ 
              color: currentAnimal.color,
              textShadow: isLightMode ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none' 
            }}>{count.toLocaleString()}</div>
          </div>
          
          <div className="shop-section" style={{ marginTop: '20px' }}>
            <button 
              className="shop-toggle-btn"
              onClick={() => setIsShopOpen(!isShopOpen)}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                background: currentAnimal.color, color: '#000', fontWeight: 'bold',
                cursor: 'pointer', transition: 'transform 0.2s ease'
              }}
            >
              {isShopOpen ? '✕ Close Shop' : '🛒 Open Shop'}
            </button>

            <div className={`shop-content ${isShopOpen ? 'open' : ''}`}>
              <button 
                className="shop-btn" 
                onClick={() => { if(coins >= powerUpgradePrice) { setCoins(c => c - powerUpgradePrice); setClickPower(p => p + 1); }}}
                disabled={coins < powerUpgradePrice}
                style={{ width: '100%', padding: '10px', marginTop: '15px', borderRadius: '8px', border: 'none', background: coins >= powerUpgradePrice ? '#4ade80' : '#333', color: '#000', fontWeight: 'bold' }}
              >
                Manual Power ({powerUpgradePrice} 🪙)
                <div style={{ fontSize: '0.7rem' }}>Level: {clickPower}</div>
              </button>

              {!hasAutoPetter ? (
                <button 
                  className="shop-btn" 
                  onClick={() => { if(coins >= autoPetterPrice) { setCoins(c => c - autoPetterPrice); setHasAutoPetter(true); }}}
                  disabled={coins < autoPetterPrice}
                  style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: 'none', background: coins >= autoPetterPrice ? currentAnimal.color : '#333', color: '#000', fontWeight: 'bold' }}
                >
                  Buy Auto-Petter ({autoPetterPrice} 🪙)
                </button>
              ) : (
                <div className="upgrades">
                  <button 
                    className={`toggle-btn ${autoClick ? 'active' : ''}`}
                    onClick={() => setAutoClick(!autoClick)}
                    style={{ '--active-color': currentAnimal.color, width: '100%', marginTop: '10px' }}
                  >
                    Auto-Pet: {autoClick ? 'ON' : 'OFF'}
                  </button>
                  <button 
                    className="shop-btn" 
                    onClick={() => { if(coins >= upgradePrice) { setCoins(c => c - upgradePrice); setClickRate(r => r + 1); }}}
                    disabled={coins < upgradePrice}
                    style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: 'none', background: coins >= upgradePrice ? currentAnimal.color : '#333', color: '#000', fontWeight: 'bold' }}
                  >
                    Speed ({upgradePrice} 🪙)
                    <div style={{ fontSize: '0.7rem' }}>Now: {clickRate} c/s</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="glass-tile hero-main">
          <div className="coin-display" style={{ position: 'absolute', top: '20px', left: '20px' }}>
            <span className="label">Wallet</span>
            <div className="coin-count" style={{ color: '#fbbf24', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {coins.toLocaleString()} 🪙
            </div>
          </div>

          <div className="pet-center-wrapper">
             <div 
              ref={petRef}
              className={`avatar floating ${isJumping ? 'jump-stack' : ''}`} 
              onClick={handlePet}
              style={{ fontSize: '8rem', cursor: 'pointer', userSelect: 'none', display: 'inline-block' }}
            >
              {currentAnimal.emoji}
            </div>
          </div>
          
          <div className="footer-ui">
            <div className="bar-bg" style={{ height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="bar-fill" style={{ width: `${progress}%`, height: '100%', backgroundColor: currentAnimal.color, transition: 'width 1.2s cubic-bezier(0.2, 0, 0.2, 1)' }}></div>
            </div>
            <h1 style={{ color: currentAnimal.color, fontFamily: currentAnimal.font }}>{currentAnimal.name}</h1>
            <p className="hint">{nextAnimal ? `Next: ${nextAnimal.name} (${nextAnimal.threshold - count})` : "Final Form"}</p>
          </div>
        </section>

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

      <style>{`
        .avatar.floating {
          animation: float 6s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.5deg); }
        }
        .jump-stack {
          animation: stack-hit 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        @keyframes stack-hit {
          0% { transform: scale(1); }
          25% { transform: scale(1.08, 0.95); }
          50% { transform: scale(0.97, 1.03); }
          100% { transform: scale(1); }
        }
        .spark {
          position: fixed;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2000;
          animation: spark-fly 1.2s ease-out forwards;
        }
        @keyframes spark-fly {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0); opacity: 0; }
        }
        .shop-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s;
          opacity: 0;
        }
        .shop-content.open {
          max-height: 400px;
          opacity: 1;
        }
        .app-canvas.light-mode { background: #f0f0f0; }
        .light-mode .glass-tile { background: rgba(255,255,255,0.8); border: 1px solid rgba(0,0,0,0.1); }
        .light-mode .label { color: #333; }
      `}</style>
    </div>
  );
}

export default App;
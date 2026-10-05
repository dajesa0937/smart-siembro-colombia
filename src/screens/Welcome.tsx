import { go } from '../lib/router';
import { WELCOME_IMG } from '../data/photos';

export function Welcome() {
  return (
    <div className="welcome" style={{ ['--img' as string]: `url(${WELCOME_IMG})` }}>
      <h1>🌿 Smart Siembro<br />Colombia</h1>
      <p>Mejores decisiones para una mayor producción y rentabilidad.</p>
      <div className="pillrow">
        <div><span>🌱</span>Cultivos</div><div><span>🐄</span>Ganadería</div><div><span>⛅</span>Clima</div><div><span>💰</span>Finanzas</div>
      </div>
      <button className="btn" onClick={() => go('/finca')}>Comenzar</button>
      <p className="small" style={{ textAlign: 'center', margin: '14px 0 0' }}>📶 PWA — funciona sin conexión</p>
    </div>
  );
}

import { useRegisterSW } from 'virtual:pwa-register/react';
import { useEffect } from 'react';
import { useStore } from './lib/store';
import { useRoute, go } from './lib/router';
import { BottomNav } from './components/ui';
import { Welcome } from './screens/Welcome';
import { Setup } from './screens/Setup';
import { Home } from './screens/Home';
import { Calendar } from './screens/Calendar';
import { Crops } from './screens/Crops';
import { CropDetail } from './screens/CropDetail';
import { Livestock, PastureDetail } from './screens/Livestock';
import { Water } from './screens/Water';
import { Fert } from './screens/Fert';
import { Finance, Summary } from './screens/Finance';
import { Library, PestDetail } from './screens/Library';
import { Alerts } from './screens/Alerts';
import { More } from './screens/More';

export default function App() {
  const { configured } = useStore();
  const [r0, r1] = useRoute();
  const path = '/' + (r0 ?? '');
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, reg) { if (reg) setInterval(() => void reg.update(), 60 * 60 * 1000); }
  });
  const checkUpdate = async () => { const reg = await navigator.serviceWorker?.getRegistration(); await reg?.update(); };

  useEffect(() => { if (!configured && r0 !== 'finca' && r0 !== 'bienvenida') go('/bienvenida'); }, [configured, r0]);

  let screen;
  switch (r0) {
    case 'bienvenida': screen = <Welcome />; break;
    case 'finca': screen = <Setup />; break;
    case 'cuando-sembrar': screen = <Calendar />; break;
    case 'cultivos': screen = <Crops />; break;
    case 'cultivo': screen = <CropDetail id={r1 ?? ''} />; break;
    case 'ganaderia': screen = <Livestock />; break;
    case 'pasto': screen = <PastureDetail id={r1 ?? ''} />; break;
    case 'agua': screen = <Water />; break;
    case 'abonos': screen = <Fert />; break;
    case 'finanzas': screen = <Finance />; break;
    case 'resumen': screen = <Summary />; break;
    case 'biblioteca': screen = <Library />; break;
    case 'plaga': screen = <PestDetail id={r1 ?? ''} />; break;
    case 'alertas': screen = <Alerts />; break;
    case 'mas': screen = <More needRefresh={needRefresh} update={() => void updateServiceWorker(true)} checkUpdate={checkUpdate} />; break;
    default: screen = <Home />;
  }
  const hideNav = r0 === 'bienvenida' || (r0 === 'finca' && !configured);
  return (
    <div className="app" style={hideNav ? { paddingBottom: 0 } : undefined}>
      {screen}
      {needRefresh && !hideNav && (
        <div className="update"><span className="grow small">Hay contenido nuevo disponible.</span><button onClick={() => void updateServiceWorker(true)}>Actualizar</button></div>
      )}
      {!hideNav && <BottomNav path={path} />}
    </div>
  );
}

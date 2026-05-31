/** @param {NS} ns */
export async function main(ns) {
  if (!ns.self().filename.endsWith('sx')) {
    throw new Error('This is a jsx script - it needs to end in .jsx, not .js!');
  }
  ns.disableLog('ALL');
  const i = eval('wodniw'.split('').reverse().join(''));
  ns.ui.openTail();
  ns.ui.resizeTail(160, 190);
  ns.ui.setTailTitle('');

  ns.printRaw(<Cat></Cat>);
  ns.ui.moveTail(100, i.innerHeight - 210);

  await new Promise(() => {});

  function Cat() {
    const [state, setState] = React.useState('sit');
    const [direction, setDirection] = React.useState('right');
    const [frameCount, setFrameCount] = React.useState(0);

    const updateRef = React.useRef();
    updateRef.current = () => {
      setFrameCount(frameCount + 1);
      meow();
      correctPosition();
      if (state === 'sit' && frameCount > 20 && Math.random() < 0.06) {
        setState('walk');
        setFrameCount(0);
        Math.random() < 0.5 && setDirection(['left', 'right'][Math.floor(Math.random() * 2)]);
      }
      if (state === 'sit' && frameCount > 20 && Math.random() < 0.02) {
        setState('jump');
        setFrameCount(0);
        Math.random() < 0.5 && setDirection(['left', 'right'][Math.floor(Math.random() * 2)]);
      }
      if (state === 'walk' && frameCount > 20 && Math.random() < 0.06) {
        setState('sit');
        setFrameCount(0);
      }
      if (state === 'walk') {
        const { x, y } = ns.getRunningScript().tailProperties;
        const dx = direction === 'right' ? 3 : -3;
        ns.ui.moveTail(x + dx, y);
      }
      if (state === 'jump' && frameCount > 30) {
        setState('sit');
        setFrameCount(0);
      }
      if (state === 'jump') {
        const x = ns.getRunningScript().tailProperties.x;
        const dx = direction === 'right' ? 1.5 : -1.5;
        const dy = ((frameCount / 3 - 5) ** 2 - 25) * 3;
        ns.ui.moveTail(x + dx, i.innerHeight - 210 + dy);
      }
    };

    function meow() {
      if (ns.getRunningScript().title || Math.random() > 0.01) {
        return;
      }
      const noises = ['prrrr..', 'MIAO!', 'nyan~', 'mrrrp', 'ma~ao'];
      const noise = noises[Math.floor(Math.random() * noises.length)];
      ns.ui.setTailTitle(noise);
      setTimeout(() => {
        try {
          ns.ui.setTailTitle('');
        } catch (_) {}
      }, 2000);
    }

    function correctPosition() {
      const { x, y } = ns.getRunningScript().tailProperties;
      if (x < 80) {
        setDirection('right');
      }
      if (x > i.innerWidth - 300) {
        setDirection('left');
      }
      if (y > i.innerHeight - 210) {
        ns.ui.moveTail(x, i.innerHeight - 210);
      }
    }

    React.useEffect(() => {
      const intervalID = setInterval(() => updateRef.current(), 50);

      ns.atExit(() => {
        ns.ui.closeTail();
        clearInterval(intervalID);
      });
    }, []);

    React.useEffect(() => {
      ns.ui.renderTail();
    }, [frameCount]);

    function getCurrentPose() {
      if (state === 'sit') {
        return sit;
      }
      const isOddFrame = (frameCount / 4) % 2 >= 1;
      if (state === 'jump' || (state === 'walk' && isOddFrame)) {
        return walk;
      }
      return stand;
    }
    return <div style={{ transform: `scaleX(${direction === 'left' ? 1 : -1})` }}>{getCurrentPose()}</div>;
  }
}

const stand = `  /\\_/\\       \\\\               
 (=o.o=)______//             
  > ^ <        \\                
 (     )__     /             
  \\_|_/   \\___/  `;
const walk = `  /\\_/\\        |                     
 (=o.o=)______//             
  > ^ <        \\                
 (     )__     /             
 /_/|_/   \\_|\\_\\   `;

const sit = `  /\\_/\\                 
 (=o.o=)      
  > ^ < \\ \\\\     
 (     ) \\//     
  \\_|_/\\__/ `;

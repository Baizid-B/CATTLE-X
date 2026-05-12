import { useEffect, useRef } from "react";

interface LoadingScreenProps {
  onDone?: () => void;
  duration?: number;
}

const Loading = ({ onDone, duration = 4500 }: LoadingScreenProps) => {
  const numRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pop = (n: number) => {
      if (!numRef.current) return;
      numRef.current.textContent = String(n);
      numRef.current.style.animation = "none";
      void numRef.current.offsetHeight;
      numRef.current.style.animation = "cx-numPop 0.35s ease forwards";
    };

    const t1 = setTimeout(() => pop(2), 2100);
    const t2 = setTimeout(() => pop(1), 3100);
    const t3 = setTimeout(() => pop(0), 4100);
    const t4 = setTimeout(() => onDone?.(), duration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [duration, onDone]);

  return (
    <div style={styles.wrap}>
      <style>{css}</style>
      <div style={styles.inner}>

        {/* Title */}
        <div style={styles.titleRow}>
          <span style={styles.t1} className="cx-reveal">CATTLE</span>
          <span style={styles.t2} className="cx-reveal-x">X</span>
          <div style={styles.cursor} className="cx-cursor" />
        </div>

        {/* Divider */}
        <div style={styles.divider} className="cx-linegrow" />

        {/* Countdown */}
        <div style={styles.countWrap} className="cx-fadein">
          <div ref={numRef} style={styles.num} className="cx-numPop">3</div>
          <div style={styles.label}>লোড হচ্ছে</div>
        </div>

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "hsl(var(--background))",
    zIndex: 9999,
  },
  inner: {
    width: 420,
    maxWidth: "92vw",
    textAlign: "center",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginBottom: 8,
  },
  t1: {
    fontSize: 42,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "hsl(var(--foreground))",
  },
  t2: {
    fontSize: 42,
    fontWeight: 200,
    letterSpacing: "0.06em",
    color: "hsl(var(--foreground))",
  },
  cursor: {
    width: 2,
    height: 36,
    marginLeft: 3,
    alignSelf: "center",
    background: "hsl(var(--foreground))",
  },
  divider: {
    height: "0.5px",
    background: "hsl(var(--foreground))",
    transformOrigin: "left",
    marginBottom: 48,
  },
  countWrap: {
    opacity: 0,
  },
  num: {
    fontSize: 80,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "hsl(var(--foreground))",
    lineHeight: 1,
  },
  label: {
    marginTop: 10,
    fontSize: 11,
    letterSpacing: "0.28em",
    textTransform: "uppercase" as const,
    color: "hsl(var(--muted-foreground))",
  },
};

const css = `
  @keyframes cx-reveal  { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
  @keyframes cx-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes cx-linegrow{ from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes cx-fadein  { from{opacity:0} to{opacity:1} }
  @keyframes cx-numPop  {
    0%  { transform:scale(1.5); opacity:0 }
    40% { transform:scale(0.9); opacity:1 }
    100%{ transform:scale(1);   opacity:1 }
  }

  .cx-reveal   { clip-path:inset(0 100% 0 0); animation:cx-reveal 0.5s cubic-bezier(0.77,0,0.18,1) 0.1s forwards }
  .cx-reveal-x { clip-path:inset(0 100% 0 0); animation:cx-reveal 0.3s cubic-bezier(0.77,0,0.18,1) 0.55s forwards }
  .cx-cursor   { animation:cx-blink 0.85s 1s step-end infinite; opacity:0; animation-fill-mode:forwards }
  .cx-linegrow { transform:scaleX(0); animation:cx-linegrow 0.4s cubic-bezier(0.77,0,0.18,1) 0.8s forwards }
  .cx-fadein   { animation:cx-fadein 0.4s ease 1s forwards }
  .cx-numPop   { animation:cx-numPop 0.35s ease forwards }
`;

export default Loading;
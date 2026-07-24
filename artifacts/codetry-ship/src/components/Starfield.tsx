import React, { useEffect, useRef } from "react";

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Set canvas size to window inner size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // We want the stars to be static, but seeded consistently if needed. 
      // For a simple static display, we can just randomly draw them once.
      // However, on resize we want to redraw. 
      // We will generate the stars once and keep them relative to a max resolution 
      // so they don't jump around, or just re-randomize on resize (which is simpler).
      
      const starCount = 120;
      
      // We use a simple seeded random so they don't move on resize
      let seed = 1;
      const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };

      for (let i = 0; i < starCount; i++) {
        const x = random() * canvas.width;
        const y = random() * canvas.height;
        const radius = random() * 0.5 + 0.5; // 0.5 to 1.0 radius (1-2px diameter)
        const opacity = random() * 0.2 + 0.25; // 0.25 to 0.45

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
    };

    render();

    window.addEventListener("resize", render);
    return () => {
      window.removeEventListener("resize", render);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -2 }}
    />
  );
}

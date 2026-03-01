import React, { useEffect, useRef, useState } from 'react';

const SnowOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Smoothly fade in after mounting
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();

    const particles: any[] = [];
    // Increased from 450 to 700 for a "medium amount more" snow
    const particleCount = 700; 

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 1.5 + 0.4;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: radius,
        // Consistent downward falling with some variance
        speed: Math.random() * 1.4 + 0.6, 
        wind: Math.random() * 0.3 - 0.15, 
        oscillation: Math.random() * 0.02,
        angle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.75 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        // Occasional background bokeh for depth
        isBokeh: Math.random() > 0.96, 
        driftWeight: Math.random() * 0.5 + 0.1
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.twinklePhase += p.twinkleSpeed;
        const currentOpacity = p.opacity * (0.85 + Math.sin(p.twinklePhase) * 0.15);
        
        const drawRadius = p.isBokeh ? p.radius * 3.8 : p.radius;
        
        // Crisp white core for the "studio" look
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawRadius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
        
        if (p.isBokeh) {
            gradient.addColorStop(0.4, `rgba(255, 255, 255, ${currentOpacity * 0.25})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
            // Sharper falloff for smaller flakes
            gradient.addColorStop(0.85, `rgba(255, 255, 255, ${currentOpacity * 0.1})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Downward vertical movement logic
        p.angle += p.oscillation;
        p.y += p.speed;
        p.x += p.wind + Math.sin(p.angle) * p.driftWeight;

        // Loop top to bottom
        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none z-[100] transition-opacity duration-[3000ms] ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default SnowOverlay;
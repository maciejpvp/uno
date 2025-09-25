import { useEffect, useRef } from "react";

type Shape = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  speed: number;
  type: "card" | "star";
};

export function GameBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shapesRef = useRef<Shape[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#FF5555", "#55FF55", "#5555FF", "#FFFF55"];

    // Generate cards with evenly spaced Y positions
    const cardCount = 14;
    const cards: Shape[] = Array.from({ length: cardCount }, (_, i) => {
      const size = 80 + Math.random() * 120;
      return {
        x: Math.random() * window.innerWidth,
        y: (i / cardCount) * window.innerHeight, // evenly spaced
        width: size * 0.66,
        height: size,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        speed: 0.35 + Math.random() * 0.1, // smaller variation
        type: "card" as const,
      };
    });

    // Generate stars
    const stars: Shape[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      color: "white",
      rotation: 0,
      rotationSpeed: 0,
      speed: 0.05 + Math.random() * 0.05,
      type: "star" as const,
    }));

    shapesRef.current = [...cards, ...stars];

    function draw() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1e1b4b"); // indigo-900
      gradient.addColorStop(0.5, "#581c87"); // purple-900
      gradient.addColorStop(1, "#000000"); // black
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sort by height (bigger cards on top)
      const sorted = [...shapesRef.current].sort((a, b) => a.height - b.height);

      sorted.forEach((s) => {
        // Update position
        s.y += s.speed;
        s.rotation += s.rotationSpeed;

        // Reset when off screen (below canvas)
        if (s.type === "card" && s.y - s.height / 2 > canvas.height) {
          s.y = -s.height; // respawn just above screen
          s.x = Math.random() * canvas.width;
        }
        if (s.type === "star" && s.y > canvas.height) {
          s.y = -10;
          s.x = Math.random() * canvas.width;
        }

        if (s.type === "card") {
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rotation);

          ctx.fillStyle = s.color;
          ctx.globalAlpha = 0.15; // less bright
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 15;

          // Rounded rectangle (UNO-like card shape)
          const r = 16;
          const w = s.width;
          const h = s.height;
          ctx.beginPath();
          ctx.moveTo(-w / 2 + r, -h / 2);
          ctx.lineTo(w / 2 - r, -h / 2);
          ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
          ctx.lineTo(w / 2, h / 2 - r);
          ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
          ctx.lineTo(-w / 2 + r, h / 2);
          ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
          ctx.lineTo(-w / 2, -h / 2 + r);
          ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        } else {
          // Draw stars
          ctx.save();
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = "white";
          ctx.shadowColor = "white";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.width, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full block" />
  );
}

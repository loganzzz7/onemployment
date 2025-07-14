import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./TextCursor.css";

export default function TextCursor({
  children,
  text = "⚛️",
  delay = 0.01,
  spacing = 100,
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.5,
  removalInterval = 30,
  maxPoints = 5,
}) {
  const [trail, setTrail] = useState([]);
  const containerRef = useRef(null);
  const lastMoveTimeRef = useRef(Date.now());
  const idCounter = useRef(0);

  // record mouse movements into a trailing array
  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTrail((prev) => {
      let pts = [...prev];
      if (pts.length === 0) {
        pts.push(makePoint(mouseX, mouseY, 0));
      } else {
        const last = pts[pts.length - 1];
        const dx = mouseX - last.x;
        const dy = mouseY - last.y;
        const dist = Math.hypot(dx, dy);
        if (dist >= spacing) {
          const angleRaw = (Math.atan2(dy, dx) * 180) / Math.PI;
          let angle = angleRaw;
          if (angle > 90) angle -= 180;
          else if (angle < -90) angle += 180;
          const steps = Math.floor(dist / spacing);
          for (let i = 1; i <= steps; i++) {
            const t = (spacing * i) / dist;
            pts.push(
              makePoint(
                last.x + dx * t,
                last.y + dy * t,
                followMouseDirection ? angle : 0
              )
            );
          }
        }
      }
      // cap length
      if (pts.length > maxPoints) pts = pts.slice(pts.length - maxPoints);
      return pts;
    });
    lastMoveTimeRef.current = Date.now();
  };

  // factory for a single point
  const makePoint = (x, y, angle) => ({
    id: idCounter.current++,
    x, y,
    angle,
    ...(randomFloat && {
      randomX: Math.random() * 10 - 5,
      randomY: Math.random() * 10 - 5,
      randomRotate: Math.random() * 10 - 5,
    }),
  });

  // attach mousemove listener
  useEffect(() => {
    const c = containerRef.current;
    c?.addEventListener("mousemove", handleMouseMove);
    return () => c?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // prune old points
  useEffect(() => {
    const iv = setInterval(() => {
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail((prev) => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, removalInterval);
    return () => clearInterval(iv);
  }, [removalInterval]);

  return (
    <div className="text-cursor-wrapper">
      {/* your app/UI */}
      {children}

      {/* overlay container */}
      <div ref={containerRef} className="text-cursor-overlay">
        <AnimatePresence>
          {trail.map((pt) => (
            <motion.div
              key={pt.id}
              initial={{ opacity: 0, x: 0, y: 0, rotate: pt.angle }}
              animate={{
                opacity: 1,
                x: randomFloat ? [0, pt.randomX, 0] : 0,
                y: randomFloat ? [0, pt.randomY, 0] : 0,
                rotate: randomFloat
                  ? [pt.angle, pt.angle + pt.randomRotate, pt.angle]
                  : pt.angle,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                opacity: { duration: exitDuration, ease: "easeOut", delay },
                ...(randomFloat && {
                  x: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                  y: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                  rotate: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                }),
              }}
              className="text-cursor-item"
              style={{ left: pt.x, top: pt.y }}
            >
              {text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
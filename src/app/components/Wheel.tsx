import { motion } from "motion/react";
import { useEffect, useState } from "react";
import FondCircularouletteSncf from "@/imports/FondCircularouletteSncf-2002-76";

// NOTE: Les images ci-dessous utilisent le schéma figma:asset qui est spécifique à Figma Make.
// Pour le déploiement standalone, remplacez ces imports par des chemins vers vos images locales.
// Exemple: import bonPlanImg from "../assets/images/bon-plan.png";
// import bonPlanImg from "figma:asset/3789464d4e58a56616f29101773b8a321cf7b1d2.png";
// import caVaOuImg from "figma:asset/e5e9e41220f73a2ff3027def9628ee25dbc755df.png";
// etc.

interface WheelProps {
  onCategorySelected: (category: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const categories = [
  "ma conso",
  "bon plan",
  "et ça repart !",
  "j'agis !!",
  "on en parle !?",
  "ça va où ?",
  "challenge !!!",
  "en train !!!"
];

export function Wheel({ onCategorySelected, isSpinning, setIsSpinning }: WheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    const minSpins = 5;
    const maxSpins = 8;
    const spins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (spins * 360) + extraDegrees;
    
    setRotation(totalRotation);
    
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const sectionAngle = 360 / 8;
      const categoryIndex = Math.floor((360 - normalizedRotation) / sectionAngle) % 8;
      
      onCategorySelected(categories[categoryIndex]);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Flèche indicatrice */}
      <div 
        className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-[#0084d4]"
        aria-hidden="true"
      />
      
      {/* Conteneur de la roue */}
      <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px]">
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ 
            duration: 2,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="relative rounded-full overflow-hidden w-full h-full"
        >
          <div className="w-full h-full">
            <FondCircularouletteSncf />
          </div>
        </motion.div>
        
        {/* Bouton central */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-20 h-20 shadow-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#0084d4] focus:ring-opacity-50"
          aria-label={isSpinning ? "La roue tourne" : "Tourner la roue"}
        >
          <span className="text-2xl text-[#0084d4]" aria-hidden="true">↻</span>
        </button>
      </div>
      
      {/* Instructions */}
      <p className="text-center text-base md:text-lg text-[#00205b]" aria-live="polite">
        {isSpinning ? "La roue tourne..." : "Cliquez au centre pour tourner la roue !"}
      </p>
    </div>
  );
}
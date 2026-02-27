import { motion } from "motion/react";
import { useEffect, useState } from "react";
import FondCircularouletteSncf from "@/imports/FondCircularouletteSncf-2002-76";
import maConsoImg from "@/assets/categories/ma-conso.png";
import bonPlanImg from "@/assets/categories/bon-plan.png";
import etCaRepartImg from "@/assets/categories/et-ca-repart.png";
import jagisImg from "@/assets/categories/jagis.png";
import mystereImg from "@/assets/categories/mystere.png";
import caVaOuImg from "@/assets/categories/ca-va-ou.png";
import challengeImg from "@/assets/categories/challenge.png";
import enTrainImg from "@/assets/categories/en-train.png";

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
  "mystère !!",
  "ça va où ?",
  "challenge !!!",
  "et ça repart !"
];

/** Images pour chaque catégorie */
const categoryImages: Record<string, string> = {
  "ma conso": maConsoImg,
  "bon plan": bonPlanImg,
  "et ça repart !": etCaRepartImg,
  "j'agis !!": jagisImg,
  "mystère !!": mystereImg,
  "ça va où ?": caVaOuImg,
  "challenge !!!": challengeImg,
  "en train !!!": enTrainImg,
};

export function Wheel({ onCategorySelected, isSpinning, setIsSpinning }: WheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Détection de la taille d'écran
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
    
    // Calcul de la rotation aléatoire : plusieurs tours + angle final
    const minSpins = 5;
    const maxSpins = 8;
    const spins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (spins * 360) + extraDegrees;
    
    setRotation(totalRotation);
    
    // Calculer la catégorie sélectionnée après l'animation
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const sectionAngle = 360 / 8; // 45 degrés par section
      // La flèche au départ est entre challenge et ma conso
      // Calcul direct sans ajustement supplémentaire
      const categoryIndex = Math.floor((360 - normalizedRotation) / sectionAngle) % 8;
      
      onCategorySelected(categories[categoryIndex]);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Flèche indicatrice au-dessus de la roue */}
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
            ease: [0.25, 0.1, 0.25, 1] // Courbe d'accélération réaliste
          }}
          className="relative rounded-full overflow-hidden w-full h-full"
        >
          <div className="w-full h-full">
            <FondCircularouletteSncf />
          </div>
          
          {/* Images des catégories */}
          <div className="absolute inset-0">
            {categories.map((category, index) => {
              const angle = (index * 45) + 22.5;
              const radius = isMobile ? 100 : 155;
              const radians = (angle * Math.PI) / 180;
              const x = radius * Math.sin(radians);
              const y = -radius * Math.cos(radians);

              const image = categoryImages[category];
              if (!image) return null;

              return (
                <div
                  key={`img-${index}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg)`,
                  }}
                >
                  <img
                    src={image}
                    alt={category}
                    className="h-8 md:h-10 w-auto"
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
        
        {/* Bouton central pour faire tourner la roue */}
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
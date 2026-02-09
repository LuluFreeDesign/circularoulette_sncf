import { motion } from "motion/react";
import { useEffect, useState } from "react";
import FondCircularouletteSncf from "@/imports/FondCircularouletteSncf-2002-76";
import bonPlanImg from "figma:asset/3789464d4e58a56616f29101773b8a321cf7b1d2.png";
import caVaOuImg from "figma:asset/e5e9e41220f73a2ff3027def9628ee25dbc755df.png";
import challengeImg from "figma:asset/572a39f694ec07f5bb09b481056e53c701ee43b8.png";
import etCaRepartImg from "figma:asset/20385a17ab11ebd734ad9e9847b76f042c9d864b.png";
import jagisImg from "figma:asset/a812d0bf875668e3b89368de8ec598bf27ebc878.png";
import maConsoImg from "figma:asset/d48b9c1c5fe1723545c6a87d66530e85f9e45d48.png";
import mystereImg from "figma:asset/e8bb9f0d3e9f0a7b222bd8b00af88e30842e82bb.png";

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

// Images pour chaque catégorie
const categoryImages: Record<string, string | React.ComponentType | null> = {
  "ma conso": maConsoImg,
  "bon plan": bonPlanImg,
  "et ça repart !": etCaRepartImg,
  "j'agis !!": jagisImg,
  "mystère !!": mystereImg,
  "ça va où ?": caVaOuImg,
  "challenge !!!": challengeImg,
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
              const angle = (index * 45) + 22.5; // Centré dans la part colorée (+ 22.5° pour décaler au milieu de la section)
              const radius = isMobile ? 120 : 180; // Distance du centre adaptée selon la taille d'écran
              const radians = (angle * Math.PI) / 180;
              const x = radius * Math.sin(radians);
              const y = -radius * Math.cos(radians);
              
              const categoryImage = categoryImages[category];
              
              if (!categoryImage) return null;
              
              // Vérifier si c'est un composant React ou une URL d'image
              const isComponent = typeof categoryImage === 'function';
              
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
                  {isComponent ? (
                    <div className={isMobile ? "w-24 h-12" : "w-32 h-16"}>
                      {(() => {
                        const CategoryComponent = categoryImage as React.ComponentType;
                        return <CategoryComponent />;
                      })()}
                    </div>
                  ) : (
                    <img 
                      src={categoryImage as string} 
                      alt={category}
                      className="w-16 h-auto md:w-20"
                    />
                  )}
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
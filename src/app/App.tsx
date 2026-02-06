import { useState, useEffect } from "react";
import { Wheel } from "./components/Wheel";
import { Quiz } from "./components/Quiz";
import { quizDataByCategory } from "./data/quizData";

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Auto-resize pour iframe : envoyer la hauteur au parent
  useEffect(() => {
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      // Envoyer la hauteur au parent si on est dans une iframe
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: 'iframe-resize',
            height: height
          },
          '*'
        );
      }
    };

    // Envoyer la hauteur initiale
    sendHeight();

    // Observer les changements de taille
    const resizeObserver = new ResizeObserver(() => {
      sendHeight();
    });

    resizeObserver.observe(document.body);

    // Envoyer aussi à chaque changement de contenu
    const interval = setInterval(sendHeight, 500);

    return () => {
      resizeObserver.disconnect();
      clearInterval(interval);
    };
  }, [currentCategory]);

  const handleCategorySelected = (category: string) => {
    // Cas spécial : "et ça repart !" relance automatiquement la roue
    if (category === "et ça repart !") {
      // Pas besoin de changer de vue, juste garder la roue visible
      return;
    }
    
    // Cas spécial : "en train !!!" sélectionne une question de cette catégorie spéciale
    if (category === "en train !!!") {
      setCurrentCategory(category);
      return;
    }
    
    setCurrentCategory(category);
  };

  const handleQuizComplete = () => {
    setCurrentCategory(null);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
      {/* Contenu principal : roue ou quiz */}
      {!currentCategory ? (
        <Wheel 
          onCategorySelected={handleCategorySelected}
          isSpinning={isSpinning}
          setIsSpinning={setIsSpinning}
        />
      ) : (
        <Quiz 
          category={currentCategory}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
}
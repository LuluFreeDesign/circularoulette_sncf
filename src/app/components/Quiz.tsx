import { useState, useMemo } from "react";
import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import { quizDataByCategory, Question } from "../data/quizData";

interface QuizProps {
  category: string;
  onComplete: () => void;
}

export function Quiz({ category, onComplete }: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Sélectionner une question aléatoire de la catégorie
  const currentQuestion = useMemo(() => {
    const questions = quizDataByCategory[category] || [];
    if (questions.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }, [category]);
  
  if (!currentQuestion) {
    return <div>Aucune question disponible pour cette catégorie.</div>;
  }
  
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isDiscussionQuestion = currentQuestion.options.length === 0;

  const handleAnswerClick = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleValidate = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
  };

  const handleNext = () => {
    onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8"
    >
      {/* Catégorie */}
      <div className="mb-6 flex items-center justify-between">
        <span className="inline-block px-4 py-2 bg-[#0084d4] text-white rounded-full">
          {category}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl mb-6 text-[#00205b]">
        {currentQuestion.question}
      </h2>

      {/* Options de réponse OU message de réflexion pour questions de discussion */}
      {isDiscussionQuestion ? (
        <div className="mb-6 p-6 bg-[#a1d6ca] border-2 border-[#00b388] rounded-lg">
          <p className="text-[#00205b] text-center font-medium text-lg">
            💭 C'est une question de réflexion personnelle. Prenez un moment pour y penser...
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentQuestion.correctAnswer;
            const showCorrect = showResult && isCorrectAnswer;
            const showIncorrect = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-[#0084d4] focus:ring-opacity-50 ${
                  showCorrect
                    ? "border-green-500 bg-green-50"
                    : showIncorrect
                    ? "border-[#f2827f] bg-[#f8c1b8]"
                    : isSelected
                    ? "border-[#0084d4] bg-[#a4c8e1]"
                    : "border-gray-300 hover:border-[#0084d4] hover:bg-gray-50"
                } ${showResult ? "cursor-default" : "cursor-pointer"}`}
                aria-pressed={isSelected}
                aria-label={`Option ${index + 1}: ${option}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base md:text-lg">{option}</span>
                  {showCorrect && <Check className="text-green-600 shrink-0" aria-label="Bonne réponse" />}
                  {showIncorrect && <X className="text-[#651c32] shrink-0" aria-label="Mauvaise réponse" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Résultat et explication */}
      {showResult || isDiscussionQuestion ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6"
        >
          <div className={`p-4 rounded-lg ${
            isDiscussionQuestion 
              ? "bg-[#a1d6ca] border-2 border-[#00b388]"
              : isCorrect 
                ? "bg-green-50 border-2 border-green-500" 
                : "bg-[#f8c1b8] border-2 border-[#f2827f]"
          }`}>
            {!isDiscussionQuestion && (
              <h3 className={`font-bold text-lg mb-2 flex items-center gap-2 ${isCorrect ? "text-green-700" : "text-[#651c32]"}`}>
                {isCorrect ? (
                  <>
                    <Check aria-hidden="true" /> Bonne réponse !
                  </>
                ) : (
                  <>
                    <X aria-hidden="true" /> Mauvaise réponse
                  </>
                )}
              </h3>
            )}
            {isDiscussionQuestion && (
              <h3 className="font-bold text-lg mb-2 text-[#00205b]">
                💡 Piste de réflexion
              </h3>
            )}
            <p className="text-[#00205b] leading-relaxed mb-3">
              {currentQuestion.explanation}
            </p>
            <p className="text-sm text-[#003865] italic">
              Source : {currentQuestion.source}
            </p>
          </div>

          {/* Jeu concours - Affiché uniquement pour les bonnes réponses */}
          {!isDiscussionQuestion && isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 p-5 rounded-lg bg-gradient-to-br from-[#a4c8e1]/30 to-[#a1d6ca]/30 border-2 border-[#0084d4]"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl" aria-hidden="true">🎁</span>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-[#0084d4] mb-2">
                    Bravo ! Tentez de gagner des lots éco-responsables !
                  </h4>
                  <p className="text-[#00205b] mb-4 leading-relaxed">
                    Vous avez bien répondu ! Participez à notre jeu concours pour gagner des produits issus de l'économie circulaire : objets réparés, upcyclés, ou de seconde main. Inscrivez-vous en 2 minutes !
                  </p>
                  <a
                    href="https://tally.so/r/EklWLq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0084d4] text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-[#003865] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#0084d4] focus:ring-opacity-50 shadow-md hover:shadow-lg"
                  >
                    <span>Participer au jeu concours</span>
                    <span aria-hidden="true">→</span>
                  </a>
                  <p className="text-xs text-[#003865] mt-3">
                    Le formulaire s'ouvrira dans un nouvel onglet
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : null}

      {/* Boutons d'action */}
      <div className="flex gap-4">
        {!showResult && !isDiscussionQuestion ? (
          <button
            onClick={handleValidate}
            disabled={selectedAnswer === null}
            className="flex-1 bg-[#0084d4] text-white py-3 px-6 rounded-lg transition-all hover:bg-[#003865] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#0084d4] focus:ring-opacity-50"
          >
            Valider ma réponse
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 bg-[#00b388] text-white py-3 px-6 rounded-lg transition-all hover:bg-[#154734] focus:outline-none focus:ring-4 focus:ring-[#00b388] focus:ring-opacity-50"
          >
            Rejouer
          </button>
        )}
      </div>
    </motion.div>
  );
}
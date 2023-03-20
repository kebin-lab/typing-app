import { useEffect, useRef, useState } from "react";
import "./App.css";
import { ResultModal } from "./components/ResultModal";
import { formatTime } from "./utils/utils";

const typingText = [
  "The quick brown fox jumps over the lazy dog.",
  "Sphinx of black quartz, judge my vow.",
  "The five boxing wizards jump quickly.",
  // "Pack my box with five dozen liquor jugs.",
  // "How vexingly quick daft zebras jump!",
  // "Two driven jocks help fax my big quiz.",
  // "Amazingly few discotheques provide jukeboxes.",
  // "Grumpy wizards make toxic brew for the evil Queen and Jack.",
  // "The jay, pig, fox, zebra and my wolves quack!",
  // "Jaded zombies acted quaintly but kept driving their oxen forward.",
];

function App() {
  const [isGameStart, setIsGameStart] = useState(false);
  const [textNumber, setTextNumber] = useState(0);
  const [targetText, setTargetText] = useState(typingText[textNumber]);
  const [typingPosition, setTypeingPosition] = useState(0);
  const [missType, setMissType] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimer = () => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    //setCurrentTime(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    //console.log(e.key);
    if (e.key === targetText[typingPosition]) {
      setTypeingPosition((prevPosition) => prevPosition + 1);
    } else {
      setMissType((prev) => prev + 1);
    }
    // 最後までtypeingが完了したら次のTextに映る
    if (typingPosition === targetText.length - 1) {
      if (textNumber < typingText.length - 1) {
        setTargetText(typingText[textNumber + 1]);
        setTextNumber((prev) => prev + 1);
      } else {
        // 最後のTextまで完了したら結果を表示
        stopTimer();
        accuracyCalc();
        setIsModalOpen(true);
      }
      setTypeingPosition(0);
    }
  };

  const handleRestart = () => {
    setTypeingPosition(0);
    setMissType(0);
    setIsModalOpen(false);
    setIsGameStart(false);
    setTargetText(typingText[0]);
    setTextNumber(0);
    setStartTime(null);
    setCurrentTime(null);
  };

  const accuracyCalc = () => {
    let totalLetter = 0;
    typingText.map((text) => (totalLetter += text.length));
    const correctLetter = totalLetter - missType;
    const accuracy = Math.round((correctLetter / totalLetter) * 100);
    setAccuracy(accuracy);
  };

  const handleStartTyping = () => {
    setStartTime(Date.now());
    setIsGameStart(true);
    startTimer();
  };

  return (
    <div className="App">
      <div className="field">
        <div className="resutl">
          <label htmlFor="">
            Time:
            {startTime && currentTime ? (
              <span>
                {formatTime(Math.floor((currentTime - startTime) / 1000))}
              </span>
            ) : (
              <span>00:00</span>
            )}
          </label>
          <label htmlFor="">
            問題数:{textNumber + 1} / {typingText.length}
          </label>
        </div>
        <div className="typing-field" onKeyDown={handleKeyDown} tabIndex={0}>
          {!isGameStart ? (
            <button className="btn start" onClick={handleStartTyping}>
              Start
            </button>
          ) : (
            <>
              <span className="typed-letters">
                {targetText.slice(0, typingPosition)}
              </span>
              <span className="untyped-letters">
                {targetText.slice(typingPosition)}
              </span>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <ResultModal
          missType={missType}
          accuracy={accuracy}
          startTime={startTime}
          currentTime={currentTime}
          handleRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;

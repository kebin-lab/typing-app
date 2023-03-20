import { formatTime } from "../utils/utils";

type Props = {
  missType: number;
  accuracy: number;
  startTime: number | null;
  currentTime: number | null;
  handleRestart: () => void;
};

export const ResultModal = ({
  missType,
  startTime,
  currentTime,
  accuracy,
  handleRestart,
}: Props) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Typing Result</h2>
        <p>Typeing mistakes: {missType}</p>
        <p>
          Time taken:{" "}
          {startTime && currentTime ? (
            formatTime(Math.floor((currentTime - startTime) / 1000))
          ) : (
            <>No Record</>
          )}
        </p>
        <p>Accuracy: {accuracy}%</p>
        <button className="btn modal-close" onClick={handleRestart}>
          Restart
        </button>
      </div>
    </div>
  );
};

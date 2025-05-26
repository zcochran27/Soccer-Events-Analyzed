import { useEffect } from "react";
import {
  clearPassesBtn,
  clickEvent,
  drawPitch,
  predictBtn,
  shootBtn,
  undoBtn,
} from "../../utils/main";
import { useRef } from "react";

function Field() {
  const canvasRef = useRef(null);
  const shootRef = useRef(null);
  const predictRef = useRef(null);
  const undoRef = useRef(null);
  const clearRef = useRef(null);
  const predictionResultRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shoot = shootRef.current;
    const predict = predictRef.current;
    const undo = undoRef.current;
    const clear = clearRef.current;
    const predictionResult = predictionResultRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    drawPitch(ctx, canvas);

    const handleClick = (event) => {
      console.log("Canvas clicked");
      clickEvent(event, ctx, canvas);
    };

    const shootClick = (event) => {
      shootBtn(shoot, predict, canvas, ctx);
    };

    const undoClick = () => {
      undoBtn(predict, ctx, canvas);
    };

    const clearClick = () => {
      clearPassesBtn(ctx, canvas, shoot, predict);
    };

    const predictionResultClick = () => {
      predictBtn(predictionResult);
    };
    canvas.addEventListener("click", handleClick);

    shoot.addEventListener("click", shootClick);

    undo.addEventListener("click", undoClick);

    clear.addEventListener("click", clearClick);

    predict.addEventListener("click", predictionResultClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
      shoot.removeEventListener("click", shootClick);
      undo.removeEventListener("click", undoClick);
      clear.removeEventListener("click", clearClick);
      predict.removeEventListener("click", predictionResultClick);
    };
  }, []);
  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        id="pitchCanvas"
        width="720"
        height="480"
      ></canvas>
      <div className="canvas-buttons">
        <button ref={undoRef} style={{ backgroundColor: "#FF204E" }}>
          Undo last pass
        </button>
        <button ref={clearRef} style={{ backgroundColor: "#334257" }}>
          Clear all passes
        </button>
        <button ref={shootRef}>Shoot</button>
        <button
          style={{
            backgroundColor: "gray",
          }}
          ref={predictRef}
        >
          Predict Probability
        </button>
      </div>
      <p ref={predictionResultRef}></p>
    </div>
  );
}

export default Field;

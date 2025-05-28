import { useEffect } from "react";
import { useRef } from "react";
import { clickEvent } from "../../utils/ClickEvents";
import {
  clearPassesBtn,
  predictBtn,
  shootBtn,
  undoBtn,
} from "../../utils/Buttons";
import { drawPitch } from "../../utils/DrawPitch";

function Field() {
  const canvasRef = useRef(null);
  const shootRef = useRef(null);
  const predictRef = useRef(null);
  const undoRef = useRef(null);
  const clearRef = useRef(null);
  const predictionResultRef = useRef(null);
  const passTypeRef = useRef(null);
  const passHeightRef = useRef(null);
  const clickPhase = useRef(0);

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
      console.log("Canvas clicked", clickPhase.current);
      clickEvent(
        event,
        ctx,
        canvas,
        passTypeRef.current.value,
        passHeightRef.current.value,
        predict
      );
    };

    const shootClick = (event) => {
      shootBtn(shoot, predict, canvas, ctx);
    };

    const undoClick = () => {
      undoBtn(predict, ctx, canvas, shoot);
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

    // clear.addEventListener("click", clearClick);

    predict.addEventListener("click", predictionResultClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
      shoot.removeEventListener("click", shootClick);
      undo.removeEventListener("click", undoClick);
      // clear.removeEventListener("click", clearClick);
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
        <label htmlFor="passType">Pass Type:</label>
        <select ref={passTypeRef} id="passType" name="passType">
          <option value="normal">Normal Pass</option>
          <option value="Cross">Cross</option>
          <option value="Through Ball">Through Ball</option>
          <option value="Cut-back">Cut Back</option>
          <option value="Switch">Switch</option>
          <option value="Throw-in">Throw-in</option>
          <option value="Corner">Corner</option>
          <option value="Free Kick">Free Kick</option>
          <option value="Goal Kick">Goal Kick</option>
        </select>
        <label htmlFor="passHeight">Pass Height:</label>
        <select ref={passHeightRef} id="passHeight" name="passHeight">
          <option value="Ground">Ground Pass</option>
          <option value="Low">Low Pass</option>
          <option value="High">High Pass</option>
        </select>
        <button ref={undoRef} style={{ backgroundColor: "#FF204E" }}>
          Undo last pass
        </button>
        {/* <button ref={clearRef} style={{ backgroundColor: "#334257" }}>
          Clear all passes
        </button> */}
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

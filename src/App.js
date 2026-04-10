import { useState, useRef, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./App.css";
import tumPremHo from "./music/Tum Prem Ho.mp3";
import sleepingPenguinLottie from "./lottie/Sleeping penguin.lottie";
import { emojiSizes } from "./emojiSizes";
import { playWinFanfare } from "./winSound";
import { runCelebrationConfetti } from "./partyPopups";

const CORRECT_DATE = "2000-02-07";

/** After date: story slides (each has Next, including last → love question) */
const TEXT_SCREENS = [
  <>
    Tula kharach baghaychi ahe ka surprise??{" "}
    <span className="App-line-emoji" aria-hidden="true">
      🤔
    </span>
  </>,
  <>
    Mala khara ny vatat{" "}
    <span className="App-line-emoji" aria-hidden="true">
      🤔
    </span>
  </>,
  <>
    Khara??{" "}
    <span className="App-line-emoji" aria-hidden="true">
      🤔
    </span>
  </>,
  <>
    Pakka na??{" "}
    <span className="App-line-emoji" aria-hidden="true">
      🫠
    </span>
  </>,
  <>
    Bgh ha{" "}
    <span className="App-line-emoji" aria-hidden="true">
      😬
    </span>
  </>,
  <>
    Patience check karat hoto tuze{" "}
    <span className="App-line-emoji" aria-hidden="true">
      😏
    </span>
  </>,
  <>
    Ready??{" "}
    <span className="App-line-emoji" aria-hidden="true">
      🫣
    </span>
  </>,
];

const STORY_END_STEP = TEXT_SCREENS.length;
const LOVE_QUESTION_STEP = TEXT_SCREENS.length + 1;
const FINAL_STEP = TEXT_SCREENS.length + 2;

const MODAL_BODY =
  "Bagh tari pn no vr click kelas🙄 kiti masti ahe na tula🙂, parat ja chal ani yes vr click kar gp.";

const FINAL_SCREEN_TEXT = `Mi mumbai la yetoy tula bhetayla💜, tr tu thoda vel kadhshil ka mazyasathi?
Mala tula date var gheun jaych ahe tr yeshil ka tu?😊
📆 19 April la`;

function App() {
  const [step, setStep] = useState(0);
  const [dateValue, setDateValue] = useState("");
  const [dateError, setDateError] = useState(false);
  const [showNoModal, setShowNoModal] = useState(false);
  const audioRef = useRef(null);
  const noModalRef = useRef(null);

  useEffect(() => {
    const el = audioRef.current;
    return () => {
      el?.pause();
    };
  }, []);

  useEffect(() => {
    const el = noModalRef.current;
    if (!el) return;
    if (showNoModal) {
      el.showModal();
    } else {
      el.close();
    }
  }, [showNoModal]);

  useEffect(() => {
    if (step !== FINAL_STEP) return;

    const bg = audioRef.current;
    if (bg) {
      bg.pause();
      bg.currentTime = 0;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduceMotion) {
      playWinFanfare();
    }

    const stopConfetti = runCelebrationConfetti();

    return () => {
      stopConfetti();
    };
  }, [step]);

  const isDateStep = step === 0;
  const isStoryStep = step >= 1 && step <= STORY_END_STEP;
  const isLoveStep = step === LOVE_QUESTION_STEP;
  const isFinalStep = step === FINAL_STEP;

  const handleDateNext = () => {
    if (dateValue === CORRECT_DATE) {
      setDateError(false);
      setStep(1);
      const a = audioRef.current;
      if (a) {
        a.currentTime = 0;
        a.play().catch(() => {});
      }
      return;
    }
    setDateError(true);
  };

  const handleStoryNext = () => {
    if (step < STORY_END_STEP) {
      setStep((s) => s + 1);
    } else {
      setStep(LOVE_QUESTION_STEP);
    }
  };

  const renderMainPanel = () => {
    if (isDateStep) {
      return (
        <div className="App-panel">
          <h1 className="App-title">
            Hello Komu{" "}
            <span className="App-wave" aria-hidden="true">
              👋🏻
            </span>
          </h1>
          <p className="App-lorem">
            Mazya kade ek surprise ahe tuzyasathi, pn tya adhi mazi birthdate
            tak khali. Just check kartoy ki tuch ahes ki ny te.{" "}
            <span className="App-hint-emoji" aria-hidden="true">
              😉
            </span>
          </p>
          <div className="App-field">
            <label className="App-label" htmlFor="birth-date">
              Select date
            </label>
            <input
              id="birth-date"
              className="App-date"
              type="date"
              value={dateValue}
              onChange={(e) => {
                setDateValue(e.target.value);
                setDateError(false);
              }}
            />
          </div>
          {dateError && (
            <p className="App-hint" role="alert">
              Tu komu nahis, so you can leave this page{" "}
              <span className="App-hint-emoji" aria-hidden="true">
                😌
              </span>
            </p>
          )}
          <button type="button" className="App-next" onClick={handleDateNext}>
            Next
          </button>
        </div>
      );
    }
    if (isStoryStep) {
      return (
        <div className="App-panel App-panel--success">
          <p className="App-next-line">{TEXT_SCREENS[step - 1]}</p>
          <button type="button" className="App-next" onClick={handleStoryNext}>
            Next
          </button>
        </div>
      );
    }
    if (isLoveStep) {
      return (
        <div className="App-panel App-panel--success App-panel--love">
          <p className="App-next-line">
            Tyadhi ek random prashn vicharto jara. Do you love me?
            <span className="App-hint-emoji" aria-hidden="true">
              🙃
            </span>
          </p>
          <div className="App-choice">
            <button
              type="button"
              className="App-next App-next--choice"
              onClick={() => setStep(FINAL_STEP)}
            >
              Yes
            </button>
            <p className="App-choice-note">
              Yes vr click karshil ashi aasha ahe🥰
            </p>
          </div>
          <div className="App-choice">
            <button
              type="button"
              className="App-next App-next--choice App-next--outline"
              onClick={() => setShowNoModal(true)}
            >
              No
            </button>
            <p className="App-choice-note">
              No ch button dilay mhanun lagech click nko karus ha maar khashil😒
            </p>
          </div>
        </div>
      );
    }
    if (isFinalStep) {
      return (
        <div className="App-panel App-panel--success App-panel--final">
          <p className="App-next-line App-next-line--final">
            {FINAL_SCREEN_TEXT}
          </p>
          <div className="App-lottie-wrap" aria-hidden="true">
            <DotLottieReact
              src={sleepingPenguinLottie}
              loop
              autoplay
              className="App-lottie-penguin"
              backgroundColor="#00000000"
              layout={{ fit: "contain", align: [0.5, 0.5] }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="App"
      style={{
        "--emoji-inline": emojiSizes.inline,
        "--emoji-line": emojiSizes.line,
        "--emoji-wave": emojiSizes.wave,
      }}
    >
      <audio
        ref={audioRef}
        className="App-audio"
        src={tumPremHo}
        loop
        preload="auto"
        tabIndex={-1}
      >
        <track kind="captions" />
      </audio>

      <main className="App-main">
        <div className="App-main-inner">{renderMainPanel()}</div>
        <p className="App-note" role="note">
          <span className="App-note-label">Note:</span> Bluetooth lav for better
          experience
        </p>
      </main>

      <dialog
        ref={noModalRef}
        className="App-modal-dialog"
        onCancel={(e) => e.preventDefault()}
        onClose={() => setShowNoModal(false)}
        aria-labelledby="no-modal-title"
      >
        <div className="App-modal">
          <p id="no-modal-title" className="App-modal-text">
            {MODAL_BODY}
          </p>
          <button
            type="button"
            className="App-next"
            onClick={() => setShowNoModal(false)}
          >
            Yes vr click kelas tarach mahit padel surprise ky ahe te
            <span className="App-hint-emoji" aria-hidden="true">
              😌
            </span>
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default App;

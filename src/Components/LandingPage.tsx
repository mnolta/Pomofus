import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./LandingPage.css";
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const LandingPage: React.FC = () => {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [longBreakLength, setLongBreakLength] = useState(15);
  const [cycleCount, setCycleCount] = useState(0);
  const [cycleCountInput, setCycleCountInput] = useState(2);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionType, setSessionType] = useState("Focus");
  const [notifyOn, setNotifyOn] = useState(true);
  const restNotify = () => {
    notifyOn &&
      new Notification("Rest", {
        body: `Do stretching for ${breakLength} minutes`,
      });
  };
  const LongRestNotify = () => {
    notifyOn &&
      new Notification("Long Rest", {
        body: `Grab a coffee and rest for ${longBreakLength} minutes`,
      });
  };
  const FocusNotify = () => {
    notifyOn &&
      new Notification("Focus", {
        body: `Focus your work for ${sessionLength} minutes`,
      });
  };

  const incrementSession = () => {
    if (!timerRunning && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      //setSecondsLeft((sessionLength + 1) * 60);
    }
  };
  const decrementSession = () => {
    if (!timerRunning && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      //setSecondsLeft((sessionLength - 1) * 60);
    }
  };
  const incrementBreak = () => {
    if (!timerRunning && breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };
  const decrementBreak = () => {
    if (!timerRunning && breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };
  const incrementLongBreak = () => {
    if (!timerRunning && longBreakLength < 60) {
      setLongBreakLength(longBreakLength + 1);
    }
  };
  const decrementLongBreak = () => {
    if (!timerRunning && longBreakLength > 1) {
      setLongBreakLength(longBreakLength - 1);
    }
  };
  const incrementCycleCount = () => {
    if (!timerRunning && cycleCountInput < 60) {
      setCycleCountInput(cycleCountInput + 1);
    }
  };
  const decrementCycleCount = () => {
    if (!timerRunning && cycleCountInput > 1) {
      setCycleCountInput(cycleCountInput - 1);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  let countdown: NodeJS.Timeout;

  const handleSwitch = () => {
    if (timerLabel === "Session") {
      if (cycleCount > 1) {
        setCycleCount(cycleCountInput - 1);
        setTimerLabel("Break");
        setSessionType("Rest");
        restNotify();
        setSecondsLeft(breakLength * 60);
      } else {
        setTimerLabel("Long Break");
        setSessionType("Long Rest");
        LongRestNotify();
        setSecondsLeft(longBreakLength * 60);
      }
    } else if (timerLabel === "Break") {
      setTimerLabel("Session");
      setSessionType("Focus");
      FocusNotify();
      setSecondsLeft(sessionLength * 60);
    } else if (timerLabel === "Long Break") {
      setTimerLabel("Session");
      setSessionType("Focus");
      setCycleCount(cycleCountInput);
      FocusNotify();
      setSecondsLeft(sessionLength * 60);
    }
  };

  useEffect(() => {
    if (timerRunning && secondsLeft > 0) {
      countdown = setInterval(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    } else if (timerRunning && secondsLeft === 0) {
      countdown = setInterval(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      handleSwitch();
    } else {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [timerRunning, secondsLeft, timerLabel, breakLength, sessionLength]);

  useEffect(() => {
    setCycleCount(cycleCountInput);
  }, [cycleCountInput]);
  useEffect(() => {
    setSecondsLeft(sessionLength * 60);
  }, [sessionLength]);

  const handleStart = () => {
    setTimerRunning(true);
  };

  const handleStop = () => {
    setTimerRunning(false);
  };

  const handleReset = () => {
    setSessionLength(sessionLength);
    setBreakLength(breakLength);
    setSecondsLeft(sessionLength * 60);
    setCycleCount(cycleCountInput);
    setSessionType("Focus");
    setTimerLabel("Session");
    setTimerRunning(false);
  };

  const timeConvert = (num: number) => {
    const second = num % 60;
    const minutes = Math.floor(num / 60);
    return `${minutes}:${second}`;
  };

  return (
    <div className="Main">
      <div className="Heading">
        <div className="isflex flex-1 justify-center">
          <span>Pomofus</span>
          <img
            style={{ width: "30px", marginLeft: "5px" }}
            src="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/easypeasy.svg"
            alt="xx"
          />
        </div>
        <div className="isflex flex-1 justify-center flex-row settings-spans">
          {/* <span>Issues</span>
          <span>Settings</span> */}
          <span className="marginRs">Notifications</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifyOn}
              onChange={() => setNotifyOn(!notifyOn)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <div className="Time">
        <div className="time-content">
          <div className="time-setting isflex justify-around align-center">
            <div className="isflex flex-col align-center">
              <span className="font-20">Focus</span>
              <div>
                <button className="increment-button" onClick={decrementSession}>
                  -
                </button>
                <span className="font-14">{sessionLength} min</span>
                <button className="increment-button" onClick={incrementSession}>
                  +
                </button>
              </div>
            </div>
            <div className="isflex flex-col align-center">
              <span className="font-20">Rest</span>
              <div>
                <button className="increment-button" onClick={decrementBreak}>
                  -
                </button>
                <span className="font-14">{breakLength} min</span>
                <button className="increment-button" onClick={incrementBreak}>
                  +
                </button>
              </div>
            </div>
            <div className="isflex flex-col align-center">
              <span className="font-20">Cycle</span>
              <div>
                <button
                  className="increment-button"
                  onClick={decrementCycleCount}
                >
                  -
                </button>
                <span className="font-14">{cycleCountInput}</span>
                <button
                  className="increment-button"
                  onClick={incrementCycleCount}
                >
                  +
                </button>
              </div>
            </div>
            <div className="isflex flex-col align-center">
              <span className="font-20">Long Rest</span>
              <div>
                <button
                  className="increment-button"
                  onClick={decrementLongBreak}
                >
                  -
                </button>
                <span className="font-14">{longBreakLength} min</span>
                <button
                  className="increment-button"
                  onClick={incrementLongBreak}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="time-pomodoro">
            <div className="time-value isflex flex-col">
              {/* <span id="timer-label">{timerLabel}</span> */}
              <span id="time-left">
                {minutes < 10 ? ("0" + minutes).slice(-2) : minutes}:
                {seconds < 10 ? ("0" + seconds).slice(-2) : seconds}
              </span>
              <span className="font-14 time-pomodoro-session">
                {sessionType}
              </span>
            </div>
            <div className="isflex flex-col">
              <button
                className="start-button font-24 isflex align-center"
                onClick={timerRunning ? handleStop : handleStart}
              >
                {!timerRunning ? (
                  <svg
                    version="1.1"
                    id="Capa_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 320.001 320.001"
                    style={{ width: "25px", marginRight: "7px" }}
                  >
                    <path
                      d="M295.84,146.049l-256-144c-4.96-2.784-11.008-2.72-15.904,0.128C19.008,5.057,16,10.305,16,16.001v288
	c0,5.696,3.008,10.944,7.936,13.824c2.496,1.44,5.28,2.176,8.064,2.176c2.688,0,5.408-0.672,7.84-2.048l256-144
	c5.024-2.848,8.16-8.16,8.16-13.952S300.864,148.897,295.84,146.049z"
                    />
                  </svg>
                ) : (
                  <svg
                    version="1.1"
                    id="Capa_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 45.975 45.975"
                    style={{ width: "25px", marginRight: "7px" }}
                  >
                    <g>
                      <g>
                        <path d="M13.987,0c-2.762,0-5,2.239-5,5v35.975c0,2.763,2.238,5,5,5s5-2.238,5-5V5C18.987,2.238,16.75,0,13.987,0z" />
                        <path d="M31.987,0c-2.762,0-5,2.239-5,5v35.975c0,2.762,2.238,5,5,5s5-2.238,5-5V5C36.987,2.239,34.749,0,31.987,0z" />
                      </g>
                    </g>
                  </svg>
                )}
                <span>{timerRunning ? "Stop" : "Start"}</span>
              </button>
              <button className="reset-button marginTxl" onClick={handleReset}>
                <svg
                  version="1.1"
                  id="Capa_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 14.155 14.155"
                  style={{ width: "20px", marginLeft: "10px" }}
                >
                  <g>
                    <path
                      d="M12.083,1.887c-0.795-0.794-1.73-1.359-2.727-1.697v2.135c0.48,0.239,0.935,0.55,1.334,0.95
		c1.993,1.994,1.993,5.236,0,7.229c-1.993,1.99-5.233,1.99-7.229,0c-1.991-1.995-1.991-5.235,0-7.229
		C3.466,3.269,3.482,3.259,3.489,3.25h0.002l1.181,1.179L4.665,0.685L0.923,0.68l1.176,1.176C2.092,1.868,2.081,1.88,2.072,1.887
		c-2.763,2.762-2.763,7.243,0,10.005c2.767,2.765,7.245,2.765,10.011,0C14.844,9.13,14.847,4.649,12.083,1.887z"
                    />
                  </g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

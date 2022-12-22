/**
 * Copyright: https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/
 */
 class Timer extends Events{
    
    FULL_DASH_ARRAY = 283;

    COLOR_CODES = {
        info: {
            color: "green"
        },
        warning: {
            color: "orange",
            threshold: 0
        },
        alert: {
            color: "red",
            threshold: 0
        }
    };

    time_limit;
    timePassed = 0;
    timeLeft;
    timerInterval = null;
    remainingPathColor = this.COLOR_CODES.info.color;
    isRunning = false;
    isFinished = false;
    
    constructor(time_limit) {
        super();
        this.time_limit = time_limit;
        this.timeLeft = time_limit;
        this.COLOR_CODES.warning.threshold = time_limit / 2;
        this.COLOR_CODES.alert.threshold = time_limit / 4;

        this.initTimer();
    }

    /**
     * Erstellt den Timer und fuegt diesen zur Benutzeroberflaeche hinzu
     */
    initTimer() {
        let timer = this.getTimerHTMLElement();

        timer.innerHTML = `
        <div class="base-timer">
          <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
              <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
              <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${this.remainingPathColor}"
                d="
                  M 50, 50
                  m -45, 0
                  a 45,45 0 1,0 90,0
                  a 45,45 0 1,0 -90,0
                "
              ></path>
            </g>
          </svg>
          <span id="base-timer-label" class="base-timer__label">${this.formatTime(
            this.timeLeft
          )}</span>
        </div>
        `;
    }

    /**
     * Wird ausgefuehrt, sobald der Timer gestartet wird.
     */
    startTimer() {
        this.isRunning = true;
        this.timerInterval = setInterval(() => {
            this.timePassed = this.timePassed += 1;
            this.timeLeft = this.time_limit - this.timePassed;

            // Setzt das Label was im inneren des Timers angezeigt wird
            document.getElementById("base-timer-label").innerHTML = this.formatTime(
              this.timeLeft
            );

            // Darstellung des "Randes" vom Timer, der zusammen mit der Zeit ablaeuft
            this.setCircleDasharray();
            this.setRemainingPathColor(this.timeLeft);
        
            // Wenn die Zeit abgelaufen ist, wird die onTimesUp Funktion aufgerufen
            if (this.timeLeft === 0) {
              this.onTimesUp();
            }
          }, 1000);
    }

    /**
     * Wenn die Zeit des Timers angelaufen ist, dann wird der Timer zunaechst gestoppt und anschliessend 
     * das Event "finished" ausgeloest (auch triggern genannt).
     */
    onTimesUp() {
        this.stopTimer();
        this.trigger("finished");
    }

    /**
     * Stoppt den Timer in dem die clearInterval Funktion aufgerufen wird.
     * Siehe hierzu: https://www.w3schools.com/jsref/met_win_clearinterval.asp
     */
    stopTimer() {
        this.isRunning = false;
        this.isFinished = true;
        clearInterval(this.timerInterval);
    }

    /**
     * Formatiert die uebergebene Zeit fuer die Anzeige des Timers (mittig).
     * @param {Number} time Eine Zeitangabe
     */
    formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
      
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
      
        return `${minutes}:${seconds}`;
    }

    /**
     * In Abhaengigkeit der noch zur Verfuegung stehenden Zeit wird der Timer entsprechend 
     * farbig eingefaerbt (der Rand).
     * @param {Number} timeLeft Die noch zur Verfuegung stehende Zeit
     */
    setRemainingPathColor(timeLeft) {
        const { alert, warning, info } = this.COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            
            // Wenn der Grenzwert fuer die Alert Farbe (rot) unterschritten wird...
            let remainingPath =  document.getElementById("base-timer-path-remaining");

            // ... wird die css Klasse "orange" entfernt ...
            remainingPath.classList.remove(warning.color);

             // ... und durch "rot" ersetzt
            remainingPath.classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            
            // Wenn der Grenzwert fuer die Warning Farbe (orange) unterschritten wird...
            let remainingPath =  document.getElementById("base-timer-path-remaining");
            
            // ... wird die css Klasse "green" entfernt ...
            remainingPath.classList.remove(info.color);

            // ... und durch "orange" ersetzt
            remainingPath.classList.add(warning.color);
        }
    }

    /**
     * 
     */
    calculateTimeFraction() {
        const rawTimeFraction = this.timeLeft / this.time_limit;
        return rawTimeFraction - (1 / this.time_limit) * (1 - rawTimeFraction);
    }

    /**
     * 
     */
    setCircleDasharray() {
        const circleDasharray = `${(
            this.calculateTimeFraction() * this.FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
            .getElementById("base-timer-path-remaining")
            .setAttribute("stroke-dasharray", circleDasharray);
    }

    /**
     * Gibt das HTML Element des Timers zurueck.
     */
    getTimerHTMLElement() {
        return document.getElementById("timer");
    }

    /**
     * Prueft, ob der Timer laeuft
     */
    isTimerRunning() {
        return this.isRunning;
    }

    /**
     * Prueft ob der Timer abgelaufen ist.
     */
    isTimerFinished() {
        return this.isFinished;
    }
}

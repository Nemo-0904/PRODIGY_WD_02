// Use 'let' for reassignable variables and 'const' for static selections/declarations
let ms = 0, s = 0, m = 0, h = 0; 
let timer = null; // Initialize timer as null

// DOM element selections
const display = document.querySelector('.timer-display');
const laps = document.querySelector('.laps');
// Selections for the analog watch hands
const secondHand = document.querySelector('.second-hand');
const minuteHand = document.querySelector('.minute-hand');
const hourHand = document.querySelector('.hour-hand');

// --- Core Timer Functions ---

/**
 * Starts the stopwatch by setting an interval.
 */
function start() {
    // Check if a timer interval is NOT already set (timer is null)
    if (timer === null) {
        // Set the timer to run every 10 milliseconds (1/100th of a second)
        timer = setInterval(run, 10);
    }
}

/**
 * Updates the time variables, digital display, and analog hands.
 */
function run() {
    // 1. Update the digital display
    display.innerHTML = getTimer();
    
    // 2. Increment time variables
    ms++; // Increments the 10ms counter

    // Time rollover logic
    if (ms === 100) { ms = 0; s++; }
    if (s === 60) { s = 0; m++; }
    if (m === 60) { m = 0; h++; }

    // 3. Update the Analog Watch Hands
    
    // Calculate total time in seconds/minutes/hours for smooth, cumulative rotation.
    
    // Second Hand: (s + fraction of s from ms) * 6 degrees per second
    // Rotates smoothly every 10ms.
    const totalSeconds = s + (ms / 100); 
    const s_deg = totalSeconds * 6; 
    
    if (secondHand) { 
        secondHand.style.transform = `rotate(${s_deg}deg)`;
    }
    
    // Minute Hand: (m + fraction of m from s) * 6 degrees per minute
    // Moves slightly every second.
    const totalMinutes = m + (s / 60);
    const m_deg = totalMinutes * 6;
    
    if (minuteHand) {
        minuteHand.style.transform = `rotate(${m_deg}deg)`;
    }

    // Hour Hand: (h % 12 + fraction of h from m) * 30 degrees per hour
    // The h % 12 ensures the hand wraps around on a standard 12-hour watch face.
    const totalHours12 = (h % 12) + (m / 60);
    const h_deg = totalHours12 * 30;
    
    if (hourHand) {
        hourHand.style.transform = `rotate(${h_deg}deg)`;
    }
}

/**
 * Formats the timer display (HH:MM:SS:MS) using .padStart().
 * @returns {string} The formatted time string.
 */
function getTimer() {
    // Use String.padStart(2, '0') for clean two-digit formatting
    const hours = String(h).padStart(2, '0');
    const minutes = String(m).padStart(2, '0');
    const seconds = String(s).padStart(2, '0');
    const milliseconds = String(ms).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// --- Control Functions ---

/**
 * Stops/Pauses the timer.
 */
function pause() {
    stopTimer();
}

/**
 * Internal function to clear the interval and set timer to null.
 */
function stopTimer() {
    clearInterval(timer);
    timer = null;
}

/**
 * Resets the timer to 00:00:00:00, clears the interval, and resets analog hands.
 */
function reset() {
    stopTimer();
    ms = 0;
    s = 0;
    m = 0;
    h = 0;
    
    // Update the display to 00:00:00:00
    display.innerHTML = getTimer(); 
    
    // Reset analog hands to 0 degrees
    if (secondHand) secondHand.style.transform = `rotate(0deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(0deg)`;
    if (hourHand) hourHand.style.transform = `rotate(0deg)`;
}

/**
 * Resets the timer and starts it immediately. (Used for the 'Restart' button, if included).
 */
function restart() {
    reset(); 
    start();
}

/**
 * Records the current time as a lap and adds it to the list.
 */
function lap() {
    // Only record a lap if the timer is actively running
    if (timer !== null) { 
        const li = document.createElement("li");
        li.innerHTML = getTimer();

        // Insert the new lap at the beginning (top) of the list
        if (laps.children.length > 0) {
            laps.insertBefore(li, laps.firstChild);
        } else {
            laps.appendChild(li);
        }
    }
}

/**
 * Clears all recorded lap times from the list.
 */
function resetLap() {
    laps.innerHTML = "";
}

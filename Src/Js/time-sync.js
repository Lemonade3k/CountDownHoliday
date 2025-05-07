import { startAllCountdowns } from './main.js'; // Forward declaration, will be resolved

export let timeOffset = 0;
export let isTimeInitialized = false;

export async function syncTimeWithAPI() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/ip');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const serverTime = dayjs(data.datetime).valueOf();
        const clientTime = Date.now();
        timeOffset = serverTime - clientTime;
        console.log(`Time synced with WorldTimeAPI (${data.timezone}). Offset: ${timeOffset}ms`);

        if (!isTimeInitialized) {
            isTimeInitialized = true;
            startAllCountdowns();
        }
    } catch (error) {
        console.error("Could not sync time with WorldTimeAPI, using system time:", error);
        timeOffset = 0;
        if (!isTimeInitialized) {
            isTimeInitialized = true;
            console.warn("Starting countdowns using client's system time due to API error.");
            startAllCountdowns();
        }
    }
}

export function getIsTimeInitialized() {
    return isTimeInitialized;
}

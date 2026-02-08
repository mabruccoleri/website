
import { ActivityData } from './types';

const ATHLETE_ID = process.env.REACT_APP_INTERVALS_ATHLETE_ID;
const API_KEY = process.env.REACT_APP_INTERVALS_API_KEY;

export interface IntervalsActivity {
  id: string;
  start_date_local: string;
  type: string;
  distance?: number; // meters
  moving_time?: number; // seconds
  total_elevation_gain?: number; // meters
  max_speed?: number; // m/s
  average_speed?: number; // m/s
  source: string; // e.g. "STRAVA"
}

export const getIntervalsActivities = async (): Promise<ActivityData[]> => {
  if (!ATHLETE_ID || !API_KEY) {
    console.warn("Intervals.icu credentials missing.");
    return [];
  }

  // Calculate date range: Broad range for lifetime stats (e.g. 2015 to now)
  const today = new Date();
  const end = today.toISOString().split('T')[0];
  const start = '2015-01-01'; // Good baseline for "lifetime" context

  const url = `https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/activities?oldest=${start}&newest=${end}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + btoa('API_KEY:' + API_KEY)
      }
    });

    if (!response.ok) {
        throw new Error(`Intervals API Error: ${response.status} ${response.statusText}`);
    }

    const data: IntervalsActivity[] = await response.json();
    return data.map(normalizeToStravaFormat);
  } catch (error) {
    console.error("Error fetching Intervals.icu activities:", error);
    return [];
  }
};

// Helper to normalize data structure to match what our widgets expect (similar to Strava format)
export const normalizeToStravaFormat = (activity: IntervalsActivity): ActivityData => {
    return {
        id: activity.id,
        name: `${activity.type} Activity`, // Intervals activity names might be generic or missing
        distance: activity.distance || 0,
        moving_time: activity.moving_time || 0,
        type: activity.type, // Intervals types: Ride, Run, etc.
        start_date: activity.start_date_local,
        total_elevation_gain: activity.total_elevation_gain || 0,
        max_speed: activity.max_speed,
        source: 'Intervals.icu'
        // Intervals doesn't always provide country directly in summary, might need detail fetch if critical
        // For now, we'll omit or map timezone if available (not standard in summary)
    };
};

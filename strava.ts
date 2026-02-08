const CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REACT_APP_STRAVA_REFRESH_TOKEN;
const ATHLETE_ID = process.env.REACT_APP_STRAVA_ATHLETE_ID;

const TOKEN_ENDPOINT = 'https://www.strava.com/oauth/token';
const STATS_ENDPOINT = (id: string) => `https://www.strava.com/api/v3/athletes/${id}/stats`;

export const getStravaStats = async (): Promise<{ miles: number; count: number } | null> => {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !ATHLETE_ID) {
    console.warn("Strava credentials missing in environment variables.");
    return null;
  }

  try {
    // 1. Get Access Token using Refresh Token
    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokenData.message || 'Failed to refresh token');
    const accessToken = tokenData.access_token;

    // 2. Get Athlete Stats (YTD)
    const statsResponse = await fetch(STATS_ENDPOINT(ATHLETE_ID), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const statsData = await statsResponse.json();
    if (!statsResponse.ok) throw new Error(statsData.message || 'Failed to fetch stats');

    // 3. Extract YTD Ride Totals (Strava returns meters)
    const ytdDistanceMeters = statsData.ytd_ride_totals?.distance || 0;
    const ytdCount = statsData.ytd_ride_totals?.count || 0;

    // Convert to miles (1 meter = 0.000621371 miles)
    const miles = Math.round(ytdDistanceMeters * 0.000621371);

    return { miles, count: ytdCount };

  } catch (error) {
    console.error("Error fetching Strava data:", error);
    return null;
  }
};
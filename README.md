# YouTube Playlist Analyzer

**Short Description:**  
A simple web tool that allows you to analyze any YouTube playlist. It shows the **playlist name**, **number of videos**, **total duration**, and **playlist thumbnail**. This helps users quickly understand the size and length of a playlist before watching it.


## How It's Made

**Tech used:** HTML, CSS, JavaScript, YouTube Data API v3

**Details:**

1. Users enter a YouTube playlist URL in the input field.
2. The app extracts the **playlist ID** from the URL.
3. It uses the **YouTube Data API v3** to fetch:
   - Playlist details (`/playlists` endpoint) → name, number of videos, thumbnail
   - All video IDs (`/playlistItems` endpoint) → handles playlists with more than 50 videos using pagination
   - Video durations (`/videos` endpoint) → calculates total duration
4. The total duration is formatted into **hours and minutes**.
5. Results are displayed dynamically, including **playlist thumbnail, name, number of videos, and total duration**.

---

## Optimizations 

- **Pagination handling:** Fetches all video IDs for playlists longer than 50 videos.
- **Chunked requests:** Fetches video durations in batches of 50 to stay within API limits.
- **Async/Await:** Makes API calls efficient and non-blocking, improving user experience.
- **Thumbnail handling:** Picks the highest resolution thumbnail automatically.

---
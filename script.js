const API_KEY = "AIzaSyD3ag5nej-bNZG07kN8pk017nlwqZo3MRM";
const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const urlInput = document.getElementById("playlist").value;
  const playlistId = getPlaylistId(urlInput);

  if (!playlistId) {
    alert("Invalid playlist URL");
    return;
  }

 try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=AIzaSyD3ag5nej-bNZG07kN8pk017nlwqZo3MRM`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data)

    if (!data.items || data.items.length === 0) {
      alert("Playlist not found or private.");
      return;
    }

    const playlistName = data.items[0].snippet.title;
    const playlistSize = data.items[0].contentDetails.itemCount;
    const vdoId=await getAllVideoIds(playlistId,API_KEY);
    const totalSeconds=await getTotalDuration(vdoId,API_KEY);
    const formattedDuration=formatTime(totalSeconds);
    const thumbnails = data.items[0].snippet.thumbnails;

const thumbnailUrl =
  thumbnails.maxres?.url ||
  thumbnails.standard?.url ||
  thumbnails.high?.url ||
  thumbnails.medium?.url ||
  thumbnails.default?.url;


const resultDiv = document.getElementById("result");
if (resultDiv) {
  resultDiv.innerHTML = `
    <h2>${playlistName}</h2>
    <h3><p>This playlist has ${playlistSize} videos.</p></h3>
    <p>Total duration: ${formattedDuration}</p>
     <img src="${thumbnailUrl}" alt="Playlist Thumbnail" width="300">`;

}


//catch block
  } catch (err) {
    console.error(err);
    alert("Error fetching playlist data.");
  }
});

function getPlaylistId(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get("list");
  } catch {
    return null;
  }
}

async function getAllVideoIds(playlistId, API_KEY) {
  let videoIds = [];
  let nextPageToken = "";
do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    data.items.forEach(item => {
      videoIds.push(item.contentDetails.videoId);
    });

    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return videoIds;
}


async function getTotalDuration(videoIds, API_KEY) {
  let totalSeconds = 0;

  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50).join(",");

    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    data.items.forEach(video => {
      totalSeconds += convertToSeconds(video.contentDetails.duration);
    });
  }

  return totalSeconds;
}

function convertToSeconds(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  return (
    (parseInt(match[1] || 0) * 3600) +
    (parseInt(match[2] || 0) * 60) +
    parseInt(match[3] || 0)
  );
}


function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} hours ${minutes} minutes`;
}


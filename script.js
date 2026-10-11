/*
  INDYDXG TRACK CATALOG
  - Put only released/public tracks in this list.
  - Add audio files under the music/ folder, then set src to the path.
  - Example: src: "music/my-track.mp3"
  - Do not add private demos, unreleased tracks, or WAV masters to this public website.
*/

const releases = [
  {
    title: "12 mutts",
    type: "EP",
    year: "2024",
    cover: "",
    tracks: [
      {
        title: "stack more, talk less.",
        src: "music/12 mutts/stackmore.mp3",
        format: "MP3",
        durationNote: ""
      },
      {
        title: "total skorn.",
        src: "music/12 mutts/totalskornsong.mp3",
        format: "MP3",
        durationNote: ""
      },
      {
        title: "clairvoyant..",
        src: "music/12 mutts/clairvoyantsong.mp3",
        format: "MP3",
        durationNote: ""
      }
    ]
  }
];

const audio = document.getElementById("audio");
const playButton = document.getElementById("play-button");
const seek = document.getElementById("seek");
const volume = document.getElementById("volume");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const nowTitle = document.getElementById("now-title");
const nowRelease = document.getElementById("now-release");
const nowDetail = document.getElementById("now-detail");
const playerState = document.getElementById("player-state");
const formatLabel = document.getElementById("format-label");
const releaseList = document.getElementById("release-list");
let activeButton = null;

function timeLabel(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function playTrack(track, release, button) {
  if (!track.src || track.src.includes("track-one.mp3") || track.src.includes("track-two.mp3")) {
    playerState.textContent = "ADD YOUR AUDIO FILE";
    nowTitle.textContent = track.title;
    nowRelease.textContent = release.title;
    nowDetail.textContent = `Put the audio file in music/ and update its src in script.js.`;
    return;
  }
  if (activeButton) activeButton.removeAttribute("aria-current");
  activeButton = button;
  if (activeButton) activeButton.setAttribute("aria-current", "true");
  audio.src = track.src;
  audio.load();
  nowTitle.textContent = track.title;
  nowRelease.textContent = release.title;
  nowDetail.textContent = `${release.year} / ${track.format || "AUDIO"}`;
  formatLabel.textContent = track.format || "AUDIO";
  playButton.disabled = false;
  seek.disabled = false;
  playerState.textContent = "LOADING TRACK";
  audio.play().then(() => {
    playButton.textContent = "Ⅱ";
    playerState.textContent = "NOW PLAYING";
  }).catch(() => {
    playerState.textContent = "PRESS PLAY TO START";
    playButton.textContent = "▶";
  });
}

function renderReleases() {
  releaseList.innerHTML = "";
  let releaseNumber = 0;
  releases.forEach((release) => {
    releaseNumber += 1;
    const article = document.createElement("article");
    article.className = "release";
    const cover = release.cover ? document.createElement("img") : document.createElement("div");
    cover.className = "release-cover" + (release.cover ? "" : " cover-placeholder");
    if (release.cover) {
      cover.src = release.cover;
      cover.alt = `${release.title} cover artwork`;
    } else {
      cover.setAttribute("aria-hidden", "true");
      cover.textContent = "ID//";
    }

    const body = document.createElement("div");
    const type = document.createElement("div");
    type.className = "release-type";
    type.textContent = `${release.type} / ${release.year}`;
    const title = document.createElement("h3");
    title.textContent = release.title;
    const description = document.createElement("p");
    description.textContent = `${release.tracks.length} TRACK${release.tracks.length === 1 ? "" : "S"}`;
    const trackList = document.createElement("div");
    trackList.className = "track-list";

    release.tracks.forEach((track, index) => {
      const button = document.createElement("button");
      button.className = "track-button";
      button.type = "button";
      button.textContent = `${String(index + 1).padStart(2, "0")}  ${track.title}  ▶`;
      button.addEventListener("click", () => playTrack(track, release, button));
      trackList.appendChild(button);
    });

    body.append(type, title, description, trackList);
    const side = document.createElement("div");
    side.className = "release-side";
    side.textContent = `NO. ${String(releaseNumber).padStart(2, "0")}`;
    article.append(cover, body, side);
    releaseList.appendChild(article);
  });
  document.getElementById("release-count").textContent = `01—${String(releaseNumber).padStart(2, "0")}`;
}

playButton.addEventListener("click", () => {
  if (!audio.src) return;
  if (audio.paused) {
    audio.play().then(() => {
      playButton.textContent = "Ⅱ";
      playerState.textContent = "NOW PLAYING";
    }).catch(() => { playerState.textContent = "UNABLE TO PLAY"; });
  } else {
    audio.pause();
    playButton.textContent = "▶";
    playerState.textContent = "PAUSED";
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = timeLabel(audio.duration);
  playerState.textContent = "READY";
});
audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = timeLabel(audio.currentTime);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    seek.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
  }
});
audio.addEventListener("ended", () => {
  playButton.textContent = "▶";
  playerState.textContent = "TRACK ENDED";
  seek.value = "0";
});
audio.addEventListener("error", () => {
  playerState.textContent = "AUDIO FILE NOT FOUND";
  nowDetail.textContent = "Check the file name and path in script.js.";
});
seek.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
  }
});
volume.addEventListener("input", () => { audio.volume = Number(volume.value); });
audio.volume = Number(volume.value);
document.getElementById("year").textContent = new Date().getFullYear();
renderReleases();

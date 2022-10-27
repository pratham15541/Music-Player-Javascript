const wrapper = document.querySelector(".wrapper"),
  musicImg = document.querySelector(".img-area img"),
  musicName = document.querySelector(".name"),
  musicArtist = document.querySelector(".artist"),
  mainAudio = document.querySelector("#main-audio"),
  playPausebtn = document.querySelector(".play-pause"),
  prevbtn = document.querySelector("#prev"),
  nextbtn = document.querySelector("#next"),
  progressArea = document.querySelector(".progress-area"),
  musicList = document.querySelector(".music-list"),
  showMoreMusic = document.querySelector("#more-music"),
  hideMoreMusic = document.querySelector("#close"),
  progressBar = document.querySelector(".progress-bar");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = allMusic[indexNumb - 1].img;
  mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mp3`;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPausebtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPausebtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

function nextMusic() {
  //increment index
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow()
}

function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow()
}

playPausebtn.addEventListener("click", () => {
  const isMUsicPlay = wrapper.classList.contains("paused");
  isMUsicPlay ? pauseMusic() : playMusic();
  playingNow()
});

prevbtn.addEventListener("click", () => {
  prevMusic();
});

nextbtn.addEventListener("click", () => {
  nextMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    //updat song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      //adding zero if sec is less than 10
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  //update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    //adding zero if sec is less than 10
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth;
  let clickedOffSetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  playMusic();
});

const repeatBtn = document.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song Looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "PlayBack Shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "PlayList Looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingNow()
      break;
  }
});

showMoreMusic.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMoreMusic.addEventListener("click", () => {
  showMoreMusic.click();
});

const ulTag = document.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
  let liTag = ` <li li-index="${i + 1}">
  <div class="row">
      <span id="title">${allMusic[i].name}</span>
      <span id="artist">${allMusic[i].artist}
      <p>${allMusic[i].artist}</p></span>
  </div>
  <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
  <span id="${allMusic[i].src}" class="audio-duration"></span>
</li>
`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      //adding zero if sec is less than 10
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);
  });
}

function playingNow() {
  const allLiTags = ulTag.querySelectorAll("li");
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration")
    if (allLiTags[j].classList.contains("playing")){
      allLiTags[j].classList.remove("playing")
        let adDuration = audioTag.getAttribute("t-duration")
        audioTag.innerText = adDuration
      }

    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing"

    }
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
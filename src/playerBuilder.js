import './styles/media-player.scss';

const elementCreater = (tagName, className, src) => {
  const element = document.createElement(tagName);
  element.className = className
  element.src = src
  return element;
};

const setAttributes = (el, attrs) => {
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

class SoundPlayer {
  constructor(rootElement = document.body) {
    this.speedList = {
      '0.5x': 0.5,
      '1x': 1,
      '1.25x': 1.25,
      '1.5x': 1.5,
      '1.75x': 1.75,
      '2x': 2,
      '2.25x': 2.25
    }
    this.rootElement = rootElement;
    this.mediaElement = document.createElement('audio');
    this.mediaElement.volume = 1
    this.mediaElement.addEventListener('ended', () => this.onAudioEnded())
    this.renderPlayer();
  }

  renderPlayer = () => {
    this.classPrefix = 'sound-player'

    const wrapper = elementCreater('div', `${this.classPrefix}-wrapper`);
    this.rootElement.appendChild(wrapper)

    this.title = elementCreater('div', `${this.classPrefix}-title`)
    this.title.innerHTML = 'Название дорожки'

    const toolBar = elementCreater('div', `${this.classPrefix}-toolbar`);

    const wrapperChildrens = [this.title, toolBar];
    wrapperChildrens.forEach(el => wrapper.appendChild(el))

    const playButton = this.createPlayButton();
    const stopButton = this.createStopButton();

    const currentTimeSpan = this.createCurrentTimeSpan();

    const timeLeftSpan = this.createTimeLeftSpan();

    const speedChanger = this.createSpeedChanger();
    const volumeChanger = this.createVolumeChanger();
    
    const downloadButton = this.createDownloadButton();

    const uploadButton = this.createUploadButton();

    const progressBar = this.createProgressBar()

    const toolBarChildrens = [
      playButton,
      stopButton,
      currentTimeSpan,
      progressBar,
      timeLeftSpan,
      speedChanger,
      volumeChanger,
      downloadButton,
      uploadButton
    ];
    toolBarChildrens.forEach(el => toolBar.appendChild(el))
  
  }

  createPlayButton = () => {
    this.playButton = elementCreater('div', `${this.classPrefix}-play-button`)
    this.playButton.addEventListener('click', () => {
      if (this.uploadInput.value != '') {
        this.playAudio()
      }
    })
    return this.playButton
  }

  createStopButton = () => {
    this.stopButton = elementCreater('div', `${this.classPrefix}-stop-button`)
    this.stopButton.addEventListener('click', () => this.stopAudio())
    return this.stopButton
  }

  createCurrentTimeSpan = () => {
    this.currentTimeSpan = elementCreater('span', `${this.classPrefix}-current-time`)
    this.currentTimeSpan.innerHTML = '0:00'
    return this.currentTimeSpan
  }

  createProgressBar = () => {
    const progressWrapper = elementCreater('div', `${this.classPrefix}-progress-wrapper`);
    const progressLine = elementCreater('div', `${this.classPrefix}-progress-line`)
    progressLine.addEventListener('click', (e) => {
      const lineRect = e.target.getBoundingClientRect() 
      const position = (e.clientX - lineRect.x)
      if (this.uploadInput.value != '') {
        this.progressBarUpdate(position)
        this.mediaElement.currentTime = (position / (e.target.clientWidth / 100)) * (this.mediaElement.duration / 100)
        if (this.mediaElement.paused) {
          this.playAudio()
        }
      }
    })
    this.progressBar = elementCreater('div', `${this.classPrefix}-progress-bar`)
    const progressWrapperChildrens = [
      this.progressBar,
      progressLine
    ];
    progressWrapperChildrens.forEach(el => progressWrapper.appendChild(el))
    return progressWrapper
  }

  createTimeLeftSpan = () => {
    this.timeLeftSpan = elementCreater('span', `${this.classPrefix}-time-left`)
    this.timeLeftSpan.innerHTML = '0:00'
    this.mediaElement.addEventListener('durationchange', () => {
      this.timeLeftSpan.innerHTML = this.getAudioDuration(this.mediaElement.duration)
    })
    return this.timeLeftSpan
  }

  createSpeedChanger = () => {
    const speedViewer = elementCreater('button', `${this.classPrefix}-speed-changer`);
    const currentSpeed = elementCreater('span')
    currentSpeed.innerHTML = '1x'
    speedViewer.appendChild(currentSpeed)
    const speedChangerMenu = elementCreater('div', `${this.classPrefix}-speed-changer-menu`)
    speedViewer.appendChild(speedChangerMenu)
    Object.keys(this.speedList).reverse().forEach((key) => {
      const speedButton = elementCreater('button')
      speedButton.innerHTML = key;
      speedButton.addEventListener('click', () => {
        this.mediaElement.playbackRate = this.speedList[key]
        currentSpeed.innerHTML = key
      })
      speedChangerMenu.appendChild(speedButton)
    })
    return speedViewer;
  }

  createVolumeChanger = () => {
    const volumeViewer = elementCreater('div', `${this.classPrefix}-volume-changer`);
    const volumeSlider = elementCreater('input', `${this.classPrefix}-volume-slider`);
    setAttributes(volumeSlider, { "type": "range", "min": "0", "max": "1", "step": "any", "value": "0,5" })
    volumeViewer.appendChild(volumeSlider)
    volumeSlider.addEventListener('input', () => this.mediaElement.volume = volumeSlider.value)
    const image = elementCreater('img');
    image.addEventListener('click', () => {
      image.src = 'https://png.pngtree.com/svg/20160628/abd7f14a9d.svg'
      if (this.mediaElement.volume == 1) {
        this.mediaElement.volume = 0
        volumeSlider.value = '0'
      } else {
        this.mediaElement.volume = 1
        volumeSlider.value = '0,5'
        image.src = 'https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/volume-24-512.png'
      }
    })
    image.src = 'https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/volume-24-512.png'
    volumeViewer.appendChild(image)
    return volumeViewer;
  }

  createDownloadButton = () => {
    this.downloadWrapper = elementCreater('a')
    const downloadButton = elementCreater('button', `${this.classPrefix}-download-button`)
    const downloadImage = elementCreater('img', null, 'https://i-love-png.com/images/downloadicon.png')
    downloadButton.appendChild(downloadImage)
    downloadButton.addEventListener('click', this.onDownloadTrack)
    this.downloadWrapper.appendChild(downloadButton)
    return this.downloadWrapper;
  }

  createUploadButton = () => {
    const uploadWrapper = elementCreater('div', `${this.classPrefix}-upload-wrapper`)
    this.uploadInput = elementCreater('input')
    setAttributes(this.uploadInput, { "type": "file", "id": "input-file", "accept": "audio/*" })
    uploadWrapper.appendChild(this.uploadInput)
    const uploadLabel = elementCreater('label')
    uploadLabel.htmlFor = 'input-file'
    this.uploadInput.addEventListener('change', () => this.onUploadTrack())
    uploadWrapper.appendChild(uploadLabel)
    const uploadImage = elementCreater('img', null, 'https://i-love-png.com/images/downloadicon.png');
    uploadLabel.appendChild(uploadImage)
    return uploadWrapper
  }

  playAudio = () => {
    this.playButton.style.display = 'none'
    this.stopButton.style.display = 'block'
    this.mediaElement.addEventListener('timeupdate', this.playerUpdate)
    this.mediaElement.play()
  }

  stopAudio = () => {
    this.mediaElement.pause();
    this.playButton.style.display = 'block'
    this.stopButton.style.display = 'none'
  }

  onAudioEnded = () => {
    this.currentTimeSpan.innerHTML = '0:00'
    this.timeLeftSpan.innerHTML = '0:00'
    this.playButton.style.display = 'block'
    this.stopButton.style.display = 'none'
    this.progressBarUpdate(0)

    this.mediaElement.removeEventListener('timeupdate', this.playerUpdate)
  }

  playerUpdate = () => {
    const trackTimePercents = (this.mediaElement.currentTime / (this.mediaElement.duration / 100)) 
    const progressBarPosition = (
      trackTimePercents * (this.progressBar.clientWidth / 100)
    )
    this.progressBarUpdate(progressBarPosition)
    this.updateTimeSpans()
  }

  getAudioDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration) - (minutes * 60)
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  updateTimeSpans = () => {
    this.timeLeftSpan.innerHTML = this.getAudioDuration(this.mediaElement.duration)
    this.currentTimeSpan.innerHTML = this.getAudioDuration(this.mediaElement.currentTime)
    this.timeLeftSpan.innerHTML = this.getAudioDuration((this.mediaElement.duration - this.mediaElement.currentTime))
  }

  progressBarUpdate = (position) => {
    this.progressBar.style.left = position + 'px'
  }

// Реализация загрузки медиа в плеер
  onUploadTrack = () => {
    this.title.innerHTML = this.uploadInput.files[0].name.split('.')[0]
    this.mediaElement.src = window.URL.createObjectURL(this.uploadInput.files[0])
    this.downloadWrapper.href = `${this.mediaElement.src}`
  }

// Реализация загрузки медиа на компьютер
  onDownloadTrack = () => {
    this.downloadWrapper.download = `${this.title.innerHTML}`
  }
}


export default function playerBuilder(rootSelector) {
  const rootElement = document.querySelector(rootSelector);
  return new SoundPlayer(rootElement);
}
import './styles/media-player.scss';

const elementCreater = (tagName, className, src) => {
  const element = document.createElement(tagName);
  element.className = className
  element.src = src
  return element;
};
class SoundPlayer {
  constructor(rootElement = document.body) {
    this.speedList = {
      '1x': 1,
      '1.5x': 1.5,
      '2x': 2
    }
    this.rootElement = rootElement;
    this.mediaElement = document.createElement('audio');
    this.mediaElement.volume = 1
    this.renderPlayer();
  }

  renderPlayer = () => {
    this.isPlaying = false
    this.mediaElement.addEventListener('ended', () => this.onAudioEnded())

    this.classPrefix = 'sound-player'
    const wrapper = elementCreater('div', `${this.classPrefix}-wrapper`)
    
    this.rootElement.appendChild(wrapper)

    this.title = elementCreater('div', `${this.classPrefix}-title`);
    this.title.innerHTML = 'Название трека'
    const toolBar = elementCreater('div', `${this.classPrefix}-toolbar`);

    const wrapperChildrens = [this.title, toolBar];
    wrapperChildrens.forEach(el => wrapper.appendChild(el))

    this.createPlayButton()

    this.currentTimeSpan = elementCreater('span', `${this.classPrefix}-current-time`)
    this.currentTimeSpan.innerHTML = '0:00'

    this.timeLeftSpan = elementCreater('span', `${this.classPrefix}-time-left`)
    this.timeLeftSpan.innerHTML = '0:00'
    this.mediaElement.addEventListener('durationchange', () => {
      this.timeLeftSpan.innerHTML = this.getAudioDuration(this.mediaElement.duration)
    })

    const speedViewer = this.createSpeedChanger()
    const volumeViewer = this.createVolumeChanger();
    
    this.downloadButton = elementCreater('button', `${this.classPrefix}-download-button`)
    const downloadImage = elementCreater('img', null, 'https://i-love-png.com/images/downloadicon.png')
    this.downloadButton.appendChild(downloadImage)
    
    const uploadWrapper = elementCreater('div', `${this.classPrefix}-upload-wrapper`)
    this.uploadInput = elementCreater('input')
    this.uploadInput.type = 'file'
    this.uploadInput.id = 'input-file'
    this.uploadInput.accept = 'audio/*'

    uploadWrapper.appendChild(this.uploadInput)
    const uploadLabel = elementCreater('label')
    uploadLabel.htmlFor = 'input-file'
    this.uploadInput.addEventListener('change', () => this.onUploadTrack())
    uploadWrapper.appendChild(uploadLabel)
    const uploadImage = elementCreater('img', null, 'https://i-love-png.com/images/downloadicon.png');
    uploadLabel.appendChild(uploadImage)
    const timeProgressBar = this.createProgressBar((position, e) => {
      this.mediaElement.currentTime = (position / (e.target.clientWidth / 100)) * (this.mediaElement.duration / 100)
      if (this.mediaElement.paused) {
        this.playAudio()
      }
    })

    const toolBarChildrens = [
      this.playButton,
      this.stopButton,
      this.currentTimeSpan,
      timeProgressBar,
      this.timeLeftSpan,
      speedViewer,
      volumeViewer,
      this.downloadButton,
      uploadWrapper
    ];
    toolBarChildrens.forEach(el => toolBar.appendChild(el))
  
  }

  createProgressBar = (onClick) => {
    const progressWrapper = elementCreater('div', `${this.classPrefix}-progress-wrapper`);
    const progressLine = elementCreater('div', `${this.classPrefix}-progress-line`)
    progressLine.addEventListener('click', (e) => {
      const lineRect = e.target.getBoundingClientRect() 
      const position = (e.clientX - lineRect.x)
      this.progressBarUpdate(position)
      onClick(position, e)
    })
    this.progressBar = elementCreater('div', `${this.classPrefix}-progress-bar`)
    const progressWrapperChildrens = [
      this.progressBar,
      progressLine
    ];
    progressWrapperChildrens.forEach(el => progressWrapper.appendChild(el))
    return progressWrapper
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
      speedButton.addEventListener('click', (e) => {
        this.mediaElement.playbackRate = this.speedList[key]
        currentSpeed.innerHTML = key
      })
      speedChangerMenu.appendChild(speedButton)
    })
    return speedViewer;
  }

  createVolumeChanger = () => {
    const volumeViewer = elementCreater('div', `${this.classPrefix}-volume-changer`);
    const volumeProgressBar = this.createProgressBar(() => {
      
    })
    volumeViewer.appendChild(volumeProgressBar)
    
    const image = elementCreater('img');
    image.addEventListener('click', () => {
      image.src = 'https://png.pngtree.com/svg/20160628/abd7f14a9d.svg'
      if (this.mediaElement.volume == 1) {
        this.mediaElement.volume = 0
      } else {
        this.mediaElement.volume = 1
        image.src = 'https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/volume-24-512.png'
      }
    })
    image.src = 'https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/volume-24-512.png'
    volumeViewer.appendChild(image)
    return volumeViewer;
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

  createPlayButton = () => {
    this.playButton = elementCreater('div', `${this.classPrefix}-play-button`)
    this.playButton.addEventListener('click', () => {
      if (this.uploadInput.value != '') {
        this.playAudio()
      }
    })

    this.stopButton = elementCreater('div', `${this.classPrefix}-stop-button`)
    const stopButtonImage = elementCreater('img', null, 'https://cdn2.iconfinder.com/data/icons/font-awesome/1792/pause-circle-512.png')
    this.stopButton.appendChild(stopButtonImage)
    this.stopButton.addEventListener('click', () => this.stopAudio())
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
    console.log(this.progressBar.style.left)
  }
  
  onSpeedChange = (speed) => {
    this.speed = speed
  }

  onVolumeChange = (volume) => {
    this.volume = volume
  }

  onUploadTrack = () => {
    this.title.innerHTML = this.uploadInput.files[0].name.split('.')[0]
    this.mediaElement.src = window.URL.createObjectURL(this.uploadInput.files[0])
  }
}


export default function playerBuilder(rootSelector) {
  const rootElement = document.querySelector(rootSelector);
  console.log(rootElement);
  return new SoundPlayer(rootElement);
}
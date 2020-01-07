import './styles/media-player.scss';

const elementCreater = (tagName, className, src) => {
  const element = document.createElement(tagName);
  element.className = className
  element.src = src
  return element;
};
class SoundPlayer {
  constructor(rootElement = document.body) {
    this.speedList = [
      '1x',
      '1.5x',
      '2x'
    ]
    this.rootElement = rootElement;
    this.mediaElement = document.createElement('audio');
    this.mediaElement.volume = 1
    this.currentProgressPosition = '-100'
    this.speed = 1;
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

    this.playButton = elementCreater('div', `${this.classPrefix}-play-button`)
    this.playButton.addEventListener('click', () => {
      if (this.uploadInput.value != '') {
        this.playAudio()
      }
    })
    
    this.stopButton = elementCreater('div', `${this.classPrefix}-stop-button`)
    const stopButtonImage = elementCreater('img', null, 'https://cdn2.iconfinder.com/data/icons/font-awesome/1792/pause-circle-512.png')
    this.stopButton.appendChild(stopButtonImage)
    this.stopButton.addEventListener('click', () => this.playAudio())

    this.currentTimeSpan = elementCreater('span', `${this.classPrefix}-current-time`)
    this.currentTimeSpan.innerHTML = '0:00'
    const progressWrapper = elementCreater('div', `${this.classPrefix}-progress-wrapper`);
    const progressLine = elementCreater('div', `${this.classPrefix}-progress-line`);
    this.progressBar = elementCreater('div', `${this.classPrefix}-progress-bar`)
    this.progressBar.style.transform = `translate(calc(${this.currentProgressPosition}% + 5px), -50%)`
    this.progressBarValue = this.currentProgressPosition

    this.timeLeftSpan = elementCreater('span', `${this.classPrefix}-time-left`)
    this.timeLeftSpan.innerHTML = '0:00'
    this.mediaElement.addEventListener('durationchange', () => {
      this.timeLeftSpan.innerHTML = this.getAudioDuration(this.mediaElement.duration)
    })

    this.speedViewer = this.createSpeedChanger()
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

    const toolBarChildrens = [
      this.playButton,
      this.stopButton,
      this.currentTimeSpan,
      progressWrapper,
      this.timeLeftSpan,
      this.speedViewer,
      volumeViewer,
      this.downloadButton,
      uploadWrapper
    ];
    toolBarChildrens.forEach(el => toolBar.appendChild(el))
  
    const progressWrapperChildrens = [
      this.progressBar,
      progressLine
    ];
    progressWrapperChildrens.forEach(el => progressWrapper.appendChild(el))

  }

  createSpeedChanger = () => {
    const speedViewer = elementCreater('button', `${this.classPrefix}-speed-changer`);
    speedViewer.innerHTML = this.speedList[0]
    return speedViewer;
  }

  createVolumeChanger = () => {
    const volumeViewer = elementCreater('div', `${this.classPrefix}-volume-changer`);
    this.image = elementCreater('img');
    volumeViewer.addEventListener('click', () => {
      this.image.src = 'https://png.pngtree.com/svg/20160628/abd7f14a9d.svg'
      if (this.mediaElement.volume == 1) {
        this.mediaElement.volume = 0
      } else {
        this.mediaElement.volume = 1
        this.image.src = 'https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/volume-24-512.png'
      }
    })
    this.image.src = 'https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/volume-24-512.png'
    volumeViewer.appendChild(this.image)
    return volumeViewer;
  }

  

  playAudio = () => {
    if (this.isPlaying == false) {
      this.mediaElement.play()
      this.isPlaying = true
      this.playButton.style.display = 'none'
      this.stopButton.style.display = 'block'
      this.timerId = setInterval(() => {
        this.currentTimeSpan.innerHTML = this.getAudioDuration(this.mediaElement.currentTime)
        this.timeLeftSpan.innerHTML = this.getAudioDuration((this.mediaElement.duration - this.mediaElement.currentTime))
        this.progressBar.style.transform = this.progressBarValue
        this.progressBarUpdate(this.mediaElement.duration, this.currentProgressPosition)
        console.log(this.progressBar.style.transform)
      }, 1000)
    } else {
      this.mediaElement.pause();
      this.isPlaying = false
      this.playButton.style.display = 'block'
      this.stopButton.style.display = 'none'
      clearInterval(this.timerId)
    }
  }

  onAudioEnded = () => {
    this.currentTimeSpan.innerHTML = '0:00'
    this.timeLeftSpan.innerHTML = '0:00'
    this.isPlaying = false
    this.playButton.style.display = 'block'
    this.stopButton.style.display = 'none'
    clearInterval(this.timerId)
  }

  // progressBarUpdate = () => {
  //   this.currentTime
  //   this.progressBar
  // }

  getAudioDuration = (duration) => {
    const correctDuration = [duration].toLocaleString().replace(/\,/g, "") -2
    const minutes = Math.floor(correctDuration / 60000);
    const seconds = ((correctDuration % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  progressBarUpdate = (duration, position) => {
    this.progressBarTime = duration / 10
    const previousPosition = +position + this.progressBarTime
    this.progressBarValue = `translate(calc(${+position + previousPosition}% + 5px), -50%)`
    // this.newPosition = this.positionUpdate 
    // console.log(this.progressBarTime)
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
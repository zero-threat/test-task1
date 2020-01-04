import './styles/media-player.scss';

const elementCreater = (tagName, className) => {
  const element = document.createElement(tagName)
  element.className = className
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
    this.speed = 1;
    this.renderPlayer();
    this.play();
  }

  renderPlayer = () => {
    this.classPrefix = 'sound-player'
    const wrapper = elementCreater('div', `${this.classPrefix}-wrapper`)
    
    this.rootElement.appendChild(wrapper)

    const title = elementCreater('div', `${this.classPrefix}-title`)
    title.innerHTML = 'Название дорожки'
    const toolBar = elementCreater('div', `${this.classPrefix}-toolbar`)

    const wrapperChildrens = [title, toolBar]
    wrapperChildrens.forEach(el => wrapper.appendChild(el))

    this.playButton = elementCreater('div', `${this.classPrefix}-play-button`)
    this.currentTimeSpan = elementCreater('span', `${this.classPrefix}-current-time`)
    this.currentTimeSpan.innerHTML = '0:00'
    const progressWrapper = elementCreater('div', `${this.classPrefix}-progress-wrapper`)
    const progressLine = elementCreater('div', `${this.classPrefix}-progress-line`)
    this.progressBar = elementCreater('div', `${this.classPrefix}-progress-bar`)
    this.timeLeftSpan = elementCreater('span', `${this.classPrefix}-time-left`)
    this.timeLeftSpan.innerHTML = '0:00'
    this.speedViewer = this.createSpeedChanger()
    const volumeViewer = this.createVolumeChanger()

    const toolBarChildrens = [
      this.playButton,
      this.currentTimeSpan,
      progressWrapper,
      this.timeLeftSpan,
      this.speedViewer,
      volumeViewer
    ]
    toolBarChildrens.forEach(el => toolBar.appendChild(el))
  
    const progressWrapperChildrens = [
      this.progressBar,
      progressLine
    ]
    progressWrapperChildrens.forEach(el => progressWrapper.appendChild(el))

  }

  createSpeedChanger = () => {
    const speedViewer = elementCreater('button', `${this.classPrefix}-speed-changer`)
    speedViewer.innerHTML = this.speedList[0]
    return speedViewer;
  }

  createVolumeChanger = () => {
    const volumeViewer = elementCreater('div', `${this.classPrefix}-volume-changer`)
    const image = elementCreater('img')
    image.src = 'https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/volume-24-512.png'
    volumeViewer.appendChild(image)
    return volumeViewer;
  }

  play = () => {
    this.intervalId = setInterval(() => {
      this.progressBarUpdate()
      this.timeSpanUpdate()   
    }, 1000)
  }

  stop = () => {
    clearInterval(this.intervalId)
  }

  progressBarUpdate = () => {
    this.currentTime
    this.progressBar
  }

  timeSpanUpdate = () => {
    this.currentTime
  }

  onProgressBarChange = (time) => {
    this.currentTime = time
  }

  onSpeedChange = (speed) => {
    this.speed = speed
  }

  onVloumeChange = (volume) => {
    this.volume = volume
  }
}


export default function playerBuilder(rootSelector) {
  const rootElement = document.querySelector(rootSelector);
  console.log(rootElement);
  return new SoundPlayer(rootElement);
}
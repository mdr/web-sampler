import Bowser from 'bowser'

export const isChromiumBasedBrowser = (): boolean =>
  Bowser.getParser(window.navigator.userAgent).getEngineName() === 'Blink'

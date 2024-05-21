import Bowser, { Parser } from 'bowser'

const getParser = (): Parser.Parser => Bowser.getParser(window.navigator.userAgent)

export const isChromiumBasedBrowser = (): boolean => getParser().getEngineName() === 'Blink'

export const isMacOs = (): boolean => getParser().getOSName() === 'macOS'

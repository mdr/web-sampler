import { Path } from '../../../utils/types/brandedTypes.ts'

export const DATA_DIRECTORY = Path('src/tests/playwright/data')

const dataPath = (filename: string) => Path(`${DATA_DIRECTORY}/${filename}`)

export const EXPECTED_WAV_DOWNLOAD_PATH = dataPath('expected-download.wav')
export const EXPECTED_MP3_DOWNLOAD_PATH = dataPath('expected-download.mp3')

// Emma Freud, CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0>, via Wikimedia Commons
// https://commons.wikimedia.org/wiki/File:Emma_Freud_voice.ogg
export const TEST_AUDIO_FILE = dataPath('test-audio-file.mp3')

// BBC, CC BY 3.0 <https://creativecommons.org/licenses/by/3.0>, via Wikimedia Commons
// https://commons.wikimedia.org/wiki/File:Angela_Gallop_-_Life_Scientific_-_27_March_2012.flac
export const LONG_AUDIO_FILE = dataPath('long-audio-file.flac')
export const INVALID_AUDIO_FILE = dataPath('invalid-audio-file.ogg')

export const TEST_IMAGE_FILE = dataPath('test-image-file.jpg')

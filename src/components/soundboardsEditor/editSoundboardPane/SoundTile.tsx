import { getSoundDisplayName, Sound, soundHasAudio, SoundWithDefiniteAudio } from '../../../types/Sound.ts'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { Button, Toolbar } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiPencil, mdiPlay, mdiTrashCan } from '@mdi/js'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { useNavigate } from 'react-router-dom'
import { editSoundRoute } from '../../routes.ts'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Option } from '../../../utils/types/Option.ts'
import { Url } from '../../../utils/types/brandedTypes.ts'
import { getPlayRegionAudioData } from '../../../types/SoundAudio.ts'
import { pcmToWavBlob } from '../../../utils/wav.ts'
import { unawaited } from '../../../utils/utils.ts'

export interface SoundTileProps {
  sound: Sound
}

export const SoundTile = ({ sound }: SoundTileProps) => {
  const soundActions = useSoundActions()
  const navigate = useNavigate()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: sound.id,
  })
  const { setNodeRef: setNodeRef2 } = useDroppable({ id: sound.id })
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined
  const setRef = (element: HTMLElement | null) => {
    setNodeRef(element)
    setNodeRef2(element)
  }
  const handleRemoveSound = () => {
    soundActions.deleteSound(sound.id)
  }
  const handleEdit = () => {
    navigate(editSoundRoute(sound.id))
  }
  return (
    <div
      data-testid={EditSoundboardPaneTestIds.soundTile}
      ref={setRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex aspect-square flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-50 shadow-md hover:bg-gray-100"
    >
      <div className="flex flex-grow items-center justify-center text-center">{getSoundDisplayName(sound)}</div>
      <div className="flex w-full justify-center bg-blue-200 pb-1 pt-2">
        <Toolbar>
          {soundHasAudio(sound) && <PlaySoundButton sound={sound} />}
          <Button
            data-testid={EditSoundboardPaneTestIds.editSoundButton}
            className="rounded px-1 py-1 hover:bg-blue-300 focus:bg-blue-400"
            onPress={handleEdit}
            aria-label={`Edit sound ${getSoundDisplayName(sound)}`}
          >
            <Icon path={mdiPencil} size={1} />
          </Button>
          <Button
            data-testid={EditSoundboardPaneTestIds.removeSoundButton}
            className="rounded px-1 py-1 hover:bg-blue-300 focus:bg-blue-400"
            onPress={handleRemoveSound}
            aria-label={`Remove sound ${getSoundDisplayName(sound)} from the soundboard`}
          >
            <Icon path={mdiTrashCan} size={1} />
          </Button>
        </Toolbar>
      </div>
    </div>
  )
}

export interface PlaySoundButtonProps {
  sound: SoundWithDefiniteAudio
}

export const PlaySoundButton = ({ sound }: PlaySoundButtonProps) => {
  const { audio } = sound
  const [url, setUrl] = useState<Option<Url>>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audioData = getPlayRegionAudioData(audio)
    const blob = pcmToWavBlob(audioData)
    const objectUrl = Url(URL.createObjectURL(blob))
    setUrl(objectUrl)
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [audio])

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false)
  }, [setIsPlaying])

  useEffect(() => {
    const audioElement = audioRef.current ?? undefined
    if (audioElement !== undefined) {
      audioElement.volume = audio.volume
    }
  }, [audio.volume])

  useEffect(() => {
    const audioElement = audioRef.current ?? undefined
    if (audioElement !== undefined) {
      audioElement.addEventListener('ended', handleAudioEnded)
      return () => {
        audioElement.removeEventListener('ended', handleAudioEnded)
      }
    }
  }, [audioRef, handleAudioEnded])

  const handlePress = () => {
    const audioElement = audioRef.current ?? undefined
    if (audioElement !== undefined) {
      if (isPlaying) {
        audioElement.pause()
        setIsPlaying(false)
      } else {
        audioElement.currentTime = 0
        setIsPlaying(true)
        unawaited(audioElement.play())
      }
    }
  }

  return (
    <>
      <audio ref={audioRef} src={url} hidden></audio>
      <Button
        data-testid={EditSoundboardPaneTestIds.playSoundButton}
        className="rounded px-1 py-1 hover:bg-blue-300 focus:bg-blue-400"
        aria-label={`Play sound ${getSoundDisplayName(sound)}`}
        onPress={handlePress}
      >
        <Icon path={mdiPlay} size={1} />
      </Button>
    </>
  )
}

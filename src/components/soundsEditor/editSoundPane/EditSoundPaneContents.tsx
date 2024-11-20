import useUnmount from 'beautiful-react-hooks/useUnmount'
import { useCallback, useRef } from 'react'
import { toast } from 'react-toastify'

import { StartRecordingOutcome } from '../../../audioRecorder/AudioRecorder.ts'
import { AudioRecorderStatus } from '../../../audioRecorder/AudioRecorderService.ts'
import {
  useAudioRecorderActions,
  useAudioRecorderState,
  useAudioRecordingComplete,
} from '../../../audioRecorder/audioRecorderHooks.ts'
import { useSound, useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { AudioData } from '../../../types/AudioData.ts'
import { SoundId, soundHasAudio } from '../../../types/Sound.ts'
import { getPlayRegionDuration, getPlayRegionDurationFriendly } from '../../../types/SoundAudio.ts'
import { isChromiumBasedBrowser } from '../../../utils/browserUtils.ts'
import { Option } from '../../../utils/types/Option.ts'
import { TimerId } from '../../../utils/types/TimerId.ts'
import { secondsToMillis } from '../../../utils/types/brandedTypes.ts'
import { fireAndForget } from '../../../utils/utils.ts'
import { AddImageButton } from '../../images/editImagePane/AddImageButton.tsx'
import { AudioSection } from '../audioSection/AudioSection.tsx'
import { CropButton } from '../audioSection/CropButton.tsx'
import { DownloadMp3Button } from '../audioSection/DownloadMp3Button.tsx'
import { DownloadWavButton } from '../audioSection/DownloadWavButton.tsx'
import { MAX_RECORDING_DURATION } from '../recordingConstants.ts'
import { CaptureAudioButton } from './CaptureAudioButton.tsx'
import { DeleteSoundButton } from './DeleteSoundButton.tsx'
import { DuplicateSoundButton } from './DuplicateSoundButton.tsx'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { ImageDisplay } from './ImageDisplay.tsx'
import { ImportAudioButton } from './ImportAudioButton.tsx'
import { ShortcutsButton } from './ShortcutsButton.tsx'
import { SoundNameTextField } from './SoundNameTextField.tsx'
import { StopButton } from './StopButton.tsx'
import { VolumeMeter } from './VolumeMeter.tsx'

export interface EditSoundPaneProps {
  soundId: SoundId
}

// https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_audio_capture_support
const canCaptureAudioFromDisplayMedia = (): boolean => isChromiumBasedBrowser()

export const EditSoundPaneContents = ({ soundId }: EditSoundPaneProps) => {
  const sound = useSound(soundId)
  const soundActions = useSoundActions()
  const audioRecorderActions = useAudioRecorderActions()
  const { status: audioRecorderStatus } = useAudioRecorderState()
  const timerIdRef = useRef<Option<TimerId>>()

  const handleRecordingComplete = useCallback(
    (audioData: Option<AudioData>) => {
      if (audioData === undefined) {
        toast.error('No audio captured')
      } else {
        soundActions.setAudioData(sound.id, audioData)
      }
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
      }
    },
    [soundActions, sound],
  )

  useAudioRecordingComplete(handleRecordingComplete)

  useUnmount(() => {
    audioRecorderActions.stopRecording()
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current)
    }
  })

  const handleCaptureAudioButtonPressed = () =>
    fireAndForget(async () => {
      const outcome = await audioRecorderActions.startRecording()
      switch (outcome) {
        case StartRecordingOutcome.SUCCESS:
          timerIdRef.current = setTimeout(
            () => audioRecorderActions.stopRecording(),
            secondsToMillis(MAX_RECORDING_DURATION),
          )
          break
        case StartRecordingOutcome.CANCELLED_BY_USER:
          break
        case StartRecordingOutcome.NO_AUDIO_TRACK:
          if (canCaptureAudioFromDisplayMedia()) {
            toast.error('No audio available in selected input')
          } else {
            toast.error('No audio available in selected input. Try a Chromium-based browser such as Chrome or Edge.', {
              autoClose: 10000,
            })
          }
          break
      }
    })

  const handleStopButtonPressed = () => audioRecorderActions.stopRecording()

  const setSoundName = (name: string) => soundActions.setSoundName(soundId, name)

  const audio = sound.audio

  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <SoundNameTextField name={sound.name} setName={setSoundName} />
      <div className="flex space-x-2">
        <DeleteSoundButton soundId={soundId} />
        <DuplicateSoundButton soundId={soundId} />
        <ShortcutsButton />
      </div>
      <h2 className="text-xl" data-testid={EditSoundPaneTestIds.imageHeading}>
        Image
      </h2>
      <div className="flex">{sound.image === undefined && <AddImageButton soundId={soundId} />}</div>
      {sound.image !== undefined && <ImageDisplay imageId={sound.image} />}
      <h2 className="text-xl" data-testid={EditSoundPaneTestIds.audioHeading}>
        Audio
        {audio !== undefined && audioRecorderStatus === AudioRecorderStatus.IDLE && (
          <> ({getPlayRegionDurationFriendly(audio)})</>
        )}
      </h2>
      {audioRecorderStatus === AudioRecorderStatus.IDLE && (
        <>
          <div className="flex space-x-2">
            <CaptureAudioButton onPress={handleCaptureAudioButtonPressed} />
            <ImportAudioButton soundId={soundId} />
            {soundHasAudio(sound) && getPlayRegionDuration(sound.audio) > 0 && <DownloadWavButton sound={sound} />}
            {soundHasAudio(sound) && getPlayRegionDuration(sound.audio) > 0 && <DownloadMp3Button sound={sound} />}
            {audio !== undefined && <CropButton soundId={soundId} />}
          </div>
          {soundHasAudio(sound) && <AudioSection sound={sound} />}
        </>
      )}
      {audioRecorderStatus === AudioRecorderStatus.RECORDING && (
        <div className="flex items-center space-x-4">
          <StopButton onPress={handleStopButtonPressed} />
          <VolumeMeter />
        </div>
      )}
    </div>
  )
}

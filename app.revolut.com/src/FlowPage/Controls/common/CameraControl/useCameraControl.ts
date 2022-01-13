import { RefObject, useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { useBoolean, UseBooleanActions } from 'react-hanger/array'

import { CameraImageSource } from '../../../../appConstants'

import { Props } from '.'

type Values = {
  canvasRef?: RefObject<HTMLCanvasElement>
  isCameraAllowed: boolean
  isModalOpen: boolean
  isSnapshotted: boolean
  isSwitchable: boolean
  videoRef?: RefObject<HTMLVideoElement>
}

type Actions = {
  isModalOpenActions: UseBooleanActions
  isSnapshottedActions: UseBooleanActions
  capture: () => void
  startCapturing: () => void
  stopCapturing: () => void
  switchCameraSource: () => void
  useSnapshot: () => void
}

const SNAPSHOT_NAME = 'Snapshot'
const SNAPSHOT_EXTENSTION = '.jpeg'

const getConstrains = (source: CameraImageSource) => ({
  video: {
    width: {
      min: 640,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 360,
      ideal: 1080,
      max: 1440,
    },
    facingMode:
      source === CameraImageSource.Front
        ? 'user'
        : {
            exact: 'environment',
          },
  },
})

export default function useCameraControl({
  addSnapshot,
  defaultSource,
  filenames,
}: Pick<Props, 'addSnapshot' | 'defaultSource' | 'filenames'>): [Values, Actions] {
  const [isModalOpen, isModalOpenActions] = useBoolean(false)
  const [isCameraAllowed, isCameraAllowedActions] = useBoolean(false)
  const [isSnapshotted, isSnapshottedActions] = useBoolean(false)
  const [isSwitchable, isSwitchableActions] = useBoolean(false)
  const [videoSource, setVideoSource] = useState<CameraImageSource>(defaultSource)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream>()

  useEffect(() => {
    const initVideoDevices = async () => {
      const devices = navigator?.mediaDevices?.enumerateDevices
        ? await navigator.mediaDevices.enumerateDevices()
        : []
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      const count = videoDevices.length
      const hasOneCamera = count === 1

      isSwitchableActions.setValue(!hasOneCamera)

      // If user has only one camera we force to use it otherwise we use source from props
      if (hasOneCamera) {
        setVideoSource(CameraImageSource.Front)
      }
    }

    initVideoDevices()
  }, [defaultSource, isSwitchableActions])

  const startCapturing = useCallback(async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia(
        getConstrains(videoSource),
      )

      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current
        videoRef.current.onloadedmetadata = isCameraAllowedActions.setTrue
      }
    } catch (error) {
      console.error(error)
      isCameraAllowedActions.setFalse()
    }
  }, [isCameraAllowedActions, videoSource])

  useEffect(() => {
    if (isModalOpen) {
      startCapturing()
    }
  }, [isModalOpen, startCapturing])

  const switchCameraSource = useCallback(() => {
    if (isSwitchable) {
      const source =
        CameraImageSource.Front === videoSource
          ? CameraImageSource.Rear
          : CameraImageSource.Front

      setVideoSource(source)
    }
  }, [isSwitchable, videoSource])

  const stopCapturing = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => track.stop())
    }

    isSnapshottedActions.setFalse()
  }, [isSnapshottedActions])

  const capture = useCallback(() => {
    if (canvasRef.current && videoRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight

      const context = canvasRef.current.getContext('2d')

      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        )

        isSnapshottedActions.setTrue()
      }
    }
  }, [isSnapshottedActions])

  const useSnapshot = useCallback(() => {
    const newIndex = filenames.reduce((index, filename) => {
      const [namePart, indexPart] = filename.replace(SNAPSHOT_EXTENSTION, '').split('-')
      const nextIndex = Number(indexPart) + 1

      return namePart === SNAPSHOT_NAME && nextIndex > index ? nextIndex : index
    }, 1)

    if (canvasRef.current) {
      addSnapshot(
        `${SNAPSHOT_NAME}-${newIndex}${SNAPSHOT_EXTENSTION}`,
        canvasRef.current.toDataURL('image/jpeg'),
      )
    }

    isModalOpenActions.setFalse()
  }, [addSnapshot, isModalOpenActions, filenames])

  return useMemo(
    () => [
      {
        canvasRef,
        isCameraAllowed,
        isModalOpen,
        isSnapshotted,
        isSwitchable,
        videoRef,
      },
      {
        capture,
        isModalOpenActions,
        isSnapshottedActions,
        startCapturing,
        stopCapturing,
        switchCameraSource,
        useSnapshot,
      },
    ],
    [
      capture,
      isCameraAllowed,
      isModalOpen,
      isModalOpenActions,
      isSnapshotted,
      isSnapshottedActions,
      isSwitchable,
      startCapturing,
      stopCapturing,
      switchCameraSource,
      useSnapshot,
    ],
  )
}

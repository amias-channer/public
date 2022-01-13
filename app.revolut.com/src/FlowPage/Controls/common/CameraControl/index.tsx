import React, { FC } from 'react'
import { Box, Flex, H4, Modal } from '@revolut/ui-kit'

import { CameraImageSource } from '../../../../appConstants'

import useCameraControl from './useCameraControl'
import RetakeButton from './RetakeButton'
import TakePictureButton from './TakePictureButton'
import UsePictureButton from './UsePictureButton'
import OpenCameraButton from './OpenCameraButton'
import CloseModalButton from './CloseModalButton'
import SwitchCameraButton from './SwitchCameraButton'
import { VideoStyled, CanvasWrapperStyled, CanvasStyled } from './styled'

export const CAMERA_CONTROL = 'camera-control'

export type Props = {
  addSnapshot: (filename: string, data: string) => void
  defaultSource: CameraImageSource
  filenames: string[]
  buttonTitle: string
  takePhotoHint: string
  confirmPhotoHint: string
  retakePhotoHint: string
  switchCameraHint: string
}

const CameraControl: FC<Props> = ({
  defaultSource = CameraImageSource.Front,
  addSnapshot,
  filenames,
  buttonTitle,
  takePhotoHint,
  confirmPhotoHint,
  retakePhotoHint,
  switchCameraHint,
}) => {
  const [
    { isModalOpen, isCameraAllowed, isSnapshotted, videoRef, canvasRef, isSwitchable },
    {
      isModalOpenActions,
      isSnapshottedActions,
      stopCapturing,
      capture,
      useSnapshot,
      switchCameraSource,
    },
  ] = useCameraControl({ addSnapshot, defaultSource, filenames })

  return (
    <Box data-testid={CAMERA_CONTROL}>
      <OpenCameraButton onClick={isModalOpenActions.setTrue} buttonTitle={buttonTitle} />
      <Modal isOpen={isModalOpen} bg="black" onExited={stopCapturing} zIndex={1000}>
        <Flex height="100%" flexDirection="column">
          <CloseModalButton onClick={isModalOpenActions.setFalse} />
          {!isCameraAllowed && (
            <H4 m="auto" p="s-16" color="grey-50" textAlign="center">
              Please allow access to your camera
            </H4>
          )}
          <VideoStyled
            autoPlay
            ref={videoRef}
            isCameraAllowed={isCameraAllowed}
            isSnapshotted={isSnapshotted}
          >
            <track kind="captions" />
          </VideoStyled>
          <CanvasWrapperStyled isSnapshotted={isSnapshotted}>
            <CanvasStyled ref={canvasRef} />
          </CanvasWrapperStyled>
          <Flex justifyContent="center">
            {isSnapshotted ? (
              <>
                <UsePictureButton onClick={useSnapshot} buttonTitle={confirmPhotoHint} />
                <RetakeButton
                  onClick={isSnapshottedActions.setFalse}
                  buttonTitle={retakePhotoHint}
                />
              </>
            ) : (
              <>
                {isSwitchable && (
                  <SwitchCameraButton
                    onClick={switchCameraSource}
                    disabled={!isCameraAllowed}
                    buttonTitle={switchCameraHint}
                  />
                )}
                <TakePictureButton
                  onClick={capture}
                  disabled={!isCameraAllowed}
                  buttonTitle={takePhotoHint}
                />
              </>
            )}
          </Flex>
        </Flex>
      </Modal>
    </Box>
  )
}

export default CameraControl

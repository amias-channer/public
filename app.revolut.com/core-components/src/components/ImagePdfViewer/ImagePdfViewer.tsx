import { isEmpty, findIndex } from 'lodash'
import {
  FC,
  useCallback,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  useState,
} from 'react'
import Viewer from 'react-viewer'
import { Cross, Link } from '@revolut/icons'
import { Flex, Button, Portal } from '@revolut/ui-kit'

import { checkRequired, KeyboardKey, openUrlInNewTab } from '@revolut/rwa-core-utils'

import { ImagePdfViewerTestId } from './constants'
import { Container, PdfView, ViewerWrapper } from './styled'
import { ImagePdfViewerDoc } from './types'

export type Props = {
  images: ImagePdfViewerDoc[]
  currentImage: ImagePdfViewerDoc
  openPdfInNewTab?: boolean
  onClose: Dispatch<SetStateAction<ImagePdfViewerDoc | null>>
}

export const ImagePdfViewer: FC<Props> = ({
  images = [],
  currentImage: image,
  openPdfInNewTab = false,
  onClose,
}) => {
  const [currentImageIndex, setCurretImageIndex] = useState(0)
  const [activeDoc, setActiveDoc] = useState<ImagePdfViewerDoc>()

  const containerRef = useRef<HTMLDivElement>(null)

  const isCurrentPdf = activeDoc && activeDoc.isPdf
  const isVisible = !isEmpty(image)

  const closeViewer = useCallback(() => {
    onClose(null)
  }, [onClose])

  useEffect(() => {
    setCurretImageIndex(findIndex(images, ({ id }) => id === image?.id))
  }, [image, images])

  useEffect(() => {
    setActiveDoc(images[currentImageIndex])

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KeyboardKey.Esc) {
        event.stopPropagation()
        closeViewer()
      }
    }

    if (isVisible) {
      document.addEventListener('keyup', handleKeyDown)
    }

    return () => document.removeEventListener('keyup', handleKeyDown)
  }, [currentImageIndex, closeViewer, images, isVisible])

  return (
    <Portal>
      <Container
        flexDirection="column"
        isVisible={isVisible}
        data-testid={ImagePdfViewerTestId.ImagePdfViewer}
      >
        <Flex alignItems="center" justifyContent="flex-end" height={48} bg="black">
          {isCurrentPdf && openPdfInNewTab && (
            <Button
              mr="s-16"
              data-testid={ImagePdfViewerTestId.OpenInNewTab}
              onClick={() => openUrlInNewTab(checkRequired(activeDoc?.pdfSrc))}
              useIcon={Link}
              variant="text"
            />
          )}
          <Button
            mr="s-16"
            data-testid="closeIcon"
            variant="text"
            onClick={closeViewer}
            useIcon={Cross}
          />
        </Flex>
        <ViewerWrapper ref={containerRef}>
          <Viewer
            visible={isVisible}
            images={images}
            activeIndex={currentImageIndex}
            container={containerRef.current ?? undefined}
            onChange={(currentDoc) => setActiveDoc(currentDoc as ImagePdfViewerDoc)}
            noClose
          />
        </ViewerWrapper>
        {isCurrentPdf && (
          <PdfView
            data-testid="pdfView"
            data={`${checkRequired(activeDoc?.pdfSrc)}#view=FitH`}
            type="application/pdf"
          />
        )}
      </Container>
    </Portal>
  )
}

import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useArray } from 'react-hanger/array'
import { v4 as uuidV4 } from 'uuid'
import { isEqual } from 'lodash'

import { UploadState } from '../../../appConstants'
import { dataURLtoFile } from '../../helpers'

import {
  ImagePreviewCacheContext,
  NavigationObstacleContext,
  Obstacle,
  useApi,
  useFlowId,
} from '../../../providers'
import { FileItem, FilesValue } from '../../../types'
import { OpenUploadFailedPopupProps } from './UploadFailedPopup/useUploadFailedPopup'

type UploadResult = { uploadId: string; fileItem: FileItem }

type State = {
  files: FileItem[]
}

type Actions = {
  uploadFiles: (fileList: FileList) => void
  addSnapshot: (filename: any, data: any) => void
  deleteFile: (index: number) => void
  suggestRetryUploadFile: (index: number) => void
}

export function useFileUpload(
  initialFiles: FilesValue['files'] | undefined,
  changeValue: (payload: FilesValue) => void,
  setDataFetching: (fetching: boolean) => void,
  openUploadFailedPopup: (props: OpenUploadFailedPopupProps) => void,
): [State, Actions] {
  const api = useApi()
  const flowId = useFlowId()
  const { setNavigationObstacle } = useContext(NavigationObstacleContext)
  const { deleteImage } = useContext(ImagePreviewCacheContext)
  const [files, filesActions] = useArray(initialFiles || [])
  const [uploadResult, setUploadedResult] = useState<UploadResult>()

  const uploadFile = useCallback(
    async (fileItem: FileItem) => {
      const result = { uploadId: fileItem.id, fileItem: { ...fileItem } }
      try {
        if (!fileItem.source) return
        const fetchedFile = await api.uploadFile(fileItem.source, flowId)
        delete result.fileItem.uploadState
        result.fileItem.id = fetchedFile.id
      } catch {
        result.fileItem.uploadState = UploadState.UploadFailed
      }
      setUploadedResult(result)
    },
    [api, flowId],
  )

  useEffect(() => {
    if (!uploadResult) return

    const { uploadId, fileItem } = uploadResult
    setDataFetching(false)

    filesActions.modifyById(uploadId, {
      id: fileItem.id,
      uploadState: fileItem.uploadState,
    })
  }, [filesActions, setDataFetching, uploadResult])

  const retryUploadFile = useCallback(
    (index: number) => {
      const file = files[index]
      filesActions.modifyById(file.id, { uploadState: UploadState.Uploading })
      uploadFile(file)
      setDataFetching(true)
    },
    [files, filesActions, setDataFetching, uploadFile],
  )

  const retryAllFailedUploads = useCallback(() => {
    files
      .filter(file => file.uploadState === UploadState.UploadFailed)
      .forEach(file => {
        retryUploadFile(files.indexOf(file))
      })
  }, [files, retryUploadFile])

  const createObstacle = useCallback<() => Obstacle>(
    () => callback =>
      openUploadFailedPopup({
        isMultiUpload: true,
        onRetry: retryAllFailedUploads,
        onDelete: callback,
      }),
    [openUploadFailedPopup, retryAllFailedUploads],
  )

  useEffect(() => {
    const hasFailedUploads = Boolean(
      files.find(file => file.uploadState === UploadState.UploadFailed),
    )
    setNavigationObstacle(() => (hasFailedUploads ? createObstacle() : undefined))
  }, [files, createObstacle, setNavigationObstacle])

  useEffect(() => {
    const uploadedFiles = files.filter(file => !file.uploadState)
    if (!isEqual(uploadedFiles, initialFiles)) {
      changeValue({ files: uploadedFiles })
    }
  }, [changeValue, files, initialFiles])

  const initFileUpload = useCallback(
    (file: File) => {
      const fileItem: FileItem = {
        id: uuidV4(),
        name: file.name,
        uploadState: UploadState.Uploading,
        source: file,
      }
      filesActions.push(fileItem)
      uploadFile(fileItem)
      setDataFetching(true)
    },
    [filesActions, setDataFetching, uploadFile],
  )

  const uploadFiles = useCallback(
    (fileList: FileList) => {
      for (const file of fileList) {
        initFileUpload(file)
      }
    },
    [initFileUpload],
  )

  const addSnapshot = useCallback(
    (filename, data) => {
      const file = dataURLtoFile(data, filename)
      initFileUpload(file)
    },
    [initFileUpload],
  )

  const deleteFile = useCallback(
    (index: number) => {
      const filenameToDelete = files[index].name
      if (files.filter(file => file.name === filenameToDelete).length <= 1) {
        deleteImage(files[index].name)
      }
      filesActions.removeIndex(index)
    },
    [deleteImage, files, filesActions],
  )

  const suggestRetryUploadFile = useCallback(
    (index: number) => {
      openUploadFailedPopup({
        onRetry: () => retryUploadFile(index),
        onDelete: () => deleteFile(index),
      })
    },
    [deleteFile, openUploadFailedPopup, retryUploadFile],
  )

  return useMemo(
    () => [{ files }, { uploadFiles, addSnapshot, deleteFile, suggestRetryUploadFile }],
    [addSnapshot, deleteFile, files, suggestRetryUploadFile, uploadFiles],
  )
}

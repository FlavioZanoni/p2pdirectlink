import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import FileSelect from "../FileSelect/FileSelect"
import { DropFilesTypes } from "./types"

export const DropFile = ({ files, setFiles }: DropFilesTypes) => {
  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      acceptedFiles.map((file) => {
        setFiles([...files, file])
      })
    },
    [files, setFiles]
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  return (
    <div
      {...getRootProps()}
      className="flex flex-col bg-[#333333] rounded-lg w-[56rem] p-5 md:min-h-[10rem] justify-center items-center text-white"
    >
      <input {...getInputProps()} />
      <p className="m-2 p-2 bg-[#525252] rounded-md">
        Drop / select files to be sent
      </p>
      <div>
        {files.length !== 0 ? <p>File list:</p> : null}
        <FileSelect files={files} setFiles={setFiles} />
      </div>
    </div>
  )
}

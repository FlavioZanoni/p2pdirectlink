import React from "react"

export type DropFilesTypes = {
  files: Array<File>
  setFiles: React.Dispatch<React.SetStateAction<Array<File>>>
}

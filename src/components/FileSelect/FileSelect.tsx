import React, { useEffect, useState } from "react"
import { convertToDataUrl } from "../../lib/converters"

export default function FileSelect(props: any) {
  // set loading img first
  const [src, setSrc] = useState<Array<string>>(["/mugi.png"])

  useEffect(() => {
    if (props.files.length !== 0) {
      const newIndex = props.files.length - 1

      const updateSrc = async () => {
        if (/(image)/.test(props.files[newIndex].type)) {
          setSrc([...src, await convertToDataUrl(props.files[newIndex])])
        } else if (/(pdf)/.test(props.files[newIndex].type)) {
          setSrc([...src, "/fileType/pdf.png"])
        } else if (/(doc)|(docx)/.test(props.files[newIndex].type)) {
          setSrc([...src, "/fileType/doc.png"])
        } else if (/(rar)|(zip)/.test(props.files[newIndex].type)) {
          setSrc([...src, "/fileType/zip.png"])
        } else if (/(mp3)/.test(props.files[newIndex].type)) {
          setSrc([...src, "/fileType/mp3.png"])
        } else {
          setSrc([...src, "/fileType/file.png"])
        }
      }
      updateSrc()
    }
  }, [props.files])

  async function handleDeleteFile(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) {
    e.stopPropagation() // stop the component from opening dialog for new file
    src.splice(index + 1, 1) // removes the element from the src array
    setSrc([...src]) // updates the src element
    props.files.splice(index, 1) // remove it from the file array
  }

  return (
    <div className="flex flex-row overflow-x-auto max-w-3xl">
      {props.files.map((file: File, index: number) => {
        return (
          <div
            className="flex justify-end relative h-[200px] w-[170px] m-2"
            key={index}
          >
            <div className="flex items-center absolute justify-center  w-11 drop-shadow-xl bg-[#3f3f3f] text-red-500 rounded-sm">
              <div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteFile(e, index)}
                  className=" p-1 "
                >
                  <img src="/bin.svg" height={18} width={18} alt="" />
                </button>
              </div>
            </div>
            <div
              key={index}
              className="flex flex-col  items-center justify-center bg-[#525252] rounded-md p-2 m-1 "
            >
              <img
                className="max-w-[150px] max-h-[150px]"
                src={src[index + 1]}
                alt="uploaded file"
              />
              <p className="max-w-[9rem] truncate ...">{file.name}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

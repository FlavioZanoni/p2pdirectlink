
import { useEffect, useState } from "react"
import convertToDataUrl from "../lib/convertDataUrl"

export default function FileSelect(props) {
    // set loading img first
    const [src, setSrc] = useState(['/mugi.png'])
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        console.log(props.files)

        if (props.files.length !== 0) {
            let newIndex = props.files.length - 1

            const updateSrc = async () => {
                console.log('to fazendo updare fds')

                let regImage = /(image)/.test(props.files[newIndex].type)
                if (regImage) {
                    setSrc([...src, await convertToDataUrl(props.files[newIndex])])
                    setDeleting(false)
                }
            }
            updateSrc()
        }
    }, [props.files, deleting])

    async function handleDeleteFile(e, index) {
        setDeleting(true)
        e.stopPropagation() // stop the component from opening dialog for new file
        src.splice(index + 1, 1)
        props.files.splice(index, 1)
    }

    return (
        <div className='flex flex-row'>
            {
                props.files.map((file, index) => {
                    return (
                        <div key={index} className='m-1' >
                            <button type='button' onClick={(e) => handleDeleteFile(e, index)} className='bg-red-500 rounded-full p-1 m-1'> X </button>
                            <img width={150} height={150} src={src[index + 1]} alt="uploaded file" />
                            <p>{file.name}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}


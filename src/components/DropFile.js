import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import FileSelect from './FileSelect'

export default function DropFile() {

    const [files, setFiles] = useState([])

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            setFiles([...files, file])
        }, [])
    })

    const { getRootProps, getInputProps } = useDropzone({ onDrop })
    return (
        <div {...getRootProps()} className='bg-slate-500 p-5'>
            <input {...getInputProps()} />
            <p>Select or drag the files you want to send</p>
            <div >
                <p>File list:</p>
                <FileSelect files={files} setFiles={setFiles} />
            </div>
        </div>
    )
}


const Btn = ({ content, func }) => {
    return (
        <button className="p-4 w-96 bg-[#00FF65] rounded-lg first-line:font-semibold" onClick={func} >{content} </button>
    )
}

const WaitBtn = ({ content }) => {
    return (
        <button className="p-4 w-96 bg-[#667166] border-4 border-[#7eeeab] rounded-lg pointer-events-none font-medium" >{content} </button>
    )
}
export { Btn, WaitBtn }
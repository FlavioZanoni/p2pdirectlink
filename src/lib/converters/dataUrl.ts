export const convertToDataUrl = (file: Blob): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onabort = reject
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

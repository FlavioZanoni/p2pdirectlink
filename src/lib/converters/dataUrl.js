export const convertToDataUrl = (file) => {

	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onend = reject
		reader.onabort = reject
		reader.onload = () => resolve(reader.result)
		reader.readAsDataURL(file)
	})
}

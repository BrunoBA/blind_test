export function formatOptionText(text, SIZE) {
    if (text.length > SIZE) {
        return `${text.substring(0, SIZE)}...`
    }
    return text
}
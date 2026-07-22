import { useState, useEffect, useRef } from 'react'

/**
 * useTypewriter — cycles through an array of phrases with typing + deleting effect.
 * Returns { displayed, isDeleting, wordIndex }
 */
export function useTypewriter(
    words,
    {
        typingSpeed = 72,
        deletingSpeed = 38,
        pauseAfterWord = 2000,
        pauseAfterDelete = 320,
    } = {}
) {
    const [displayed, setDisplayed] = useState(words[0] ? words[0][0] : '')
    const [wordIndex, setWordIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const pauseRef = useRef(false)

    useEffect(() => {
        const word = words[wordIndex]

        if (pauseRef.current) return

        const speed = isDeleting ? deletingSpeed : typingSpeed

        const id = setTimeout(() => {
            if (!isDeleting) {
                if (displayed.length < word.length) {
                    setDisplayed(word.slice(0, displayed.length + 1))
                } else {
                    // full word shown — pause then start deleting
                    pauseRef.current = true
                    setTimeout(() => {
                        pauseRef.current = false
                        setIsDeleting(true)
                    }, pauseAfterWord)
                }
            } else {
                if (displayed.length > 0) {
                    setDisplayed(word.slice(0, displayed.length - 1))
                } else {
                    // fully deleted — pause then next word
                    pauseRef.current = true
                    setTimeout(() => {
                        pauseRef.current = false
                        setIsDeleting(false)
                        setWordIndex(i => (i + 1) % words.length)
                    }, pauseAfterDelete)
                }
            }
        }, speed)

        return () => clearTimeout(id)
    }, [displayed, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseAfterWord, pauseAfterDelete])

    return { displayed, isDeleting, wordIndex }
}

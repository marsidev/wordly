import { defaultUrl as url } from 'next-seo.config'
// ref: https://github.com/roedoejet/AnyLanguage-Wordle/blob/main/src/lib/share.ts
// ref: https://github.com/cwackerfuss/react-wordle/blob/main/src/lib/share.ts
export const parseGuesses = wordsData => {
  const guesses = []
  const evals = []

  wordsData.forEach(wordObj => {
    const guess = wordObj.map(l => l.letter).join('')
    const _eval = wordObj.map(l => l.status)
    guesses.push(guess)
    evals.push(_eval)
  })

  return { guesses, evals }
}

export const generateTextToShare = ({ title, wordList }) => {
  const emojis = generateEmojiGrid(wordList)

  const textToShare = title ? (title + '\n\n' + emojis + '\n' + url) : ''
  return textToShare
}

export const generateEmojiGrid = wordList => {
  const { evals: guesses } = parseGuesses(wordList)

  let emojis = ''
  guesses.forEach(guess => {
    if (guess[0] === 'empty') return emojis

    guess.forEach(status => {
      let emoji = ''
      if (status === 'guessed') emoji = '🟩'
      if (status === 'exists') emoji = '🟨'
      if (status === 'not_exists') emoji = '⬜'
      if (emoji) emojis += emoji
    })
    emojis += '\n'
  })

  return emojis
}

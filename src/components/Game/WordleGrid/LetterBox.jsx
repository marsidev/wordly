import { memo } from 'react'
import { Flex, chakra, useColorModeValue } from '@chakra-ui/react'
import useStore from '@lib/store'
import { GAME_CONFIG } from '@lib/constants'

const checkCursor = ({ wordInput, inputIndex, rowIndex, colIndex, isSubmitted, lastKey }) => {
  if (isSubmitted) return false
  if (inputIndex !== rowIndex) return false
  if (lastKey === '') return false

  let isCurrentInput = false
  const submittedWord = [...wordInput]
  const emptyLetterIndex = submittedWord.findIndex(l => l.letter === '')

  if (emptyLetterIndex !== -1) {
    isCurrentInput = colIndex === emptyLetterIndex - 1
    return isCurrentInput
  }

  // check if is the last letter of the word
  isCurrentInput = colIndex === submittedWord.length - 1

  return isCurrentInput
}

const resolveBorderColor = ({ isSubmitted, status }) => {
  const isEmpty = status === 'empty'
  let borderColor = 'none'
  if (!isSubmitted && isEmpty) borderColor = useColorModeValue('blackAlpha.300', 'blackAlpha.400')
  if (!isSubmitted && !isEmpty) borderColor = useColorModeValue('blackAlpha.500', 'blackAlpha.600')

  return borderColor
}

const resolveBackgroundColor = ({ isSubmitted, status }) => {
  const COLORS = {
    default: useColorModeValue('gray.100', 'gray.200'),
    guessed: useColorModeValue('green.300', 'green.400'),
    exists: useColorModeValue('orange.300', 'orange.400'),
    failed: useColorModeValue('gray.400', 'gray.500')
  }

  let bg
  if (!isSubmitted) bg = COLORS.default
  else if (status === 'guessed') bg = COLORS.guessed
  else if (status === 'exists') bg = COLORS.exists
  else if (status === 'not_exists') bg = COLORS.failed

  return bg
}

const resolveClassAndAnimation = props => {
  const { isSubmitted, status, isCurrentCursor, colIndex, rowIndex, isInvalid, wordleGuessed, inputIndex } = props
  const { revealAnimationTime, typeAnimationTime, shakeAnimationTime, bounceAnimationTime } = GAME_CONFIG

  const res = {
    className: null,
    boxAnimation: {
      duration: null,
      delay: null
    },
    letterAnimation: {
      duration: null,
      delay: null
    }
  }

  if (isInvalid) {
    res.className = 'is-invalid'
    res.boxAnimation.duration = `${shakeAnimationTime}ms`
    res.letterAnimation.duration = res.boxAnimation.duration
  } else if (isCurrentCursor) {
    res.className = 'cell-type-animation'
    res.boxAnimation.duration = `${typeAnimationTime}ms`
    res.letterAnimation.duration = res.boxAnimation.duration
  } else if (isSubmitted && wordleGuessed && (inputIndex - 1) === rowIndex) {
    res.className = 'puzzle_solved'
    const revealDelay = `${colIndex * revealAnimationTime}ms`

    let bounceDelay = 5 * revealAnimationTime // 4 letras con revealDelay + 1 delay extra
    bounceDelay += colIndex * (bounceAnimationTime * 0.35)
    bounceDelay = `${bounceDelay}ms`

    // box animation
    res.boxAnimation.delay = `${revealDelay}, ${bounceDelay}`
    res.boxAnimation.duration = `${revealAnimationTime}ms, ${bounceAnimationTime}ms`

    // letter animation
    res.letterAnimation.duration = `${revealAnimationTime}ms`
    res.letterAnimation.delay = revealDelay
  } else if (isSubmitted) {
    res.className = `cell-reveal-animation ${status}`
    res.boxAnimation.duration = `${revealAnimationTime}ms`
    res.boxAnimation.delay = `${colIndex * revealAnimationTime}ms`

    res.letterAnimation.duration = res.boxAnimation.duration
    res.letterAnimation.delay = res.boxAnimation.delay
  }

  return res
}

// isSubmitted is a boolean that indicates whether the entire row-word has been submitted or not
const LetterBox = ({ letterData, isSubmitted, rowIndex, colIndex, isInvalid }) => {
  const { wordInput, inputIndex, lastKey, wordleGuessed } = useStore()
  const { letter, status } = letterData

  const boxSize = [14, 14, 16, 16, 16]
  const border = isSubmitted ? 'none' : '2px solid'
  const fontColor = isSubmitted ? 'white' : 'black'

  const isCurrentCursor = checkCursor({ wordInput, inputIndex, rowIndex, colIndex, isSubmitted, lastKey })
  const borderColor = resolveBorderColor({ isSubmitted, status })
  const bg = resolveBackgroundColor({ isSubmitted, status })
  const { className, boxAnimation, letterAnimation } = resolveClassAndAnimation({
    isSubmitted,
    status,
    isCurrentCursor,
    colIndex,
    isInvalid,
    wordleGuessed,
    inputIndex,
    rowIndex
  })

  return (
    <Flex
      align='center'
      bg={bg}
      border={border}
      borderColor={borderColor}
      borderRadius={4}
      className={className}
      color={fontColor}
      fontSize={36}
      fontWeight='bold'
      h={boxSize}
      justify='center'
      style={{
        animationDelay: boxAnimation.delay,
        animationDuration: boxAnimation.duration
      }}
      textTransform='uppercase'
      w={boxSize}
    >
      {letter && (
        <chakra.span
          className={isSubmitted ? 'letter-container' : null}
          style={{
            animationDelay: letterAnimation.delay,
            animationDuration: letterAnimation.duration
          }}
        >
          {letter}
        </chakra.span>
      )}
    </Flex>
  )
}

export default memo(LetterBox)

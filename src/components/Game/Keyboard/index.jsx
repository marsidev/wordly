import { Flex } from '@chakra-ui/react'
import KeyboardLetter from '@components/Game/Keyboard/KeyboardLetter'
import { keyboardKeys } from '@lib/constants'

const Keyboard = ({ keyHandler, options, ...rest }) => {
  const { swapKeys } = options
  return (
    <Flex
      align='center'
      as='footer'
      bottom={0}
      justify='center'
      pos='fixed'
      w='100%'
      {...rest}
    >
      <Flex flexDir='column' gap='0.25rem' maxW='600px' w='95%'>
        {keyboardKeys.map((row, i) => (
          <Flex
            key={i}
            flexDir='row'
            justify='stretch'
            // gap={['0.15rem', '0.50rem']}
          >
            {row.map((letter, keyIndex) => {
              const { key, special } = letter

              if (special) {
                if (swapKeys) {
                  if (keyIndex === 0 && key === 'enter') {
                    letter.key = 'backspace'
                  } else if (keyIndex === row.length - 1 && key === 'backspace') {
                    letter.key = 'enter'
                  }
                } else if (keyIndex === 0 && key === 'backspace') {
                  letter.key = 'enter'
                } else if (keyIndex === row.length - 1 && key === 'enter') {
                  letter.key = 'backspace'
                }
              }

              return (
                <KeyboardLetter
                  key={letter.key}
                  keyHandler={() => keyHandler(letter.key)}
                  letter={letter}
                />
              )
            })}
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

export default Keyboard

import nc from 'next-connect'
import { onError, onNoMatch } from '@lib/middlewares/nc'
import withDev from '@lib/middlewares/withDev'
import { checkLang, checkLetters } from '@lib/middlewares/checkParams'
import { filterDictionary, getDictionary, shuffleDictionary } from '@lib/dictionary'

const handler = nc({ onError, onNoMatch })
  .use(withDev)
  .use(checkLetters)
  .use(checkLang)
  .post(async (req, res) => {
    let { letters = 5, lang = 'es' } = req.query
    letters = parseInt(letters)

    const source = getDictionary(lang)
    const dictionary = filterDictionary(source, letters)
    const shuffled = shuffleDictionary(lang, dictionary)

    return res.status(200).json({
      success: true,
      data: shuffled
    })
  })

export default handler

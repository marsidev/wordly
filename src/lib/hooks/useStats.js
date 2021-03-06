import { useState, useEffect } from 'react'
import { saveStats, loadStats } from '@lib/localStorage'
import useStore from '@lib/store'

const defaultGuessDistribution = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  fail: 0
}

const useStats = () => {
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [gamesWon, setGamesWon] = useState(0)
  const [gamesLost, setGamesLost] = useState(0)
  const [winRate, setWinRate] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [guessDistribution, setGuessDistribution] = useState(defaultGuessDistribution)
  const { gameState } = useStore()

  const playerStats = loadStats()

  useEffect(() => {
    if (playerStats) {
      const currentStreak = playerStats?.currentStreak
      if (currentStreak) setCurrentStreak(currentStreak)

      const gamesPlayed = playerStats?.gamesPlayed
      if (gamesPlayed) setGamesPlayed(gamesPlayed)

      const gamesWon = playerStats?.gamesWon
      if (gamesWon) setGamesWon(gamesWon)

      const gamesLost = playerStats?.gamesLost
      if (gamesLost) setGamesLost(gamesLost)

      const maxStreak = playerStats?.maxStreak
      if (maxStreak) setMaxStreak(maxStreak)

      const guessDistribution = playerStats?.guessDistribution
      if (guessDistribution) setGuessDistribution(guessDistribution)

      if (gamesPlayed > 0 && gamesWon > 0) {
        const winRate = gamesWon / gamesPlayed
        setWinRate(winRate)
      }
    }
  }, [])

  useEffect(() => {
    saveData()
  }, [gamesPlayed, gameState])

  const increaseDistributionById = id => {
    let newDistribution = guessDistribution
    const prevValue = guessDistribution[id.toString()]
    if (prevValue >= 0) {
      newDistribution = { ...guessDistribution, [id]: prevValue + 1 }
      setGuessDistribution(newDistribution)
    }

    return newDistribution
  }

  function saveData() {
    const stats = {
      gamesPlayed,
      gamesWon,
      gamesLost,
      currentStreak,
      maxStreak,
      guessDistribution,
      winRate
    }

    saveStats({ ...playerStats, ...stats })
  }

  const addWin = tries => {
    const newGames = gamesPlayed + 1
    const newWins = gamesWon + 1
    const winRate = newWins / newGames
    const newCurrentStreak = currentStreak + 1
    let newMaxStreak = maxStreak
    const newDistribution = increaseDistributionById(tries)

    setGamesPlayed(newGames)
    setGamesWon(newWins)
    setWinRate(winRate)
    setCurrentStreak(newCurrentStreak)
    setGuessDistribution(newDistribution)

    // maxStreak
    if (newCurrentStreak > maxStreak) {
      newMaxStreak = newCurrentStreak
      setMaxStreak(newMaxStreak)
    }

    // saveData()
  }

  const addLoss = () => {
    const newGames = gamesPlayed + 1
    const newLoss = gamesLost + 1
    const winRate = gamesWon / newGames
    const newCurrentStreak = 0
    const newDistribution = increaseDistributionById('fail')

    setGamesPlayed(newGames)
    setGamesLost(newLoss)
    setWinRate(winRate)
    setCurrentStreak(newCurrentStreak)
    setGuessDistribution(newDistribution)

    // saveData()
  }

  return {
    gamesPlayed,
    gamesWon,
    gamesLost,
    winRate,
    currentStreak,
    maxStreak,
    guessDistribution,
    addWin,
    addLoss
  }
}

export default useStats

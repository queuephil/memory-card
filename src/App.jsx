/* eslint react/prop-types: 0 */

import { useEffect, useState } from 'react'
import './App.css'

const apiKey = '47690714-377cefff98bd79d740924ef64'
const searchTerm = 'user%3a%20sierratds%20simpsons'
const request = `https://pixabay.com/api/?key=${apiKey}&q=${searchTerm}`

const getImgUrls = async () => {
  const response = await fetch(request, { mode: 'cors' })
  const data = await response.json()
  const urls = []
  await data.hits.map((el) => urls.push(el.webformatURL))
  return urls
}

const Card = ({ src, id, onClickFn, onLoadFn }) => {
  return (
    <div className="card">
      <img
        src={src}
        alt="Image from Pixabay"
        id={id}
        onClick={onClickFn}
        onLoad={onLoadFn}
      />
    </div>
  )
}

const shuffle = (array) => array.sort(() => Math.random() - 0.5)

export default function App() {
  // manage the necessary states
  const [allCards, setAllCards] = useState([])
  const [activeCards, setActiveCards] = useState([])
  const [availableCards, setAvailableCards] = useState([])
  const [clickedCards, setClickedCards] = useState([])
  const [score, setScore] = useState(0)
  const [highscore, setHighscore] = useState(0)

  const [loading, setLoading] = useState(true)
  // const [rendering, setRendering] = useState(3)

  // initialize the game
  useEffect(() => {
    const initializeGame = async () => {
      setLoading(true)
      const urls = await getImgUrls()
      const allCards = []
      for (let i = 0; i < 12; i++) {
        allCards.push({ content: urls[i], key: crypto.randomUUID() })
        allCards.push({ content: urls[i], key: crypto.randomUUID() })
      }
      setAllCards(allCards)
      const shuffledCards = shuffle(allCards)
      setActiveCards(shuffledCards.slice(0, 9))
      setAvailableCards(shuffledCards.slice(9))
      setLoading(false)
    }
    initializeGame()
  }, [])

  // manage loading

  // useEffect(() => {
  //   if (rendering == activeCards.length && activeCards.length > 0) {
  //     setLoading(false)
  //   }
  // }, [rendering, activeCards])

  // const handleLoad = () => {
  //   setRendering((prev) => prev + 1)
  // }

  // manage the events
  const checkAlreadyClicked = (clickedCard) =>
    clickedCards.some((el) => el == clickedCard)

  const updateHighScore = () => score > highscore && setHighscore(score)

  const resetGame = () => {
    const shuffledCards = shuffle(allCards)
    setScore(0)
    setClickedCards([])
    setActiveCards(shuffledCards.slice(0, 9))
    setAvailableCards(shuffledCards.slice(9))
  }

  const changeCard = (keyClickedCard) => {
    const newActiveCards = activeCards.map((el) =>
      el.key == keyClickedCard ? availableCards[0] : el
    )
    setActiveCards(newActiveCards)
    availableCards.splice(0, 1)
  }

  const handleClick = (e) => (
    console.log(e.target.id),
    setScore(score + 1),
    setClickedCards([...clickedCards, e.target.src]),
    checkAlreadyClicked(e.target.src)
      ? (updateHighScore(), resetGame())
      : changeCard(e.target.id)
  )

  return (
    <div className="app">
      {loading ? (
        <span className="material-symbols-outlined loading">
          progress_activity
        </span>
      ) : (
        <>
          <div>score: {score}</div>
          <div>highscore: {highscore}</div>
          <div className="game">
            {activeCards.map(({ content, key }) => (
              <Card
                key={key}
                src={content}
                id={key}
                onClickFn={handleClick}
                // onLoadFn={handleLoad}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// pop up when doubleclick

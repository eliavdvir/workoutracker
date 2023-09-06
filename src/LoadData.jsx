import { useEffect, useRef, useContext, useState } from "react"
import { HistoryContext } from "./DataProvider"
import { json } from "react-router-dom"

function LoadData({ setLoadDataOpen, navigator }) {
  const { historyDispatch } = useContext(HistoryContext)
  const [isError, setIsError] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  function closeDiv() {
    setLoadDataOpen(false)
  }

  function sendData() {
    const data = inputRef.current.value
    console.log(data)
    try {
      const jsonData = JSON.parse(data)
      if (
        jsonData.hasOwnProperty("savedWorkouts") &&
        Array.isArray(jsonData.savedWorkouts) &&
        jsonData.hasOwnProperty("totalTags") &&
        Array.isArray(jsonData.totalTags) &&
        jsonData.hasOwnProperty("exercises") &&
        Array.isArray(jsonData.exercises) &&
        jsonData.hasOwnProperty("workoutHistory") &&
        Array.isArray(jsonData.workoutHistory)
      ) {
        historyDispatch({ type: "LOAD", payload: jsonData })
        navigator("/profile")
      } else {
        errorSetter()
      }
    } catch (error) {
      console.log(error)
      errorSetter()
    }
  }

  function errorSetter() {
    setIsError(true)
    setTimeout(() => {
      setIsError(false)
    }, 3000)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeDiv()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  return (
    <div className="exporter-input">
      {isError && (
        <div className="input-data-error text2">incorrect data format</div>
      )}
      <div ref={containerRef} className="exporter-input-container">
        <textarea
          ref={inputRef}
          type="text"
          className="exporter-input-text text2"
          placeholder="paste your workout data here to track your workouts and highscores"
        />
        <div className="exporter-input-cancel text2" onClick={closeDiv}>
          cancel
        </div>
        <div className="exporter-input-confirm text2" onClick={sendData}>
          confirm
        </div>
      </div>
    </div>
  )
}

export default LoadData

import { useEffect, useRef, useContext, useState } from "react"
import { DataContext } from "./DataProvider"
import { HistoryContext } from "./DataProvider"
import MatchingExercise from "./MatchingExercise"
import { useNavigate } from "react-router-dom"

function ExerciseInputs({ setExerciseInputsOpen, exercise, categoryId }) {
  const { dispatch } = useContext(DataContext)
  const { historyState } = useContext(HistoryContext)

  const [name, setName] = useState(exercise.exerciseName)
  const [matchingExercises, setMatchingExercises] = useState([])
  const [userConfirmed, setUserConfirmed] = useState(false)
  const nameRef = useRef(null)
  const detailsRef = useRef(null)
  const firstRender = useRef(true)
  const navigate = useNavigate()

  function closeDiv() {
    setExerciseInputsOpen(false)
  }

  function dispatchExerciseIdChange(actualExerciseInfo) {
    const updatedSets = exercise.sets.map((set) => {
      return {
        ...set,
        exerciseId: actualExerciseInfo.id,
      }
    })

    const updatedExercise = {
      ...exercise,
      sets: updatedSets,
      exerciseId: actualExerciseInfo.id,
      exerciseName: actualExerciseInfo.name,
    }
    dispatch({
      type: "UPDATE_EXERCISE",
      payload: {
        categoryId: categoryId,
        exerciseId: exercise.exerciseId,
        updatedExercise: updatedExercise,
      },
    })
    closeDiv()
    navigate(`/workout/${actualExerciseInfo.id}`)
  }

  function confirmChanges() {
    let theId = exercise.exerciseId

    const existsAndNameChanged = historyState.exercises.some(
      (historyExercise) => {
        return (
          historyExercise.id === exercise.exerciseId &&
          historyExercise.name !== name
        )
      }
    )

    if (existsAndNameChanged) {
      do {
        theId = (Math.floor(Math.random() * 100000) + 1).toString()
      } while (
        historyState.exercises.some((exercise) => exercise.exerciseId === theId)
      )
    }

    const updatedExercise = {
      ...exercise,
      exerciseName: name,
      exerciseDetails: detailsRef.current.value,
    }
    dispatch({
      type: "UPDATE_EXERCISE",
      payload: {
        categoryId: categoryId,
        exerciseId: theId,
        updatedExercise: updatedExercise,
      },
    })
    closeDiv()
  }

  useEffect(() => {
    if (exercise.exerciseName === "New Exercise") {
      nameRef.current.select()
    }
    nameRef.current.focus()
    detailsRef.current.value = exercise.exerciseDetails
  }, [])

  useEffect(() => {
    console.log(userConfirmed)
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (name.length < 3) {
      setUserConfirmed(false)
      setMatchingExercises([])
      return
    }

    const newTimeout = setTimeout(() => {
      let newMatchingExercises = []

      for (let historyExercise of historyState.exercises) {
        if (
          historyExercise.name
            .toLowerCase()
            .startsWith(name.toLowerCase().trim())
        ) {
          if (exercise.exerciseId === historyExercise.id) return
          newMatchingExercises.push(historyExercise)
        }
      }

      setMatchingExercises(newMatchingExercises)
    }, 1500)

    return () => {
      clearTimeout(newTimeout)
    }
  }, [name])

  return (
    <>
      {" "}
      <div className="exercise-input">
        {!userConfirmed && matchingExercises.length > 0 && (
          <MatchingExercise
            setUserConfirmed={setUserConfirmed}
            exercises={matchingExercises}
            dispatchExerciseIdChange={dispatchExerciseIdChange}
          />
        )}
        <div className="exercise-input-container">
          <div className="exercise-input-inputs-container">
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="exercise-input-name text2"
              placeholder="exercise name"
            />
            <input
              ref={detailsRef}
              type="text"
              className="exercise-input-details text2"
              placeholder="exercise details"
            />
          </div>

          <div className="exercise-input-cancel text2" onClick={closeDiv}>
            cancel
          </div>
          <div
            className="exercise-input-confirm text2"
            onClick={confirmChanges}
          >
            confirm
          </div>
        </div>
      </div>
    </>
  )
}
export default ExerciseInputs

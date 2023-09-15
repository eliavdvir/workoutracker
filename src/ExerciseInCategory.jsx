import { useState, useRef } from "react"
import Set from "./Set"
import { useNavigate } from "react-router-dom"
import RemoveExercise from "./RemoveExercise"

function ExerciseInCategory({ exercise, resetCategoryHeight }) {
  const [touchStartTime, setTouchStartTime] = useState(null)
  const [deleteExerciseOpen, setDeleteExerciseOpen] = useState(false)
  const [initialScrollPos, setInitialScrollPos] = useState(0)
  const exerciseDivRef = useRef(null)
  const navigate = useNavigate()

  const handleClick = () => {
    console.log("Clicked")
    navigate(`/workout/${exercise.exerciseId}`)
  }

  const handleTouchStart = () => {
    const startTime = new Date().getTime()
    setTouchStartTime(startTime)
    setInitialScrollPos(window.scrollY)
  }

  const handleTouchEnd = () => {
    const endTime = new Date().getTime()
    const currentScrollPos = window.scrollY

    if (
      Math.abs(initialScrollPos - currentScrollPos) < 10 &&
      endTime - touchStartTime >= 1000
    ) {
      setDeleteExerciseOpen(true)
    }
    setTouchStartTime(null)
  }
  function handleRightClick(e) {
    e.preventDefault()
    console.log("clicked right")
    setDeleteExerciseOpen(true)
  }

  return (
    <div
      className="exercise-in-category-container no-select"
      ref={exerciseDivRef}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleRightClick}
    >
      <div className="exercise-state-indicator-opened"></div>
      <div className="exercise-in-category-text text2">
        <p className="exercise-name-text">{exercise.exerciseName}</p>
        <p className="exercise-details-text">{exercise.exerciseDetails}</p>
      </div>
      <div className="sets-container">
        {exercise.sets.length === 0 && (
          <div className="category-closed-no-sets">
            <img
              src="https://i.imgur.com/52KqLVj.png"
              alt="Workout"
              className="exercise-add-category-image"
            />
          </div>
        )}
        {exercise.sets.map((set) => {
          return <Set key={set.setId} set={set}></Set>
        })}
      </div>
      <img
        className="open-exercise-button"
        src="https://i.imgur.com/RCGtgXJ.png"
        alt="open exercise"
      />
      {exercise.sets.length > 0 ? (
        <span className="exercise-set-amount text2">
          {exercise.sets.length} set{exercise.sets.length > 1 ? "s" : null}
        </span>
      ) : null}

      <div className="bottom-line"></div>
      {deleteExerciseOpen && (
        <RemoveExercise
          setDeleteExerciseOpen={setDeleteExerciseOpen}
          exercise={exercise}
          resetCategoryHeight={resetCategoryHeight}
          exerciseDivRef={exerciseDivRef}
        />
      )}
    </div>
  )
}

export default ExerciseInCategory

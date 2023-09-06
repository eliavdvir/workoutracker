import { useEffect, useRef, useContext, useState } from "react"
import { DataContext } from "./DataProvider"

function RemoveExercise({
  setDeleteExerciseOpen,
  exercise,
  resetCategoryHeight,
  exerciseDivRef,
}) {
  const { dispatch } = useContext(DataContext)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [height, setHeight] = useState(0)
  const containerRef = useRef()

  function remover(event) {
    event.stopPropagation()
    dispatch({
      type: "REMOVE_EXERCISE",
      payload: { exerciseId: exercise.exerciseId },
    })
    resetCategoryHeight(-1)
    setDeleteExerciseOpen(false)
  }

  useEffect(() => {
    if (exerciseDivRef.current) {
      const rect = exerciseDivRef.current.getBoundingClientRect()

      const viewportHeight = window.innerHeight
      const distanceToBottom = viewportHeight - rect.bottom
      const finalHeight = distanceToBottom - viewportHeight * 0.06
      setHeight(finalHeight)

      setPosition({
        top: rect.bottom - 18,
        left: rect.left,
      })
    }
  }, [exerciseDivRef])

  useEffect(() => {
    function handleClickOutside(event) {
      event.stopPropagation()
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setDeleteExerciseOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  return (
    <div className="remove-exercise-transparent-container">
      <div
        className="remove-exercise-container"
        style={{
          position: "fixed",
          top: `${position.top}px`,
          left: `${position.left}px`,
          height: `${height}px`,
        }}
      >
        <div
          ref={containerRef}
          onClick={remover}
          className="remove-exercise text2"
        >
          remove exercise
        </div>
      </div>
    </div>
  )
}

export default RemoveExercise

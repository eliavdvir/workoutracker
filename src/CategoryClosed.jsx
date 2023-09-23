import { useContext } from "react"
import { DataContext } from "./DataProvider"
import { HistoryContext } from "./DataProvider"

function CategoryClosed(props) {
  const { dispatch } = useContext(DataContext)
  const { historyState } = useContext(HistoryContext)

  function addExercise() {
    let exerciseId
    do {
      exerciseId = (Math.floor(Math.random() * 100000) + 1).toString()
    } while (
      historyState.exercises.some(
        (exercise) => exercise.exerciseId === exerciseId
      )
    )

    const newExercise = {
      exerciseId,
      exerciseName: "New Exercise",
      exerciseDetails: "",
      exerciseComplete: false,
      sets: [],
    }

    dispatch({
      type: "ADD_EXERCISE",
      payload: {
        categoryId: props.category.categoryId,
        exercise: newExercise,
      },
    })
    props.setIsOpened(true)
    props.setLayoutHeight(
      () => `${(props.category.exercises.length + 1) * 11 + 7}rem`
    )
  }
  return (
    <>
      <div
        className="category-closed"
        onClick={() => {
          if (props.category.exercises.length === 0) return
          props.setIsOpened(true)
          props.setLayoutHeight(
            () => `${props.category.exercises.length * 11 + 7}rem`
          )
        }}
      >
        <div className="category-closed-exercises">
          {props.category.exercises.map((exercise) => {
            const uniqueKey = `${exercise.exerciseId}-${Math.random()}`

            return (
              <div
                key={uniqueKey}
                className="flexbox-min exercise-container-closed"
              >
                <div className="exercise-state-indicator-closed"></div>
                <p className="text2">{exercise.exerciseName}</p>
              </div>
            )
          })}
        </div>

        {props.category.exercises.length === 0 && (
          <div onClick={addExercise} className="add-exercise-container">
            <img src="https://i.imgur.com/52KqLVj.png" alt="Workout" />
            <div className="text2">add exercise</div>
          </div>
        )}
      </div>
    </>
  )
}

export default CategoryClosed

import ExerciseInCategory from "./ExerciseInCategory"
import { useContext, useState } from "react"
import { DataContext } from "./DataProvider"
import RemoveCategory from "./RemoveCategory"

function CategoryOpened(props) {
  const { dispatch } = useContext(DataContext)
  const [removeDivOpen, setRemoveDivOpen] = useState(false)

  function resetCategoryHeight(num) {
    props.setLayoutHeight(
      () => `${(props.category.exercises.length + num) * 11 + 7}rem`
    )
  }

  function addExercise() {
    let exerciseId
    do {
      exerciseId = Math.floor(Math.random() * 100000) + 1
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
    resetCategoryHeight(1)
  }
  function categoryRemover() {
    dispatch({
      type: "REMOVE_CATEGORY",
      payload: {
        categoryId: props.category.categoryId,
      },
    })
  }
  return (
    <>
      {removeDivOpen && (
        <RemoveCategory
          categoryRemover={categoryRemover}
          setRemoveDivOpen={setRemoveDivOpen}
        />
      )}
      <img
        src="https://i.imgur.com/Ehv2bXU.png"
        alt="close category"
        className="close-category-icon"
        onClick={() => {
          props.setIsOpened(false)
          props.setLayoutHeight("33%")
        }}
      />
      <img
        src="https://i.imgur.com/8b2cbR5.png"
        alt="delete category"
        className="delete-category-icon"
        onClick={() => setRemoveDivOpen(true)}
      />
      {props.category.exercises.map((exercise) => {
        const uniqueKey = `${exercise.exerciseId}-${Math.random()}`
        return (
          <ExerciseInCategory
            key={uniqueKey}
            exercise={exercise}
            resetCategoryHeight={resetCategoryHeight}
          />
        )
      })}
      <div onClick={addExercise} className="add-exercise-container-opened">
        <img src="https://i.imgur.com/52KqLVj.png" alt="Workout" />
        <div className="text2">add exercise</div>
      </div>
    </>
  )
}

export default CategoryOpened

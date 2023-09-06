import { useContext } from "react"
import { DataContext } from "./DataProvider"
import { HistoryContext } from "./DataProvider"
import { useNavigate } from "react-router-dom"
import TagActive from "./TagActive"
import TagStatic from "./TagStatic"

function WorkoutInProfile({ workout }) {
  const { state, dispatch } = useContext(DataContext)
  const { historyState } = useContext(HistoryContext)

  const navigate = useNavigate()

  function formatDate(d) {
    const date = new Date(d)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = String(date.getFullYear()).slice(-2)

    return `${day}.${month}.${year}`
  }

  function loadWorkout(actionType) {
    const noExistingWorkout = !historyState.workoutHistory.find(
      (item) => item.workoutDate === state.workoutDate
    )

    const hasCategories = state.categories && state.categories.length > 0
    const hasWorkoutTags = state.workoutTags && state.workoutTags.length > 0
    const hasWorkoutName = state.workoutName && state.workoutName !== ""

    if (
      noExistingWorkout &&
      (hasCategories || hasWorkoutTags || hasWorkoutName)
    ) {
      const userConfirmed = window.confirm(
        "You created a workout but did not save it. Loading a new workout will override the current workout. Are you sure?"
      )
      if (!userConfirmed) {
        return
      }
    }

    dispatch({ type: actionType, payload: workout })
    navigate("/workout")
  }

  return (
    <div className="profile-workout-container radial-background">
      <img
        className="neon-border-bottom"
        src="https://i.imgur.com/a5Qfaje.png"
        alt=""
      />
      <div className="profile-name-date-container text2">
        <div className="profile-workout-name">{workout.workoutName}</div>
        <div className="profile-workout-date">
          {formatDate(workout.workoutDate)}
        </div>
      </div>
      <div className="profile-workout-tags">
        {workout.workoutTags.map((tag) => {
          return <TagStatic key={tag} tagText={tag} />
        })}
      </div>
      <button
        className="profile-workout-load text2"
        onClick={() => loadWorkout("LOAD")}
      >
        load workout
      </button>
      <button
        className="profile-workout-load-new text2"
        onClick={() => loadWorkout("LOAD_NEW")}
      >
        load as new
      </button>
    </div>
  )
}

export default WorkoutInProfile

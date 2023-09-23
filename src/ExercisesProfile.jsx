import { useContext, useEffect, useState } from "react"
import LoadData from "./LoadData"

import { HistoryContext } from "./DataProvider"

function ExercisesProfile() {
  const { historyState } = useContext(HistoryContext)
  const [loadDataOpen, setLoadDataOpen] = useState(false)
  const [exerciseArray, setExerciseArray] = useState(historyState.exercises)
  const [filterInput, setFilterInput] = useState("")

  useEffect(() => {
    setExerciseArray(() => {
      return historyState.exercises.filter((exercise) =>
        exercise.name.toLowerCase().startsWith(filterInput.toLowerCase())
      )
    })
  }, [filterInput])

  return (
    <div className="profile-container radial-background">
      <img
        className="neon-border-top"
        src="https://i.imgur.com/a5Qfaje.png"
        alt=""
      />

      {historyState.workoutHistory.length === 0 ? (
        <>
          <div
            className="load-data-button"
            onClick={() => setLoadDataOpen(true)}
          >
            <img
              src="https://i.imgur.com/IRnqi8g.png"
              alt=""
              className="quick-start-img"
            />
            <span className="text1">Load data</span>
          </div>
          {loadDataOpen && <LoadData setLoadDataOpen={setLoadDataOpen} />}
        </>
      ) : null}
      <input
        className="profile-exercises-filter text2"
        type="text"
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
        placeholder="filter exercises"
      />
      {exerciseArray
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((exercise) => {
          let totalReps = 0
          let highestReps = 0
          let highestKg = 0
          let highestLbs = 0

          historyState.workoutHistory.forEach((workout) => {
            workout.categories.forEach((category) => {
              category.exercises.forEach((catExercise) => {
                if (catExercise.exerciseId === exercise.id) {
                  catExercise.sets.forEach((set) => {
                    if (set.reps > highestReps) {
                      highestReps = set.reps
                    }
                    if (set.isKG) {
                      if (set.weight > highestKg) {
                        highestKg = set.weight
                      }
                    } else {
                      if (set.weight > highestLbs) {
                        highestLbs = set.weight
                      }
                    }
                    totalReps += set.reps
                  })
                }
              })
            })
          })
          return (
            <div
              className="profile-workout-container radial-background"
              key={exercise.id}
            >
              <img
                className="neon-border-bottom"
                src="https://i.imgur.com/a5Qfaje.png"
                alt=""
              />
              <div className="profile-exercises-name text2">
                {exercise.name}
              </div>
              <div className="profile-exercises-data-container">
                <div className="profile-exercises-total-reps text2">
                  <span style={{ fontSize: "2rem" }}>{totalReps}</span>
                  <span style={{ color: "#FFF" }}>total reps</span>
                </div>
                <div className="profile-exercises-highest-reps text2">
                  <span style={{ fontSize: "2rem" }}>{highestReps}</span>
                  <span style={{ color: "#FFF" }}>highest reps</span>
                </div>
                <div className="profile-exercises-highest-weight text2">
                  <div>
                    <span style={{ fontSize: "1.75rem" }}>
                      {highestKg}
                      <span style={{ fontSize: "1rem" }}>kg</span>
                    </span>
                    <span style={{ fontSize: "1.75rem" }}>
                      {highestLbs}
                      <span style={{ fontSize: "1rem" }}>lbs</span>
                    </span>
                  </div>
                  <span style={{ paddingTop: "3px", color: "#FFF" }}>
                    highest weight
                  </span>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default ExercisesProfile

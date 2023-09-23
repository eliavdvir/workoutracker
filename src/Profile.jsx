import { useContext, useState } from "react"
import { HistoryContext } from "./DataProvider"
import WorkoutInProfile from "./WorkoutInProfile"
import LoadData from "./LoadData"
import ExercisesProfile from "./ExercisesProfile"

function Profile() {
  const { historyState } = useContext(HistoryContext)
  const [shownWorkouts, setShownWorkouts] = useState(10)
  const [loadDataOpen, setLoadDataOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showExercises, setShowExercises] = useState(false)

  return (
    <>
      <div
        className="profile-page-changer"
        onClick={(e) => {
          setShowModal((m) => !m)
        }}
      ></div>
      {showModal && (
        <div className="profile-modal">
          <div
            className={
              showExercises
                ? "text2 profile-modal-workouts"
                : "text2 profile-modal-workouts profile-modal-chosen"
            }
            onClick={() => {
              setShowExercises(false)
              setShowModal(false)
            }}
          >
            workouts
          </div>
          <div
            className={showExercises ? "text2 profile-modal-chosen" : "text2"}
            onClick={() => {
              setShowExercises(true)
              setShowModal(false)
            }}
          >
            exercises
          </div>
        </div>
      )}
      {showExercises ? (
        <ExercisesProfile />
      ) : (
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
          {historyState.workoutHistory
            .slice(0, shownWorkouts)
            .map((workout) => {
              return (
                <WorkoutInProfile key={workout.workoutDate} workout={workout} />
              )
            })}
          {shownWorkouts < historyState.workoutHistory.length ? (
            <div
              className="profile-show-more text2"
              onClick={() => setShownWorkouts(shownWorkouts + 10)}
            >
              <img
                src="https://i.imgur.com/52KqLVj.png"
                alt="Workout"
                className="add-category-image"
              />
              show more workouts
            </div>
          ) : null}
        </div>
      )}
    </>
  )
}

export default Profile

import { useState } from "react"

function MatchingExercise({
  setUserConfirmed,
  exercises,
  dispatchExerciseIdChange,
}) {
  const [chosenExercise, setChosenExercise] = useState(null)

  function closeDiv() {
    setUserConfirmed(true)
  }

  function confirmer() {
    if (chosenExercise) {
      dispatchExerciseIdChange(chosenExercise)
    }
  }

  return (
    <>
      <div className="matching-input">
        <div className="matching-input-container">
          <div className="matching-input-text text2">
            found {exercises.length} exercise{exercises.length > 1 ? "s" : null}{" "}
            with matching name!
          </div>
          <div className="matching-input-subtext text2">
            choose the correct exercise, or cancel to create a new one
          </div>
          <div className="matching-divs-container">
            {exercises.map((exercise) => {
              return (
                <div
                  className={`matching-div text2 ${
                    chosenExercise?.id === exercise.id
                      ? "matching-div-chosen"
                      : ""
                  }`}
                  key={`${exercise.id}inMatching`}
                  onClick={() => setChosenExercise(exercise)}
                >
                  {exercise.name}
                </div>
              )
            })}
          </div>
          <div className="matching-input-cancel text2" onClick={closeDiv}>
            cancel
          </div>
          <div className="matching-input-confirm text2" onClick={confirmer}>
            confirm
          </div>
        </div>
      </div>
    </>
  )
}

export default MatchingExercise

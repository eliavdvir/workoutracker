import { useEffect, useRef, useState } from "react"
import DataExporter from "./DataExporter"
import { useContext } from "react"
import { DataContext } from "./DataProvider"
import { HistoryContext } from "./DataProvider"
import Tag from "./Tag"
import TagActive from "./TagActive"

function WorkoutInputs({ setExportIsChosen }) {
  const [stepTwo, setStepTwo] = useState(false)
  const containerRef = useRef(null)
  const tagContainerRef = useRef(null)
  const textareaRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const nameRef = useRef(null)
  const { state, dispatch } = useContext(DataContext)
  const { historyState, historyDispatch } = useContext(HistoryContext)
  const [totalTags, setTotalTags] = useState([])
  const [workoutTags, setWorkoutTags] = useState([])
  const [newTagName, setNewTagName] = useState("")
  const [isError, setIsError] = useState(false)

  function closeDiv() {
    setExportIsChosen(false)
  }

  function errorSetter() {
    setIsError(true)
    setTimeout(() => {
      setIsError(false)
    }, 3000)
  }

  function nextStep() {
    if (nameRef.current.value.length < 3) {
      errorSetter()
      return
    }

    let newExercises = []
    for (const category of state.categories) {
      for (const exercise of category.exercises) {
        if (
          exercise.exerciseName === "" ||
          exercise.exerciseName === "New Exercise"
        )
          continue
        const exerciseId = exercise.exerciseId
        const existsInHistory = historyState.exercises.some(
          (histExercise) => histExercise.id === exerciseId
        )
        const existsInNewExercises = newExercises.some(
          (newExercise) => newExercise.id === exerciseId
        )

        if (!existsInHistory && !existsInNewExercises) {
          newExercises.push({
            id: exerciseId,
            name: exercise.exerciseName,
          })
        }
      }
    }

    dispatch({
      type: "UPDATE_WORKOUT",
      payload: {
        workoutTags: workoutTags,
        workoutName: nameRef.current.value,
      },
    })
    if (
      historyState.workoutHistory.some(
        (item) => item.workoutDate === state.workoutDate
      )
    ) {
      historyDispatch({
        type: "UPDATE_WORKOUT",
        payload: {
          ...state,
          workoutName: nameRef.current.value,
          workoutTags: workoutTags,
          newTotalTags: totalTags,
          newExercises: newExercises,
        },
      })
    } else {
      historyDispatch({
        type: "LOAD",
        payload: {
          ...historyState,
          totalTags: totalTags,
          exercises: [...historyState.exercises, ...newExercises],
          workoutHistory: [
            {
              ...state,
              workoutTags: workoutTags,
              workoutName: nameRef.current.value,
            },
            ...historyState.workoutHistory,
          ],
        },
      })
    }

    setStepTwo(true)
  }

  function addNewTag(tag) {
    setWorkoutTags((prevTags) => {
      return [...prevTags, tag]
    })
    setTotalTags((prevTotalTags) => {
      if (!prevTotalTags.includes(tag)) {
        return [...prevTotalTags, tag]
      }
      return prevTotalTags
    })
    setNewTagName("")
  }

  function removeTag(tag) {
    setWorkoutTags((prevTags) => {
      return prevTags.filter((existingTag) => existingTag !== tag)
    })
  }

  useEffect(() => {
    setWorkoutTags(() => state.workoutTags)
    setTotalTags(() => historyState.totalTags)
    nameRef.current.value = state.workoutName

    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeDiv()
      }
    }

    function handleClickOutsideTags(event) {
      if (
        tagContainerRef.current &&
        !tagContainerRef.current.contains(event.target)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("mousedown", handleClickOutsideTags)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("mousedown", handleClickOutsideTags)
    }
  }, [])
  return (
    <>
      {isError && (
        <div className="input-data-error text2">
          name must be more than 3 letters
        </div>
      )}
      {stepTwo ? (
        <DataExporter setExportIsChosen={setExportIsChosen} />
      ) : (
        <div className="workout-input">
          <div ref={containerRef} className="workout-input-container">
            <div className="workout-input-inputs-container">
              <input
                ref={nameRef}
                type="text"
                className="workout-input-name text2"
                placeholder="workout name"
              />
              <div
                ref={tagContainerRef}
                className="workout-input-tags-container"
                style={{
                  border: isFocused ? "2px solid var(--secondary-color)" : "",
                }}
                onClick={() => {
                  textareaRef.current.focus()
                  setIsFocused(true)
                }}
              >
                {" "}
                <div className="workout-input-current-tags">
                  {workoutTags.map((tag) => {
                    return (
                      <TagActive
                        key={`${tag}active`}
                        tagText={tag}
                        removeTag={removeTag}
                      />
                    )
                  })}
                </div>
                <textarea
                  value={newTagName}
                  ref={textareaRef}
                  onChange={(e) => {
                    if (workoutTags.length > 3) return
                    setNewTagName(e.target.value)
                  }}
                  type="text"
                  className="workout-input-details text2"
                  placeholder="enter tag (4 tags max)"
                />
                <div className="workout-input-suggested-tags">
                  {(newTagName.length > 0 ||
                    totalTags.filter((tag) => !workoutTags.includes(tag))
                      .length > 0) && (
                    <span
                      className="text2"
                      style={{ fontSize: "0.75rem", color: "#C8C8C8" }}
                    >
                      tap to add tag
                    </span>
                  )}
                  <div className="workout-input-suggested-container">
                    {newTagName.length > 0 &&
                      !workoutTags.includes(newTagName) && (
                        <Tag
                          key={newTagName}
                          tagText={newTagName}
                          addNewTag={addNewTag}
                        />
                      )}
                    {totalTags.map((tag) => {
                      if (
                        tag.startsWith(newTagName) &&
                        !workoutTags.includes(tag)
                      ) {
                        if (workoutTags.length > 3) return
                        return (
                          <Tag key={tag} tagText={tag} addNewTag={addNewTag} />
                        )
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="workout-input-cancel text2" onClick={closeDiv}>
              cancel
              <div
                className="workout-input-clicker text2"
                onClick={closeDiv}
              ></div>
            </div>
            <div className="workout-input-confirm text2" onClick={nextStep}>
              save
              <div
                className="workout-input-clicker text2"
                onClick={nextStep}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default WorkoutInputs

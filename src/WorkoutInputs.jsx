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
  const [workoutTime, setWorkoutTime] = useState("00:00")

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

    const workoutDate = state.workoutDate
    const currentDate = new Date()
    const timeDifference = currentDate - workoutDate // Milliseconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60))
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    )

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`

    setWorkoutTime(formattedTime)

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
            <div className="workout-time text2">
              <svg
                className="workout-time-svg"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 131 131"
                fill="none"
              >
                <path
                  d="M65.5 122.813C54.1647 122.813 43.0839 119.451 33.6589 113.154C24.2339 106.856 16.888 97.9051 12.5502 87.4326C8.21233 76.9601 7.07735 65.4365 9.28877 54.3189C11.5002 43.2014 16.9587 32.9893 24.974 24.974C32.9893 16.9587 43.2014 11.5002 54.3189 9.28877C65.4365 7.07735 76.9601 8.21233 87.4326 12.5502C97.9051 16.888 106.856 24.2339 113.154 33.6589C119.451 43.0839 122.813 54.1647 122.813 65.5C122.813 80.7002 116.774 95.2779 106.026 106.026C95.2779 116.774 80.7002 122.813 65.5 122.813ZM65.5 16.375C55.784 16.375 46.2862 19.2562 38.2076 24.6541C30.1291 30.052 23.8326 37.7243 20.1144 46.7007C16.3963 55.6771 15.4234 65.5545 17.3189 75.0838C19.2144 84.6132 23.8931 93.3664 30.7634 100.237C37.6337 107.107 46.3869 111.786 55.9162 113.681C65.4455 115.577 75.3229 114.604 84.2993 110.886C93.2758 107.167 100.948 100.871 106.346 92.7924C111.744 84.7138 114.625 75.216 114.625 65.5C114.625 52.4713 109.449 39.9761 100.237 30.7634C91.0239 21.5507 78.5288 16.375 65.5 16.375Z"
                  fill="white"
                />
                <path
                  d="M84.2903 90.0625L61.4062 67.1784V28.6562H69.5938V63.7806L90.0625 84.2903L84.2903 90.0625Z"
                  fill="white"
                />
              </svg>
              <span>{workoutTime}</span>
            </div>
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
                    setNewTagName(e.target.value.toLowerCase())
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

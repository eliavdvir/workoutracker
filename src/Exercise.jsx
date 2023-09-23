import { useEffect, useLayoutEffect, useRef, useState, useContext } from "react"
import { DataContext } from "./DataProvider"
import { HistoryContext } from "./DataProvider"
import { useNavigate, useParams } from "react-router-dom"
import SetInExercise from "./SetInExercise"
import Select from "react-select"
import WeightInput from "./WeightInput"
import ExerciseInputs from "./ExerciseInputs"

const options = [
  { value: "yellow", label: "yellow", img: "https://i.imgur.com/WXy5Rgx.png" },
  { value: "red", label: "red", img: "https://i.imgur.com/QuANDiZ.png" },
  { value: "black", label: "black", img: "https://i.imgur.com/Bmlxp5D.png" },
]

const CustomOption = ({ label, data, innerProps }) => (
  <div {...innerProps} className="in-exercise-bands-option text2">
    <img
      className="in-exercise-bands-image"
      src={data.img}
      alt={label}
      style={{ width: "20px", marginRight: "8px" }}
    />
    {label}
  </div>
)
const CustomSingleValue = ({ data }) => (
  <div className="in-exercise-bands-selected text2">
    <img src={data.img} alt={data.label} className="in-exercise-bands-image" />
    <span className="text-container"> {data.label}</span>
  </div>
)
const customStyles = {
  valueContainer: (provided) => ({
    ...provided,
    height: "40px",
  }),
}

function Exercise() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(DataContext)
  const { historyState } = useContext(HistoryContext)
  const { exerciseId } = useParams()
  const [extrasJsx, setExtrasJsx] = useState(null)
  const [weightInputOpen, setWeightInputOpen] = useState(false)
  const [exerciseInputsOpen, setExerciseInputsOpen] = useState(false)
  const [highscore, setHighscore] = useState("-")

  const category = state.categories.find((cat) =>
    cat.exercises.some((ex) => ex.exerciseId === exerciseId)
  )
  const exercise = category
    ? category.exercises.find((ex) => ex.exerciseId === exerciseId)
    : null

  useEffect(() => {
    if (exercise === null) {
      returner()
    }
  }, [exercise])

  const [chosenSet, setChosenSet] = useState(exercise?.sets[0] || undefined)
  const ballRef = useRef()
  const middleCircle = useRef()
  const leftCircle = useRef()
  const rightCircle = useRef()

  useLayoutEffect(() => {
    if (chosenSet?.isWeights) {
      ballRef.current.className = "exercise-extras-ball-middle"
      middleCircle.current.className = "middle-circle chosen-circle"
      leftCircle.current.className = "left-side-circle"
      rightCircle.current.className = "right-side-circle"
    } else if (chosenSet?.isBand) {
      ballRef.current.className = "exercise-extras-ball-right"
      middleCircle.current.className = "middle-circle"
      leftCircle.current.className = "left-side-circle"
      rightCircle.current.className = "right-side-circle chosen-circle"
    } else if (chosenSet?.isNone) {
      ballRef.current.className = "exercise-extras-ball-left"
      middleCircle.current.className = "middle-circle"
      leftCircle.current.className = "left-side-circle chosen-circle"
      rightCircle.current.className = "right-side-circle"
    }
    changeExtrasJsx()
  }, [chosenSet])

  useEffect(() => {
    if (chosenSet) {
      let highest = 0
      const chosenSetIndex = exercise.sets.findIndex(
        (set) => set.setId === chosenSet.setId
      )

      historyState.workoutHistory.forEach((item) => {
        item.categories.forEach((category) => {
          category.exercises.forEach((historyExercise) => {
            if (historyExercise.exerciseId === exercise.exerciseId) {
              if (
                historyExercise.sets &&
                historyExercise.sets[chosenSetIndex]
              ) {
                const matchingSet = historyExercise.sets[chosenSetIndex]
                if (chosenSet.isNone && matchingSet.isNone) {
                  if (matchingSet.reps > highest) {
                    highest = matchingSet.reps
                  }
                } else if (
                  chosenSet.isWeights &&
                  matchingSet.isWeights &&
                  matchingSet.isKG === chosenSet.isKG &&
                  matchingSet.weight === chosenSet.weight
                ) {
                  if (matchingSet.reps > highest) {
                    highest = matchingSet.reps
                  }
                } else if (
                  chosenSet.isBand &&
                  matchingSet.isBand &&
                  chosenSet.band === matchingSet.band
                ) {
                  if (matchingSet.reps > highest) {
                    highest = matchingSet.reps
                  }
                }
              }
            }
          })
        })
      })
      let highestStr = String(highest)
      setHighscore(highestStr)

      dispatch({
        type: "UPDATE_SET",
        payload: {
          categoryId: chosenSet.categoryId,
          exerciseId: chosenSet.exerciseId,
          setId: chosenSet.setId,
          updates: chosenSet,
        },
      })
    }
  }, [chosenSet, dispatch])

  function addSet() {
    if (!exercise || !category) return
    let isZeroBefore = false
    if (exercise.sets.length === 0) {
      isZeroBefore = true
    }

    let setId
    do {
      setId = (Math.floor(Math.random() * 10000) + 1).toString()
    } while (
      state.categories.some((category) =>
        category.exercises.some((exercise) =>
          exercise.sets.some((set) => set.setId === setId)
        )
      )
    )

    const newSet = {
      setId,
      exerciseId: exercise.exerciseId,
      categoryId: category.categoryId,
      reps: 0,
      isNone: true,
      isWeights: false,
      isBand: false,
      weight: 0,
      band: "none",
      isKG: true,
    }

    dispatch({
      type: "ADD_SET",
      payload: {
        categoryId: category.categoryId,
        exerciseId: exercise.exerciseId,
        set: newSet,
      },
    })

    setChosenSet(newSet)
  }
  function removeSet() {
    dispatch({
      type: "REMOVE_SET",
      payload: {
        categoryId: category.categoryId,
        exerciseId: chosenSet.exerciseId,
        setId: chosenSet.setId,
      },
    })
    setChosenSet(() => {
      const newSets = exercise.sets.filter(
        (set) => set.setId !== chosenSet.setId
      )
      return newSets.length === 0 ? undefined : newSets[0]
    })
  }

  function decrementReps() {
    if (chosenSet.reps <= 0) return
    setChosenSet((oldSet) => {
      return {
        ...oldSet,
        reps: oldSet.reps - 1,
      }
    })
  }
  function incrementReps() {
    setChosenSet((oldSet) => {
      return {
        ...oldSet,
        reps: oldSet.reps + 1,
      }
    })
  }
  function changeExtrasOption(type) {
    setChosenSet((oldSet) => {
      return {
        ...oldSet,
        isWeights: type === "weights",
        isNone: type === "none",
        isBand: type === "band",
      }
    })
  }
  const bandSelectChange = (selectedOption) => {
    if (selectedOption) {
      setChosenSet((oldSet) => {
        return {
          ...oldSet,
          band: selectedOption.value,
        }
      })
    }
  }

  function changeExtrasJsx() {
    if (chosenSet?.isNone) {
      setExtrasJsx(null)
      return
    } else if (chosenSet?.isWeights) {
      setExtrasJsx(() => {
        return (
          <div className="in-exercise-extras-div">
            <div className="in-exercise-extras-weights">
              <div
                className="in-exercise-extras-weights-text text3"
                onClick={() => setWeightInputOpen(true)}
              >
                {chosenSet.weight}
              </div>
              <div className="in-exercise-extras-weights-type text2">
                <span
                  onClick={() => {
                    setChosenSet((oldSet) => {
                      return {
                        ...oldSet,
                        isKG: !oldSet.isKG,
                      }
                    })
                  }}
                >
                  {chosenSet.isKG ? "Kg" : "lbs"}
                </span>
              </div>
            </div>
          </div>
        )
      })
    } else if (chosenSet?.isBand) {
      setExtrasJsx(() => {
        const defaultOption =
          chosenSet.band === "none"
            ? null
            : options.find((opt) => opt.value === chosenSet.band)
        return (
          <div className="in-exercise-extras-div">
            <div className="in-exercise-extras-band">
              <Select
                isSearchable={false}
                options={options}
                components={{
                  Option: CustomOption,
                  SingleValue: CustomSingleValue,
                }}
                styles={customStyles}
                defaultValue={defaultOption}
                onChange={bandSelectChange}
              />
            </div>
          </div>
        )
      })
    }
  }
  function returner() {
    navigate("/Workout")
  }
  return (
    <>
      <div className="exercise-page">
        {exerciseInputsOpen && (
          <ExerciseInputs
            setExerciseInputsOpen={setExerciseInputsOpen}
            exercise={exercise}
            categoryId={category.categoryId}
          />
        )}
        {weightInputOpen && (
          <WeightInput
            setWeightInputOpen={setWeightInputOpen}
            setChosenSet={setChosenSet}
            chosenSet={chosenSet}
          />
        )}
        <div className="exercise-return-button text2" onClick={returner}>
          return
        </div>
        <div className="flexbox category-name">
          {category.categorySrc.length > 2 && (
            <img
              className="exercise-category-image"
              src={category?.categorySrc}
              alt=""
            />
          )}

          <h1 className="text1 exercise-category-name-text">
            {category?.categoryName}
          </h1>
        </div>
        <div
          className="in-exercise-text-exname text2"
          onClick={() => {
            setExerciseInputsOpen(true)
          }}
        >
          <p className="in-exercise-name-text">{exercise?.exerciseName}</p>
          <p className="in-exercise-details-text">
            {exercise?.exerciseDetails}
          </p>
        </div>
        <div className="exercise-sets-container">
          <div className="exercise-actual-sets">
            {exercise?.sets.map((set) => {
              return (
                <div
                  key={`${set.setId}InExercise`}
                  onClick={() => {
                    setChosenSet(set)
                  }}
                  className="exercise-set"
                >
                  <SetInExercise
                    set={set}
                    chosenSet={chosenSet?.setId}
                  ></SetInExercise>
                </div>
              )
            })}
          </div>
          <div className="exercise-sets-dash-border"></div>
          <div className="exercise-add-set" onClick={addSet}>
            <div className="in-exercise-add-set">
              <img
                src="https://i.imgur.com/52KqLVj.png"
                alt="Workout"
                className="exercise-add-category-image"
              />
            </div>
          </div>
          {exercise.sets.length > 0 ? (
            <span className="in-exercise-set-amount text2">
              {exercise.sets.length} set{exercise.sets.length > 1 ? "s" : null}
            </span>
          ) : null}
          <div className="border-line"></div>
        </div>

        <div className="in-exercise-reps">
          {chosenSet && (
            <>
              <div className="in-exercise-minus text2" onClick={decrementReps}>
                -
              </div>
              <div className="in-exercise-reps-amount text3">
                {chosenSet.reps}
              </div>
              <div className="in-exercise-plus text2" onClick={incrementReps}>
                +
              </div>
            </>
          )}
        </div>

        <div className="in-exercise-extras-section">
          {chosenSet && (
            <>
              <div
                className="extras-click-container-left"
                onClick={() => {
                  changeExtrasOption("none")
                }}
              ></div>
              <div
                className="extras-click-container-middle"
                onClick={() => {
                  changeExtrasOption("weights")
                }}
              ></div>
              <div
                className="extras-click-container-right"
                onClick={() => {
                  changeExtrasOption("band")
                }}
              ></div>

              <div className="in-exercise-extras-texts">
                <div
                  className={`
                    text2 in-exercise-extras-text 
                    ${chosenSet.isNone ? "in-exercise-extras-text-chosen" : ""}
                  `}
                >
                  none
                </div>
                <div
                  className={`
                    text2 in-exercise-extras-text 
                    ${
                      chosenSet.isWeights
                        ? "in-exercise-extras-text-chosen"
                        : ""
                    }
                  `}
                >
                  weights
                </div>
                <div
                  className={`
                  text2 in-exercise-extras-text 
                  ${chosenSet.isBand ? "in-exercise-extras-text-chosen" : ""}
                `}
                >
                  bands
                </div>
              </div>
              <div className="left-side-circle" ref={leftCircle}></div>
              <div className="left-side-circle-bg"></div>
              <div className="left-side-tube"></div>
              <div className="middle-circle" ref={middleCircle}></div>
              <div className="middle-circle-bg-left"></div>
              <div className="middle-circle-bg-right"></div>
              <div className="right-side-tube"></div>
              <div className="right-side-circle" ref={rightCircle}></div>
              <div className="right-side-circle-bg"></div>
              <div ref={ballRef}></div>
              {extrasJsx}
            </>
          )}
        </div>
        <div className="in-exercise-bottom-section">
          {chosenSet && (
            <>
              <div className="in-exercise-highscore-div">
                <div className="highscore-container">
                  <div className="highscore-container-line">
                    <img src="https://i.imgur.com/TbOMtqw.png" alt="" />
                    <div className="highscore-text-word text3">highest</div>
                    <svg
                      className="question-mark-highscore"
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                    >
                      <path
                        opacity="0.2"
                        d="M35 20C35 22.9667 34.1203 25.8668 32.4721 28.3336C30.8238 30.8003 28.4812 32.7229 25.7403 33.8582C22.9994 34.9935 19.9834 35.2906 17.0737 34.7118C14.1639 34.133 11.4912 32.7044 9.39341 30.6066C7.29562 28.5088 5.86701 25.8361 5.28823 22.9264C4.70945 20.0166 5.0065 17.0006 6.14181 14.2597C7.27713 11.5189 9.19972 9.17618 11.6665 7.52796C14.1332 5.87973 17.0333 5 20 5C23.9783 5 27.7936 6.58035 30.6066 9.3934C33.4197 12.2064 35 16.0218 35 20Z"
                        fill="#B7B7B7"
                      />
                      <path
                        d="M21.875 28.125C21.875 28.4958 21.765 28.8584 21.559 29.1667C21.353 29.475 21.0601 29.7154 20.7175 29.8573C20.3749 29.9992 19.9979 30.0363 19.6342 29.964C19.2705 29.8916 18.9364 29.713 18.6742 29.4508C18.412 29.1886 18.2334 28.8545 18.161 28.4908C18.0887 28.1271 18.1258 27.7501 18.2677 27.4075C18.4096 27.0649 18.65 26.772 18.9583 26.566C19.2667 26.36 19.6292 26.25 20 26.25C20.4973 26.25 20.9742 26.4475 21.3258 26.7992C21.6775 27.1508 21.875 27.6277 21.875 28.125ZM20 11.25C16.5531 11.25 13.75 13.7734 13.75 16.875V17.5C13.75 17.8315 13.8817 18.1495 14.1161 18.3839C14.3505 18.6183 14.6685 18.75 15 18.75C15.3315 18.75 15.6495 18.6183 15.8839 18.3839C16.1183 18.1495 16.25 17.8315 16.25 17.5V16.875C16.25 15.1562 17.9328 13.75 20 13.75C22.0672 13.75 23.75 15.1562 23.75 16.875C23.75 18.5938 22.0672 20 20 20C19.6685 20 19.3505 20.1317 19.1161 20.3661C18.8817 20.6005 18.75 20.9185 18.75 21.25V22.5C18.75 22.8315 18.8817 23.1495 19.1161 23.3839C19.3505 23.6183 19.6685 23.75 20 23.75C20.3315 23.75 20.6495 23.6183 20.8839 23.3839C21.1183 23.1495 21.25 22.8315 21.25 22.5V22.3875C24.1 21.8641 26.25 19.5906 26.25 16.875C26.25 13.7734 23.4469 11.25 20 11.25ZM36.25 20C36.25 23.2139 35.297 26.3557 33.5114 29.028C31.7258 31.7003 29.1879 33.7831 26.2186 35.013C23.2493 36.243 19.982 36.5648 16.8298 35.9378C13.6776 35.3108 10.7821 33.7631 8.50952 31.4905C6.23692 29.2179 4.68926 26.3224 4.06225 23.1702C3.43524 20.018 3.75704 16.7507 4.98696 13.7814C6.21689 10.8121 8.29969 8.27419 10.972 6.48862C13.6443 4.70305 16.7861 3.75 20 3.75C24.3084 3.75455 28.439 5.46806 31.4855 8.51454C34.5319 11.561 36.2455 15.6916 36.25 20ZM33.75 20C33.75 17.2805 32.9436 14.6221 31.4327 12.3609C29.9218 10.0997 27.7744 8.33736 25.2619 7.29666C22.7494 6.25595 19.9848 5.98366 17.3175 6.5142C14.6503 7.04475 12.2003 8.35431 10.2773 10.2773C8.35432 12.2003 7.04476 14.6503 6.51421 17.3175C5.98366 19.9847 6.25596 22.7494 7.29666 25.2619C8.33737 27.7744 10.0997 29.9218 12.3609 31.4327C14.6221 32.9436 17.2805 33.75 20 33.75C23.6455 33.7459 27.1404 32.2959 29.7182 29.7182C32.2959 27.1404 33.7459 23.6455 33.75 20Z"
                        fill="#B7B7B7"
                      />
                    </svg>
                  </div>
                  <div className="highscore-text text3">{highscore}</div>
                </div>
              </div>
              <div className="in-exercise-delete-exercise-div">
                <div
                  className="in-exercise-delete-exercise text3"
                  onClick={removeSet}
                >
                  remove set
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Exercise

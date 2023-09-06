import { createContext, useReducer } from "react"

const initialState = {
  workoutDate: new Date(),
  workoutName: "",
  workoutTags: [],
  categories: [],
}

const actionTypes = {
  LOAD: "LOAD",
  LOAD_NEW: "LOAD_NEW",

  ADD_CATEGORY: "ADD_CATEGORY",
  ADD_EXERCISE: "ADD_EXERCISE",
  ADD_SET: "ADD_SET",

  UPDATE_WORKOUT: "UPDATE_WORKOUT",
  UPDATE_CATEGORY: "UPDATE_CATEGORY",
  UPDATE_EXERCISE: "UPDATE_EXERCISE",
  UPDATE_SET: "UPDATE_SET",

  REMOVE_SET: "REMOVE_SET",
  REMOVE_EXERCISE: "REMOVE_EXERCISE",
  REMOVE_CATEGORY: "REMOVE_CATEGORY",
}

const workoutReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOAD:
      return action.payload
    case actionTypes.LOAD_NEW: {
      const newPayload = JSON.parse(JSON.stringify(action.payload))

      newPayload.workoutDate = new Date()

      newPayload.categories = newPayload.categories.map((category) => {
        category.exercises = category.exercises.map((exercise) => {
          exercise.sets = exercise.sets.map((set) => {
            return { ...set, reps: 0 }
          })
          return exercise
        })
        return category
      })

      return newPayload
    }
    case actionTypes.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload],
      }
    case actionTypes.ADD_EXERCISE:
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category.categoryId === action.payload.categoryId) {
            return {
              ...category,
              exercises: [...category.exercises, action.payload.exercise],
            }
          }
          return category
        }),
      }
    case actionTypes.ADD_SET:
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category.categoryId === action.payload.categoryId) {
            return {
              ...category,
              exercises: category.exercises.map((exercise) => {
                if (exercise.exerciseId === action.payload.exerciseId) {
                  return {
                    ...exercise,
                    sets: [...exercise.sets, action.payload.set],
                  }
                }
                return exercise
              }),
            }
          }
          return category
        }),
      }
    case actionTypes.UPDATE_SET:
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category.categoryId === action.payload.categoryId) {
            return {
              ...category,
              exercises: category.exercises.map((exercise) => {
                if (exercise.exerciseId === action.payload.exerciseId) {
                  return {
                    ...exercise,
                    sets: exercise.sets.map((set) => {
                      if (set.setId === action.payload.setId) {
                        return { ...set, ...action.payload.updates }
                      }
                      return set
                    }),
                  }
                }
                return exercise
              }),
            }
          }
          return category
        }),
      }
    case actionTypes.UPDATE_EXERCISE:
      console.log("Dispatching: ", action.payload)

      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category.categoryId === action.payload.categoryId) {
            return {
              ...category,
              exercises: category.exercises.map((exercise) => {
                if (exercise.exerciseId === action.payload.exerciseId) {
                  return {
                    ...exercise,
                    ...action.payload.updatedExercise,
                  }
                }
                return exercise
              }),
            }
          }
          return category
        }),
      }
    case actionTypes.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category.categoryId === action.payload.categoryId) {
            return {
              ...category,
              ...action.payload.updatedCategory,
            }
          }
          return category
        }),
      }
    case actionTypes.UPDATE_WORKOUT:
      return {
        ...state,
        workoutTags: [...action.payload.workoutTags],
        workoutName: action.payload.workoutName,
      }
    case actionTypes.REMOVE_SET:
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category.categoryId === action.payload.categoryId) {
            return {
              ...category,
              exercises: category.exercises.map((exercise) => {
                if (exercise.exerciseId === action.payload.exerciseId) {
                  return {
                    ...exercise,
                    sets: exercise.sets.filter(
                      (set) => set.setId !== action.payload.setId
                    ),
                  }
                }
                return exercise
              }),
            }
          }
          return category
        }),
      }
    case actionTypes.REMOVE_EXERCISE:
      return {
        ...state,
        categories: state.categories.map((category) => {
          return {
            ...category,
            exercises: category.exercises.filter(
              (exercise) => exercise.exerciseId !== action.payload.exerciseId
            ),
          }
        }),
      }
    case actionTypes.REMOVE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.categoryId !== action.payload.categoryId
        ),
      }
    default:
      return state
  }
}

export const DataContext = createContext()

// reducer and context for workout history
const historyActionTypes = {
  LOAD: "LOAD",
  UPDATE_WORKOUT: "UPDATE_WORKOUT",
}

const historyInitialState = {
  savedWorkouts: [],
  workoutHistory: [],
  totalTags: [],
  exercises: [],
}

const historyReducer = (state, action) => {
  switch (action.type) {
    case historyActionTypes.LOAD:
      return action.payload
    case historyActionTypes.UPDATE_WORKOUT:
      const { newTotalTags, newExercises, ...restPayload } = action.payload
      const existingExerciseIds = new Set(state.exercises.map((e) => e.id))
      const uniqueNewExercises = newExercises.filter(
        (e) => !existingExerciseIds.has(e.id)
      )

      return {
        ...state,
        workoutHistory: state.workoutHistory.map((item) => {
          if (item.workoutDate === action.payload.workoutDate) {
            return {
              ...restPayload,
            }
          }
          return item
        }),
        totalTags: newTotalTags,
        exercises: [...state.exercises, ...uniqueNewExercises],
      }
    default:
      return state
  }
}

export const HistoryContext = createContext()

const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, initialState)
  const [historyState, historyDispatch] = useReducer(
    historyReducer,
    historyInitialState
  )

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      <HistoryContext.Provider value={{ historyState, historyDispatch }}>
        {children}
      </HistoryContext.Provider>
    </DataContext.Provider>
  )
}

export default DataProvider

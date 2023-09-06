import { Outlet } from "react-router-dom"
import AddCategory from "./AddCategory"
import CategoryLayout from "./CategoryLayout"
import { useContext } from "react"
import { DataContext } from "./DataProvider"

function Workout() {
  const { state } = useContext(DataContext)

  return (
    <div className="radial-background workout-conatiner">
      {state.categories.map((category, index) => (
        <CategoryLayout key={index} category={category} />
      ))}
      <AddCategory></AddCategory>
      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
  )
}

export default Workout

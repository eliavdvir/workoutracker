import { useContext } from "react"
import { DataContext } from "./DataProvider"

function AddCategory() {
  const { state, dispatch } = useContext(DataContext)

  function addNewCategory() {
    let categoryId
    do {
      categoryId = Math.floor(Math.random() * 1000) + 1
    } while (
      state.categories.some((category) => category.categoryId === categoryId)
    )

    const newCategory = {
      categoryName: "new category",
      categorySrc: "",
      categoryId,
      exercises: [],
    }

    dispatch({ type: "ADD_CATEGORY", payload: newCategory })
  }

  return (
    <div
      onClick={addNewCategory}
      className="category-div-closed radial-background"
    >
      <img
        className="neon-border-top"
        src="https://i.imgur.com/a5Qfaje.png"
        alt=""
      />
      <div className="flexbox add-conatiner">
        <img
          src="https://i.imgur.com/52KqLVj.png"
          alt="Workout"
          className="add-category-image"
        />
        <p className="text1 add-category-text">add category</p>
      </div>
      <img
        className="neon-border-bottom"
        src="https://i.imgur.com/a5Qfaje.png"
        alt=""
      />
    </div>
  )
}

export default AddCategory

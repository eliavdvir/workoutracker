import { useEffect, useRef, useContext } from "react"
import { DataContext } from "./DataProvider"

function CategoryInputs({ setCategoryInputsOpen, category }) {
  const { dispatch } = useContext(DataContext)

  const containerRef = useRef(null)
  const nameRef = useRef(null)
  const srcRef = useRef(null)

  function closeDiv() {
    setCategoryInputsOpen(false)
  }

  function confirmChanges() {
    const updatedCategory = {
      ...category,
      categoryName: nameRef.current.value,
      categorySrc: srcRef.current.value,
    }
    dispatch({
      type: "UPDATE_CATEGORY",
      payload: {
        categoryId: category.categoryId,
        updatedCategory: updatedCategory,
      },
    })
    closeDiv()
  }

  useEffect(() => {
    nameRef.current.value = category.categoryName
    srcRef.current.value = category.categorySrc
    nameRef.current.focus()

    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeDiv()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  return (
    <>
      <div className="category-input">
        <div ref={containerRef} className="category-input-container">
          <div className="exercise-input-inputs-container">
            <input
              ref={nameRef}
              type="text"
              className="exercise-input-name text2"
              placeholder="category name"
            />
            <input
              ref={srcRef}
              type="text"
              className="exercise-input-details text2"
              placeholder="icon source"
            />
          </div>

          <div className="exercise-input-cancel text2" onClick={closeDiv}>
            cancel
          </div>
          <div
            className="exercise-input-confirm text2"
            onClick={confirmChanges}
          >
            confirm
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryInputs

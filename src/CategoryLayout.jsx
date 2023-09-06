import { useRef, useState } from "react"
import CategoryClosed from "./CategoryClosed"
import CategoryOpened from "./CategoryOpened"
import CategoryInputs from "./CategoryInputs"

function CategoryLayout({ category }) {
  const [isOpened, setIsOpened] = useState(false)
  const [categoryInputsOpen, setCategoryInputsOpen] = useState(false)
  const layoutRef = useRef()
  const [layoutHeight, setLayoutHeight] = useState("33%")

  return (
    <div
      ref={layoutRef}
      style={{ height: layoutHeight }}
      className={
        isOpened
          ? "radial-background category-div-opened animate-height"
          : "radial-background category-div-closed animate-height"
      }
    >
      {categoryInputsOpen && (
        <CategoryInputs
          setCategoryInputsOpen={setCategoryInputsOpen}
          category={category}
        />
      )}

      <img
        className="neon-border-top"
        src="https://i.imgur.com/a5Qfaje.png"
        alt=""
      />
      {isOpened ? (
        <CategoryOpened
          setIsOpened={setIsOpened}
          setLayoutHeight={setLayoutHeight}
          category={category}
        />
      ) : (
        <CategoryClosed
          setIsOpened={setIsOpened}
          setLayoutHeight={setLayoutHeight}
          category={category}
        />
      )}
      <div className="category-state-indicator"></div>
      <div
        onClick={() => setCategoryInputsOpen(true)}
        className="flexbox category-name"
      >
        {category.categorySrc !== "" && (
          <img className="category-image" src={category.categorySrc} alt="" />
        )}

        <h1 className="text1 category-name-text">{category.categoryName}</h1>
      </div>
    </div>
  )
}

export default CategoryLayout

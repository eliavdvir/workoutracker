import { useEffect, useRef } from "react"

function RemoveCategory({ categoryRemover, setRemoveDivOpen }) {
  const containerRef = useRef(null)
  function closeDiv() {
    setRemoveDivOpen(false)
  }

  useEffect(() => {
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
    <div className="category-input">
      <div ref={containerRef} className="category-input-container text2">
        <span> Are you sure you want to remove this category?</span>

        <div className="weight-input-cancel text2" onClick={closeDiv}>
          cancel
        </div>
        <div
          className="weight-input-confirm text2"
          onClick={() => {
            categoryRemover()
            closeDiv()
          }}
        >
          confirm
        </div>
      </div>
    </div>
  )
}

export default RemoveCategory

import { useEffect, useRef, useState } from "react"
function WeightInput({ setWeightInputOpen, setChosenSet, chosenSet }) {
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const [weight, setWeight] = useState(0)

  function closeDiv() {
    setWeightInputOpen(false)
  }

  useEffect(() => {
    setWeight(chosenSet.weight)
    inputRef.current.focus()
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
    <div className="weight-input">
      <div ref={containerRef} className="weight-input-container">
        <input
          ref={inputRef}
          type="number"
          className="weight-input-number text3"
          value={weight}
          onChange={(e) => {
            const val = e.target.value.includes(".")
              ? parseFloat(e.target.value)
              : parseInt(e.target.value, 10)
            setWeight(isNaN(val) ? "" : val.toString())
          }}
        />
        <div className="weight-input-cancel text2" onClick={closeDiv}>
          cancel
        </div>
        <div
          className="weight-input-confirm text2"
          onClick={() => {
            const finalWeight = weight === "" ? 0 : parseFloat(weight)
            setChosenSet((oldSet) => {
              return {
                ...oldSet,
                weight: finalWeight,
              }
            })
            closeDiv()
          }}
        >
          confirm
        </div>
      </div>
    </div>
  )
}

export default WeightInput

import { useEffect, useLayoutEffect, useState } from "react"

function SetInExercise({ set, chosenSet }) {
  const [isUrl, setisUrl] = useState(false)
  const [url, setUrl] = useState("")

  useLayoutEffect(() => {
    if (set.isWeights) {
      setUrl("https://i.imgur.com/7ji48DR.png")
      setisUrl(true)
    } else if (set.isBand) {
      if (set.band === "yellow") {
        setUrl("https://i.imgur.com/WXy5Rgx.png")
      } else if (set.band === "red") {
        setUrl("https://i.imgur.com/QuANDiZ.png")
      } else if (set.band === "black") {
        setUrl("https://i.imgur.com/Bmlxp5D.png")
      } else {
        setisUrl(false)
        return
      }
      setisUrl(true)
    } else {
      setisUrl(false)
    }
  }, [set])

  return (
    <div className="exercise-set-container">
      {isUrl && (
        <div className="exercise-set-extras-container">
          <img
            className={
              url === "https://i.imgur.com/7ji48DR.png"
                ? "set-extras-img"
                : "set-extras-img-band"
            }
            style={{ top: "-30%" }}
            src={url}
          />
          {url === "https://i.imgur.com/7ji48DR.png" && (
            <>
              <span className="exercise-set-extras-weight-text text3">
                {set.isWeights ? set.weight : null}
              </span>
              <span className="exercise-set-extras-weight-text-type text3">
                {set.isKG ? "KG" : "lbs"}
              </span>
            </>
          )}
        </div>
      )}

      <div
        className={
          chosenSet === set.setId
            ? "text3 exercise-set-reps chosen-set"
            : "text3 exercise-set-reps"
        }
      >
        {set.reps}
      </div>
    </div>
  )
}

export default SetInExercise

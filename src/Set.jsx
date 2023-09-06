import { useLayoutEffect, useState } from "react"

function Set({ set }) {
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
      }
      setisUrl(true)
    } else {
      setisUrl(false)
    }
  }, [set])

  return (
    <div className="set-container">
      {isUrl && (
        <div className="set-extras-container">
          <img
            className={
              url === "https://i.imgur.com/7ji48DR.png"
                ? "set-extras-img"
                : "set-extras-img-band"
            }
            src={url}
          />
          {url === "https://i.imgur.com/7ji48DR.png" && (
            <>
              <span className="set-extras-weight-text text3">
                {set.isWeights ? set.weight : null}
              </span>
              <span className="set-extras-weight-text-type text3">
                {set.isKG ? "KG" : "lbs"}
              </span>
            </>
          )}
        </div>
      )}

      <div className="text3 set-reps">{set.reps}</div>
    </div>
  )
}

export default Set

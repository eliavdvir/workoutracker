import { useEffect, useRef, useState } from "react"
import { useContext } from "react"
import { DataContext } from "./DataProvider"
import { HistoryContext } from "./DataProvider"

function DataExporter({ setExportIsChosen }) {
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const [copyText, setCopyText] = useState("copy")
  const { state } = useContext(DataContext)
  const { historyState } = useContext(HistoryContext)
  const [exportString, setExportString] = useState("")

  function closeDiv() {
    setExportIsChosen(false)
  }

  const copyToClipboard = () => {
    const input = inputRef.current
    navigator.clipboard
      .writeText(input.value)
      .then(() => {
        console.log("Text successfully copied")
        setCopyText("copied!")
      })
      .catch((err) => {
        setCopyText("error, try again later")
        setTimeout(() => {
          setCopyText("copy!")
        }, 3000)
      })
  }

  useEffect(() => {
    const stringifiedHistoryState = JSON.stringify(historyState)
    setExportString(stringifiedHistoryState)

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
    <div className="exporter-input">
      <div ref={containerRef} className="exporter-input-container">
        <textarea
          ref={inputRef}
          type="text"
          className="exporter-input-text text2"
          value={exportString}
          readOnly={true}
        />
        <div className="exporter-input-cancel text2" onClick={closeDiv}>
          close
        </div>
        <div className="exporter-input-confirm text2" onClick={copyToClipboard}>
          <img src="https://i.imgur.com/hqXJHRi.png" alt="copy text" />
          {copyText}
        </div>
      </div>
    </div>
  )
}

export default DataExporter

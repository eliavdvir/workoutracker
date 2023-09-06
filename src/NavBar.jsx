import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import DataExporter from "./DataExporter"
import WorkoutInputs from "./WorkoutInputs"

function NavBar() {
  const [historyIsChosen, setHistoryIsChosen] = useState(false)
  const [currentIsChosen, setCurrentIsChosen] = useState(false)
  const [exportIsChosen, setExportIsChosen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  function setChosen(chosen) {
    if (chosen === "History") {
      setHistoryIsChosen(true)
      setCurrentIsChosen(false)
      setExportIsChosen(false)
    } else if (chosen === "Current") {
      setHistoryIsChosen(false)
      setCurrentIsChosen(true)
      setExportIsChosen(false)
    } else if (chosen === "Export") {
      setHistoryIsChosen(false)
      setCurrentIsChosen(false)
      setExportIsChosen(true)
    }
  }
  useEffect(() => {
    if (exportIsChosen) return
    if (location.pathname.includes("workout")) {
      setChosen("Current")
    } else if (location.pathname.includes("profile")) {
      setChosen("History")
    }
  }, [location, exportIsChosen])

  function changeRoute(route) {
    navigate(route)
  }
  return (
    <>
      {exportIsChosen && (
        <WorkoutInputs setExportIsChosen={setExportIsChosen} />
      )}
      <Outlet />
      <div className="navbar-container">
        <div
          className="history-container"
          onClick={() => {
            changeRoute("/profile")
          }}
        >
          <svg
            className={historyIsChosen ? "chosen-navbar" : ""}
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 126 126"
            fill="none"
          >
            <path
              d="M63 110.25C50.925 110.25 40.4023 106.246 31.4317 98.238C22.4612 90.23 17.3215 80.234 16.0125 68.25H26.775C28 77.35 32.0478 84.875 38.9183 90.825C45.7888 96.775 53.816 99.75 63 99.75C73.2375 99.75 81.9227 96.1835 89.0557 89.0505C96.1887 81.9175 99.7535 73.234 99.75 63C99.75 52.7625 96.1835 44.0773 89.0505 36.9443C81.9175 29.8113 73.234 26.2465 63 26.25C56.9625 26.25 51.3187 27.65 46.0687 30.45C40.8187 33.25 36.4 37.1 32.8125 42H47.25V52.5H15.75V21H26.25V33.3375C30.7125 27.7375 36.1602 23.4062 42.5932 20.3438C49.0262 17.2813 55.8285 15.75 63 15.75C69.5625 15.75 75.7102 16.9978 81.4432 19.4933C87.1762 21.9888 92.1638 25.3558 96.4058 29.5943C100.648 33.8398 104.017 38.8273 106.512 44.5568C109.008 50.2863 110.253 56.434 110.25 63C110.25 69.5625 109.002 75.7102 106.507 81.4432C104.011 87.1762 100.644 92.1638 96.4058 96.4058C92.1603 100.648 87.1727 104.017 81.4432 106.512C75.7137 109.008 69.566 110.253 63 110.25ZM77.7 85.05L57.75 65.1V36.75H68.25V60.9L85.05 77.7L77.7 85.05Z"
              fill={historyIsChosen ? "#C3E8FF" : "#D3D3D3"}
            />
          </svg>
        </div>
        <div
          className="current-workout-container"
          onClick={() => {
            changeRoute("/workout")
          }}
        >
          <svg
            className={currentIsChosen ? "chosen-navbar" : ""}
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 141 141"
            fill="none"
          >
            <path
              d="M70.5 94C83.4787 94 94 83.4787 94 70.5C94 57.5213 83.4787 47 70.5 47C57.5213 47 47 57.5213 47 70.5C47 83.4787 57.5213 94 70.5 94Z"
              fill={currentIsChosen ? "#C3E8FF" : "#D3D3D3"}
            />
            <path
              d="M76.375 23.9054V11.75H64.625V23.9054C54.2868 25.2254 44.6792 29.94 37.3096 37.3096C29.94 44.6792 25.2254 54.2868 23.9054 64.625H11.75V76.375H23.9054C25.2234 86.714 29.9375 96.3226 37.3074 103.693C44.6774 111.063 54.286 115.777 64.625 117.095V129.25H76.375V117.095C86.7144 115.778 96.3236 111.064 103.694 103.694C111.064 96.3236 115.778 86.7144 117.095 76.375H129.25V64.625H117.095C115.777 54.286 111.063 44.6774 103.693 37.3074C96.3226 29.9375 86.714 25.2234 76.375 23.9054ZM70.5 105.75C51.0596 105.75 35.25 89.9404 35.25 70.5C35.25 51.0596 51.0596 35.25 70.5 35.25C89.9404 35.25 105.75 51.0596 105.75 70.5C105.75 89.9404 89.9404 105.75 70.5 105.75Z"
              fill={currentIsChosen ? "#C3E8FF" : "#D3D3D3"}
            />
          </svg>
        </div>
        <div
          className="export-data-container"
          onClick={() => {
            setChosen("Export")
          }}
        >
          {" "}
          <svg
            className={exportIsChosen ? "chosen-navbar" : ""}
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 256 256"
            fill="none"
          >
            <path
              d="M216 112V208C216 212.243 214.314 216.313 211.314 219.314C208.313 222.314 204.243 224 200 224H56C51.7565 224 47.6869 222.314 44.6863 219.314C41.6857 216.313 40 212.243 40 208V112C40 107.756 41.6857 103.687 44.6863 100.686C47.6869 97.6857 51.7565 95.9999 56 95.9999H80C82.1217 95.9999 84.1566 96.8428 85.6569 98.3431C87.1571 99.8434 88 101.878 88 104C88 106.122 87.1571 108.157 85.6569 109.657C84.1566 111.157 82.1217 112 80 112H56V208H200V112H176C173.878 112 171.843 111.157 170.343 109.657C168.843 108.157 168 106.122 168 104C168 101.878 168.843 99.8434 170.343 98.3431C171.843 96.8428 173.878 95.9999 176 95.9999H200C204.243 95.9999 208.313 97.6857 211.314 100.686C214.314 103.687 216 107.756 216 112ZM93.66 69.66L120 43.3099V136C120 138.122 120.843 140.157 122.343 141.657C123.843 143.157 125.878 144 128 144C130.122 144 132.157 143.157 133.657 141.657C135.157 140.157 136 138.122 136 136V43.3099L162.34 69.66C163.841 71.1611 165.877 72.0044 168 72.0044C170.123 72.0044 172.159 71.1611 173.66 69.66C175.161 68.1588 176.004 66.1229 176.004 63.9999C176.004 61.877 175.161 59.8411 173.66 58.3399L133.66 18.3399C132.917 17.5961 132.035 17.0061 131.064 16.6035C130.092 16.2009 129.051 15.9937 128 15.9937C126.949 15.9937 125.908 16.2009 124.936 16.6035C123.965 17.0061 123.083 17.5961 122.34 18.3399L82.34 58.3399C80.8389 59.8411 79.9956 61.877 79.9956 63.9999C79.9956 66.1229 80.8389 68.1588 82.34 69.6599C83.8411 71.1611 85.8771 72.0044 88 72.0044C90.1229 72.0044 92.1589 71.1611 93.66 69.66Z"
              fill={exportIsChosen ? "#C3E8FF" : "#D3D3D3"}
            />
          </svg>
        </div>
      </div>
    </>
  )
}

export default NavBar

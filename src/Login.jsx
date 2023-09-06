import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LoadData from "./LoadData"

function Login() {
  const navigate = useNavigate()
  const [loadDataOpen, setLoadDataOpen] = useState(false)

  function navigator(path) {
    navigate(path)
  }
  return (
    <div className="radial-background workout-conatiner">
      <div className="quick-start-button" onClick={() => navigator("/workout")}>
        <img
          src="https://i.imgur.com/IRnqi8g.png"
          alt=""
          className="quick-start-img"
        />
        <span className="text1">Quick Start</span>
      </div>

      <div className="load-data-button" onClick={() => setLoadDataOpen(true)}>
        <img
          src="https://i.imgur.com/IRnqi8g.png"
          alt=""
          className="quick-start-img"
        />
        <span className="text1">Load data</span>
      </div>
      {loadDataOpen && (
        <LoadData setLoadDataOpen={setLoadDataOpen} navigator={navigator} />
      )}
    </div>
  )
}

export default Login

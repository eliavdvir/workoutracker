import { Navigate, createHashRouter } from "react-router-dom"
import Login from "./Login"
import Workout from "./Workout"
import Exercise from "./Exercise"
import WildCard from "./Wildcard"
import NavBar from "./NavBar"
import DataExporter from "./DataExporter"
import Profile from "./Profile"

export const router = createHashRouter([
  {
    element: <NavBar />,
    children: [
      { path: "/", element: <Navigate to={"/login"} /> },
      { path: "/login", element: <Login></Login> },
      {
        path: "/workout",
        element: <Workout></Workout>,
        children: [{ path: ":exerciseId", element: <Exercise /> }],
      },
      {
        path: "*",
        element: <WildCard />,
      },
      { path: "/profile", element: <Profile /> },
    ],
  },
])

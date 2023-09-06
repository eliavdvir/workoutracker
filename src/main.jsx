import React from "react"
import ReactDOM from "react-dom/client"
import { router } from "./router.jsx"
import { RouterProvider } from "react-router-dom"
import "./styles.css"
import DataProvider from "./DataProvider.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DataProvider>
      <RouterProvider router={router}></RouterProvider>
    </DataProvider>
  </React.StrictMode>
)

import React from "react";
import { createBrowserRouter,RouterProvider} from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ToDoList from "./components/ToDoList/ToDoList";

let routers = createBrowserRouter([
  {path:'login',element:<Login/>},
  {path:'todolist',element:<ToDoList/>},
  {index:true,element:<Register/>}
])
function App() {

  
    return <RouterProvider router= {routers}/>
  
}
export default App;

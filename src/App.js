import React, { useState } from "react";
import { createBrowserRouter,RouterProvider} from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ToDoList from "./components/ToDoList/ToDoList";
import {jwtDecode} from 'jwt-decode';  


function App() {
  const [userData,setUserData]=useState(null);
  function saveUserData() {
    let encodedToken = localStorage.getItem('userToken');
    if (encodedToken) {
      let decodedToken = jwtDecode(encodedToken);
      console.log(decodedToken);
      setUserData(decodedToken); 
    }
  }


  let routers = createBrowserRouter([
    {path:'login',element:<Login saveUserData={saveUserData}/>},
    {path:'todolist',element:<ToDoList/>},
    {index:true,element:<Register/>}
  ])
  
    return <RouterProvider router= {routers}/>
  
}
export default App;

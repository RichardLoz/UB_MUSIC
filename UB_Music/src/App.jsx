<<<<<<< HEAD
//import './App.css'
// import Home from './screens/home'
import Login from './components/Login.jsx'
=======
import { useState } from 'react'
// Modulos de Firebase
import appFirebase from './credentials'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

const auth = getAuth(appFirebase)

import Home from './components/Home/Home'
import Login from './components/Login/Login'


import './App.css'
>>>>>>> 5ada5bd818e25783aa84f95989bd1ce2141ddeed

function App() {

  const [user, setUser] = useState(null)

  onAuthStateChanged(auth, (userFirebase)=>{
    if (userFirebase){
      setUser(userFirebase)
    }
    else
    {   
      setUser(null)
    }
  })

  return (
<<<<<<< HEAD
    <>
    <Login/>
     {/* <Home/> */}
    </>
=======
    <div>
      {/* {user ? <Home userEmail = {user.email}/> : <Login/>} */}
      <Login/>
    </div>
>>>>>>> 5ada5bd818e25783aa84f95989bd1ce2141ddeed
  )
}

export default App

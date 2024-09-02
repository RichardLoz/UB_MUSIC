import { useState } from 'react'
// Modulos de Firebase
import appFirebase from './credentials'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

const auth = getAuth(appFirebase)

import Home from './components/Home/Home'
import Login from './components/Login/Login'


import './App.css'

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
    <div>
      {/* {user ? <Home userEmail = {user.email}/> : <Login/>} */}
      <Login/>
    </div>
  )
}

export default App

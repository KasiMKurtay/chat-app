import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import ProfilePage from './pages/ProfilePage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'

import {Loader} from "lucide-react"


const App = () => {
  
  const {checkAuth, isCheckingAuth, authUser} = useAuthStore();

  useEffect(()=> {
    checkAuth()
  },[checkAuth])

  console.log({authUser});

  if(isCheckingAuth && !authUser) return(
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div>
      <Navbar />

    <Routes>
     <Route path='/' element={authUser ? <HomePage /> : <Navigate to ="/login" />}/> {/* Kullanıcı giriş yaptıysa AnaSayfaya, yapmadıysa LoginPage'e yönlendiriyoruz*/}
     <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/"/>}/>{/*Giriş yapmamışsa SignUpPage'e yapmışsa AnaSayfaya */}
     <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />}/> {/*Giriş ypamamışsa LoginPage yapmışsa Ana sayfaya yönlendiriyoruz */}
     <Route path='/settings' element={ <SettingsPage />}/>
     <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to ="/login" />}/> {/*Kullanıcı giriş yapmışsa profil'e yönlendirir eğer yapmamışsa LoginPage'e yönlendirir */}
    </Routes>
    </div>
  )
}

export default App
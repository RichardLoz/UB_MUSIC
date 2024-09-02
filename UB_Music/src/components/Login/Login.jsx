import React from 'react'
import img_login from '../../assets/images/login_ub.jpeg'

const Login = () => {
  return (
    <div className='w-full h-screen flex items-start'>
        <div className='relative w-1/2 h-full flex flex-col'>
            <div className='absolute top-[25%] left-[10%] flex flex-col'>
                <h1 className='text-4xl text-white font-bold my-4'>La musica te inspira</h1>
                <p className='text-xl text-white font-normal'>UB Music es la solucion</p>
            </div>
            <img src={img_login} className='w-full h-full object-cover' />
        </div>
        <div className='w-1/2 h-full bg-white flex flex-col p-10'>
            <h1 className='text-base text-black'>Bienvenidos</h1>
        </div>
    </div>
  )
}

export default Login

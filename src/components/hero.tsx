import React from 'react'
import Link from 'next/link'

function Hero() {
  return (
    <div className=' herosection flex '>
<div className="left">
  <img src="/heroLeft.png" alt="" />
</div>
<div className="center">
    <div className="flex justify-center mt-10"> 
      <div className="head flex flex-col items-center">
        <img src="/logo.png" className="justify-center" alt="Logo" />
        <p className='text-2xl font-bold mt-3'>Bento</p>
      </div>
    </div>

    <div className="mid flex flex-col items-center text-center">
      <p className='text-6xl font-bold mt-10'>A Link in Bio.</p>
      <p className='text-6xl font-bold'>But Rich and Beautiful.</p>

      <p className='midLastText text-2xl mt-10'>Your personal page to show everything you are and create.</p>

      <Link href="/signup" className='createBentoBtn  mt-16 text-xl font-semibold'>Create Your Bento</Link>
      <Link href="/login" className='  mt-5 text-sm font-normal'>Login</Link>
    </div>
    </div>
    <div className="right">
    <img src="/heroRight1.png" alt="" />
    </div>
    </div>
  )
}

export default Hero

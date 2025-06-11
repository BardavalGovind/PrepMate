import React from 'react'
import Hero from '../components/Hero';
import Footer from '../components/Footer';


const Home = () => {
  return (
    <div>
      <div className='h-heightWithoutNavbar'>
        <Hero/>
        <Footer/>
      </div>
    </div>
  )
}

export default Home;
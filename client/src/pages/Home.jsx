import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import HowItWorks from '../components/HowItWorks'



const Home = () => {
    return (
        <div>
            <Header />
            <SpecialityMenu />
            <HowItWorks />
            <TopDoctors />
            <Banner />
        </div>
    )
}

export default Home
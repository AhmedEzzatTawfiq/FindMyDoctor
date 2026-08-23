import React from 'react'
import Header from '../../components/ui/Header'
import SpecialityMenu from '../../components/ui/SpecialityMenu'
import TopDoctors from '../../components/ui/TopDoctors'
import Banner from '../../components/ui/Banner'
import HowItWorks from '../../components/ui/HowItWorks'

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

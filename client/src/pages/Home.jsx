import React from 'react'
import Hero from '../components/Home/Hero'
import Projects from '../components/Home/Projects'
import FeaturedProjects from '../components/Home/featuredProjects'
import Banner from '../components/Home/Banner'
import OngoingProjects from '../components/Home/OngoingProjects'

export default function Home() {
  return (
    <>
     <Hero/> 
     <Projects/>
     <FeaturedProjects/>
     <Banner/>
     <OngoingProjects/>
    </>
  )
}

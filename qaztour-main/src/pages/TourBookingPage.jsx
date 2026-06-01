// src/pages/TourBookingPage.jsx

import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TourBookingPageContent from '../components/TourBookingPageContent '
import { useParams } from 'react-router-dom' // ✅ useParams импортталған

const TourBookingPage = () => {
  // ✅ URL-ден параметрлерді дұрыс алу
  // Есіңізде болсын, маршрутта /tour-booking-details/:id/:numberOfPeople
  // болса, онда осы жерде :id дегенді 'id' деп аламыз.
  const { id, numberOfPeople } = useParams() // ✅ Параметрлерді алу

  return (
    <div>
      <Header />
      {/* ✅ TourBookingPageContent-ке id және initialSeats проптарын жіберу */}
      {/* Мұндағы 'id' - URL-ден келген id, 'initialSeats' - URL-ден келген numberOfPeople */}
      <TourBookingPageContent id={id} />
      <Footer />
    </div>
  )
}
export default TourBookingPage

import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ContactUs from './pages/ContactUs'
import GalleryPage from './pages/GalleryPage'
import './App.css'
import ToursPage from './pages/ToursPage'
import HotelBookingPage from './pages/HotelBookingPage'
import LoginPage from './pages/LoginPage'
import TourDetailPage from './pages/TourDetailPage'
import ProfilePage from './pages/ProfilePage'
// import ProviderPage from './components/Provider'
import VideoTravelPage from './pages/VideoTravelPage'
import EventsPage from './pages/EventsPage'
import EditProfilePage from './pages/EditProfilePage'
import { WeatherProvider } from './components/WeatherContext'
import { UserProvider } from './contexts/UserContext'
import CreatePost from './components/post/CreatePost'
import BlogPages from './pages/BlogPage'
import HotelListPage from './pages/HotelListPage'
import HotelDetailPage from './pages/HotelDetailPage'
import BookingRoom from './components/BookingRoom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
// import MyBooking from './components/MyBooking'
import PostDetailPage from './pages/PostDetailPage'
import PlacesPage from './pages/PlacesPage'
import PlacesDetailPage from './pages/PlacesDetailPage'
import SingleEventsPage from './pages/SingleEventPage'
import TourBookingPage from './pages/TourBookingPage'
import AIAdvisor from './components/AIAdvisor'
import BookingTourDetail from "./components/BookingTourDetail";
import MyBookingsPage from "./components/MyBookingsPage";

function App() {
  return (
    <PayPalScriptProvider
      options={{
        'client-id':
          'AWnjmGK2MGnEqDIPVkvdUvTzpNVKQJ8tv0hg-_DlQ7dbuHOfqfp-uHoeg7H-b_lZ_gmptWzB7aWhYa7V',
        currency: 'USD',
      }}
    >
      <Router>
        <UserProvider>
          <WeatherProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/auth" element={<LoginPage />} />
              <Route path="/video-travel" element={<VideoTravelPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/tour/:id" element={<TourDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<SingleEventsPage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/blogs" element={<BlogPages />} />
              <Route path="/blog-create" element={<CreatePost />} />
              <Route path="/blog/:postId" element={<PostDetailPage />} />
              <Route path="/hotels/" element={<HotelListPage />} />
              <Route path="/hotels/:id" element={<HotelDetailPage />} />
              <Route
                path="/hotel-booking/:hotelId/room/:roomId"
                element={<HotelBookingPage />}
              />
              <Route
                path="/booking-room/:bookingId"
                element={<BookingRoom />}
              />
              <Route
                path="/bookings/create/:tourId"
                element={<TourBookingPage />}
              />

              <Route path="/places/" element={<PlacesPage />} />
              <Route path="/place/:id" element={<PlacesDetailPage />} />
              <Route path="/booking-tour/:bookingId" element={<BookingTourDetail />} />
              <Route path="/my-bookings" element={<MyBookingsPage />}/>
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
            <AIAdvisor />
          </WeatherProvider>
        </UserProvider>
      </Router>
    </PayPalScriptProvider>
  )
}

export default App

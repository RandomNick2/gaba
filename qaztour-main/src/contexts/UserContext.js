import React, { createContext, useState, useEffect } from 'react'
import api from '../utils/axios'
import { useWeather } from '../components/WeatherContext' // Дұрыс импорт жолы

export const UserContext = createContext() // Атаулы экспорт
export const UserProvider = ({ children }) => {
  // Атаулы экспорт
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // useWeather хугін UserContext-те тікелей пайдалану дұрыс емес.
  // WeatherContext UserProvider-дің ішінде болуы керек, бірақ UserProvider оны импорттамауы керек.
  // Егер useWeather-ді UserContext-тің ішінде пайдаланғыңыз келсе, бұл архитектуралық мәселе.
  // Ол бір-біріне тәуелді болмауы керек.
  // Қазірше, осы қателікке байланысты useWeather импортын UserContext.js-тен алып тастаймыз.
  // Егер WeatherContext-тің деректері UserContext-ке қажет болса, оларды App.js-те біріктіріп,
  // UserProvider-ді WeatherProvider-дің ішіне орналастыру керек.
  // Немесе useWeather-ді UserContext-те емес, оны пайдаланатын компоненттерде қолдану керек.

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          const response = await api.get('/user', {
            headers: { Authorization: `Bearer ${token}` },
          })
          setUser(response.data)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

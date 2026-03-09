import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Recommendations from './pages/Recommendations'
import ProfilePage from './pages/ProfilePage'
import ClubPage from './pages/ClubPage'
import { AlertProvider } from './contexts/AlertContext'

function App() {
  return (
    <AlertProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/clubs/:clubId" element={<ClubPage />} />
        </Routes>
      </Router>
    </AlertProvider>
  )
}

export default App

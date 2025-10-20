import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { PageTransition } from './components/PageTransition'
import Header from './components/Header'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'

// Импорты страниц
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AboutSubsectionPage from './pages/AboutSubsectionPage'
import ServicesPage from './pages/ServicesPage'
import ServicesSubsectionPage from './pages/ServicesSubsectionPage'
import PerformancesPage from './pages/PerformancesPage'
import PerformancePage from './pages/PerformancePage'
import PublicationsPage from './pages/PublicationsPage'
import PublicationPage from './pages/PublicationPage'
import ContactsPage from './pages/ContactsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div>
        <ScrollToTop />
        <Header />
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/:subsection" element={<AboutSubsectionPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:subsection" element={<ServicesSubsectionPage />} />
            <Route path="/performances" element={<PerformancesPage />} />
            <Route path="/performances/:id" element={<PerformancePage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/publications/:id" element={<PublicationPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          </Routes>
        </PageTransition>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  )
}

export default App

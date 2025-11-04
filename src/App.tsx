import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { PageTransition } from './components/PageTransition'
import Header from './components/Header'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import ErrorBoundary from './components/ErrorBoundary'

// Импорты страниц
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import SubsectionPage from './pages/SubsectionPage'
import PerformancesPage from './pages/PerformancesPage'
import PerformancePage from './pages/PerformancePage'
import PublicationsPage from './pages/PublicationsPage'
import PublicationPage from './pages/PublicationPage'
import ContactsPage from './pages/ContactsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div>
          <ScrollToTop />
          <Header />
          <PageTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about/:subsection" element={<SubsectionPage type="about" />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:subsection" element={<SubsectionPage type="services" />} />
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
    </ErrorBoundary>
  )
}

export default App

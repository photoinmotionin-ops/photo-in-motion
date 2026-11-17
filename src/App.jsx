import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/common/Layout'
import Home from './pages/Home'
import Story from './pages/Story'
import Portfolio from './pages/Portfolio'
import PortfolioDetail from './pages/PortfolioDetail'; // <-- Import the new detail page
import Services from './pages/Services'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminChange from './pages/AdminChange'

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/story" element={<Layout><Story /></Layout>} />
        <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
        <Route path="/portfolio/:id" element={<Layout><PortfolioDetail /></Layout>} /> {/* <-- NEW ROUTE */}
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin_change" element={<AdminChange />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
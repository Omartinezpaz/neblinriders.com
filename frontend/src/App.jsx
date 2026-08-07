import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import AccesoRapido from './components/AccesoRapido/AccesoRapido'
import CTAEnjambre from './components/Enjambre/CTAEnjambre'
import ValueProposition from './components/Bees/ValueProposition'
import NoticiasList from './components/Noticias/NoticiasList'
import RecursosUtiles from './components/Recursos/RecursosUtiles'
import EspacioPublicitario from './components/Publicidad/EspacioPublicitario'
import MiembrosActivos from './components/Miembros/MiembrosActivos'
import Footer from './components/Footer/Footer'
import AuthModal from './components/Auth/AuthModal'
import PerfilBikerModal from './components/Auth/PerfilBikerModal'
import ArticleDetail from './components/Noticias/ArticleDetail'
import CategoriaDetail from './components/Categoria/CategoriaDetail'
import ForoBiker from './components/Foro/ForoBiker'
import ForoTemaDetalle from './components/Foro/ForoTemaDetalle'
import GangaBiker from './components/GangaBiker/GangaBiker'
import VideosBiker from './components/Videos/VideosBiker'
import PoliticaPrivacidad from './components/Legal/PoliticaPrivacidad'
import Nosotros from './components/Nosotros/Nosotros'

function Home({ setIsAuthModalOpen, setIsPerfilModalOpen, user }) {
  return (
    <>
      <Hero 
        user={user} 
        onRegisterClick={() => setIsAuthModalOpen(true)} 
      />
      <MiembrosActivos />
      <Features />
      <AccesoRapido />
      <CTAEnjambre 
        user={user} 
        onOpenAuthModal={() => setIsAuthModalOpen(true)} 
        onOpenPerfilModal={() => setIsPerfilModalOpen(true)} 
      />
      <ValueProposition />
      <NoticiasList />
      <RecursosUtiles />
      <EspacioPublicitario />
    </>
  );
}

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.pathname === '/login';
  });
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('nr_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('nr_token');
    localStorage.removeItem('nr_user');
    setUser(null);
    window.location.reload();
  };

  return (
    <Router>
      <Header user={user} onLoginClick={() => setIsAuthModalOpen(true)} onLogout={handleLogout} />
      <main className="page-content">
        <Routes>
          <Route path="/" element={
            <Home 
              setIsAuthModalOpen={setIsAuthModalOpen} 
              setIsPerfilModalOpen={setIsPerfilModalOpen}
              user={user} 
            />
          } />
          <Route path="/articulo/:slug" element={<ArticleDetail />} />
          <Route path="/categoria/:categoryKey" element={<CategoriaDetail />} />
          <Route path="/foro" element={<ForoBiker user={user} />} />
          <Route path="/foro/:temaId" element={<ForoTemaDetalle user={user} />} />
          <Route path="/gangas" element={<GangaBiker user={user} />} />
          <Route path="/videos" element={<VideosBiker />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <PerfilBikerModal 
        isOpen={isPerfilModalOpen} 
        onClose={() => setIsPerfilModalOpen(false)} 
        user={user}
        onSuccess={(updatedUser) => setUser(updatedUser)}
      />
    </Router>
  )
}

export default App

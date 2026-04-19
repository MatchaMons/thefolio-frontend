import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import ProtectedRoute from "./components/ProtectedRoute";

// Portfolio pages
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TrainingPage from "./pages/TrainingPage";
import QuestPage from "./pages/QuestPage";
import BossGhostPage from "./pages/BossGhostPage";
import BossCodePage from "./pages/BossCodePage";
import BossHackerPage from "./pages/BossHackerPage";

// System pages
import FeedPage from "./pages/FeedPage";
import PostPage from "./pages/PostPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import AdminPage from "./pages/AdminPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Debugging log (Now inside the component)
  console.log("Current User Role:", user?.role);
  
  const isSplashPage = location.pathname === "/" || location.pathname.startsWith("/boss");

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p className="comic-button-label">LOADING PLAYER DATA...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      {!isSplashPage && <Navbar />}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Portfolio Pages */}
          <Route path="/" element={<SplashPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/training" element={<TrainingPage />} />

          {/* Guild Board / Community Feed */}
          <Route path="/feed" element={<FeedPage />} />

          {/* Logic check for Quest Hub */}
          <Route 
            path="/quest" 
            element={user ? <QuestPage /> : <Navigate to="/login" />} 
          />

          {/* Boss Battles */}
          <Route path="/boss/ghost" element={<BossGhostPage />} />
          <Route path="/boss/code" element={<BossCodePage />} />
          <Route path="/boss/hacker" element={<BossHackerPage />} />

          {/* Individual Blog Posts */}
          <Route path="/posts/:id" element={<PostPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path="/edit-post/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AnalyticsPage /></ProtectedRoute>} />
        </Routes>
      </main>

      {!isSplashPage && <Footer />}
    </div>
  );
}

export default App;
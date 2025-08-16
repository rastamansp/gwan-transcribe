import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Theme, Box } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Import pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import TranscriptionPage from './pages/TranscriptionPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';

// Import components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <Box style={{ minHeight: '100vh' }}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Protected routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <DashboardPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/upload"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <UploadPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transcription/:id"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <TranscriptionPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <HistoryPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ProfilePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Default redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </Theme>
    </QueryClientProvider>
  );
}

export default App;

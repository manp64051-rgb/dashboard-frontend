import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import TTS from './Pages/TTS'; 
import STT from './Pages/STT';
import AuthPage from "./Pages/Login"; 
import PrivateRoute from "./Pages/PrivateRoute";
import SpeechTranslate from "./Pages/SpeechTranslate";
import "./App.css"
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import.meta.env.VITE_API_URL

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AuthPage />} />

        {/* Private Routes */}
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }/>

        <Route path="/TTS" element={
          <PrivateRoute>
            <TTS />
          </PrivateRoute>
        }/>

        <Route path="/STT" element={
          <PrivateRoute>
            <STT />
          </PrivateRoute>
        }/>

        <Route path="/SpeechTranslate" element={
          <PrivateRoute>
            <SpeechTranslate />
          </PrivateRoute>
        }/>

        <Route path="/admin/*" element={
          <PrivateRoute
           adminOnly={true}
          >
          <AdminDashboard />
          </PrivateRoute>
        } />




        {/* Catch all unknown URLs */}
        <Route path="*" element={<PrivateRoute><Home /></PrivateRoute>} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App;

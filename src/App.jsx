import Chatbot from './components/Chatbot'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/:id" element={<Chatbot />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

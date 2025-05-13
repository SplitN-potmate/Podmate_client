import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import OAuthRedirect from './components/OAuthRedirect';

function App() {
    return (
        <div className="viewport">
            <div className="mobile-frame">
                <BrowserRouter>
                    <Routes>
                        <Route path="/oauth/redirect" element={<OAuthRedirect />} />
                        <Route path="/" element={<LoginPage />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;

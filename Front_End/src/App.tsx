import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RideRequestForm from './pages/RideRequestForm';
import RideOptions from './pages/RideOptions';
import RideHistory from './pages/HistoryRides';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<RideRequestForm />} />
                    <Route path="/options" element={<RideOptions />} />
                    <Route path="/HistoryRides" element={<RideHistory />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
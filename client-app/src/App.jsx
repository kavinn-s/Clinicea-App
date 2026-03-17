import { useState } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import BookingWizard from './components/BookingWizard';
import './booking.css';

function App() {
  const [isBooking, setIsBooking] = useState(false);

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        {!isBooking ? (
          <LandingPage onStartBooking={() => setIsBooking(true)} />
        ) : (
          <BookingWizard onBackToLanding={() => setIsBooking(false)} />
        )}
      </main>
    </div>
  );
}

export default App;

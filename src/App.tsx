import { useQueryCall, useUpdateCall } from '@ic-reactor/react';
import './App.css';
import { sha256 } from 'js-sha256';
import { createActor, canisterId } from './declarations/backend';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import InternetIdentityLogin from './pages/InternetIdentityLogin';
import MainMenu from './pages/menu';
import SetupUsername from './pages/SetupUsername';

// Create the actor instance
const backend = createActor(canisterId);

function App() {
  const { data: count, refetch } = useQueryCall({
    functionName: 'get',
  });

  const { call: increment, loading } = useUpdateCall({
    functionName: 'inc',
    onSuccess: refetch,
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/internetidentitylogin" element={<InternetIdentityLogin />} />
        <Route path="/setup-username" element={<SetupUsername />} />
        <Route path="/MainMenu" element={<MainMenu />} />
      </Routes>
    </Router>
  );
}

export default App;

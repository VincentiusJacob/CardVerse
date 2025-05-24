import { useQueryCall, useUpdateCall } from '@ic-reactor/react';
import './App.css';
import { sha256 } from 'js-sha256';
import { createActor, canisterId } from './declarations/backend';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Login from './pages/login';
import Register from './pages/register';

// Create the actor instance
const backend = createActor(canisterId);

async function handleRegister(username: string, rawPassword: string) {
  const passwordHash = sha256(rawPassword);
  const response = await backend.register(username, passwordHash);
  console.log(response);
}

async function handleLogin(username: string, rawPassword: string) {
  const passwordHash = sha256(rawPassword);
  const response = await backend.login(username, passwordHash);
  console.log(response);
}

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
        <Route path="/Register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useQueryCall, useUpdateCall } from '@ic-reactor/react';
import './App.css';
import { sha256 } from "js-sha256";
import { backend } from "./declarations/backend";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';

async function handleSignUp(username: string, rawPassword: string) {
  const passwordHash = sha256(rawPassword);
  const response = await backend.signUp(username, passwordHash);
  console.log(response);
}

async function handleSignIn(username: string, rawPassword: string) {
  const passwordHash = sha256(rawPassword);
  const response = await backend.signIn(username, passwordHash);
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
      </Routes>
    </Router>
  );
}

export default App;

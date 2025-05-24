// src/hooks/useInternetIdentity.ts
import { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as backend_idl, canisterId as backend_id } from "../declarations/backend";
import { AuthClient } from "@dfinity/auth-client";

export default function useInternetIdentity() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [backendActor, setBackendActor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const identityProvider = isLocal
  ? 'http://localhost:4943' // local replica II tanpa query param
  : 'https://identity.ic0.app'; // production II

  const host = isLocal ? "http://127.0.0.1:4943" : "https://ic0.app";


  useEffect(() => {
    async function initAuth() {
      try {
        const auth = await AuthClient.create();
        setAuthClient(auth);

        const authenticated = await auth.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const identity = auth.getIdentity();
          setPrincipal(identity.getPrincipal().toText());

          const agent = new HttpAgent({ identity, host });
          if (isLocal) await agent.fetchRootKey();

          const actor = Actor.createActor(backend_idl, {
            agent,
            canisterId: backend_id,
          });

          setBackendActor(actor);
        }
      } catch (err) {
        setError("Failed to initialize authentication");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  async function connect() {
    if (!authClient) return;
    try {
      await authClient.login({
        identityProvider,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          setPrincipal(identity.getPrincipal().toText());

          const agent = new HttpAgent({ identity, host });
          if (isLocal) await agent.fetchRootKey();

          const actor = Actor.createActor(backend_idl, {
            agent,
            canisterId: backend_id,
          });

          setBackendActor(actor);
          setIsAuthenticated(true);
        },
      });
    } catch (err) {
      setError("Failed to connect");
      console.error(err);
    }
  }

  async function disconnect() {
    if (!authClient) return;
    try {
      await authClient.logout();
      setPrincipal(null);
      setBackendActor(null);
      setIsAuthenticated(false);
      window.location.reload();
    } catch (err) {
      setError("Failed to disconnect");
      console.error(err);
    }
  }

  async function checkUser() {
    if (!backendActor) return null;
    return await backendActor.getUserProfile();
  }

  async function createUser(username: string) {
    if (!backendActor) return null;
    return await backendActor.createUserProfile(username);
  }

  return {
    isAuthenticated,
    principal,
    actor: backendActor,
    loading,
    error,
    connect,
    disconnect,
    checkUser,
    createUser,
  };
}

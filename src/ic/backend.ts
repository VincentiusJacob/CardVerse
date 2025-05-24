import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as backend_idl, canisterId as backend_id } from "../declarations/backend";

const agent = new HttpAgent({
  host: "http://127.0.0.1:4943", // lokal replica
});

// Untuk develop lokal, perlu fetch root key
agent.fetchRootKey();

export const backend = Actor.createActor(backend_idl, {
  agent,
  canisterId: backend_id,
});

import { writable, get } from 'svelte/store';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  // Add any other user properties you need
}

interface SessionState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
  expiresAt: number | null;
}

const initialState: SessionState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  userInfo: null,
  expiresAt: null,
};

const isBrowser = typeof window !== 'undefined';

// Function to load session from localStorage
const loadSession = (): SessionState => {
  if (!isBrowser) return initialState;

  const storedSession = localStorage.getItem('userSession');
  if (storedSession) {
    const parsedSession = JSON.parse(storedSession);
    if (parsedSession.expiresAt && new Date().getTime() < parsedSession.expiresAt) {
      return parsedSession;
    }
    // Session expired, clear it
    localStorage.removeItem('userSession');
  }
  return initialState;
};

export const sessionStore = writable<SessionState>(loadSession());

// Helper function to save session with expiration
const saveSession = (state: SessionState) => {
  if (!isBrowser) return state;

  const expiresAt = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
  const sessionToSave = { ...state, expiresAt };
  localStorage.setItem('userSession', JSON.stringify(sessionToSave));
  return sessionToSave;
};

// Helper functions to update the store
export const setAuthenticated = (isAuthenticated: boolean) => {
  sessionStore.update(state => {
    const newState = { ...state, isAuthenticated };
    return saveSession(newState);
  });
  if (isBrowser) console.log('Session state updated:', get(sessionStore));
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  sessionStore.update(state => {
    const newState = { ...state, accessToken, refreshToken };
    return saveSession(newState);
  });
  if (isBrowser) console.log('Session state updated:', get(sessionStore));
};

export const setUserInfo = (userInfo: UserInfo) => {
  sessionStore.update(state => {
    const newState = { ...state, userInfo };
    return saveSession(newState);
  });
  if (isBrowser) console.log('Session state updated:', get(sessionStore));
};

export const clearSession = () => {
  sessionStore.set(initialState);
  if (isBrowser) {
    localStorage.removeItem('userSession');
    console.log('Session cleared:', get(sessionStore));
  }
};

import { useEffect, useState } from 'react';
import BrandPanel from './components/BrandPanel.jsx';
import LoginForm from './components/LoginForm.jsx';
import SignupForm from './components/SignupForm.jsx';
import SocialButtons from './components/SocialButtons.jsx';
import {
  friendlyAuthError,
  isFirebaseConfigured,
  observeAuthState,
  signInWithProvider,
  signOutCurrentUser,
} from './lib/firebase.js';

const readMode = () => (window.location.hash === '#signup' ? 'signup' : 'login');

const HEADINGS = {
  login: { title: 'Welcome back', sub: 'Log in to continue to your boards.' },
  signup: { title: 'Create your account', sub: 'Setting up takes about a minute.' },
};

// Email/password authentication is intentionally not simulated. Connect a trusted
// backend or enable Firebase Email/Password before accepting password credentials.
async function authenticate() {
  throw new Error(
    'Email and password sign-in is not connected yet. Use Google or GitHub for now.'
  );
}

export default function App() {
  const [mode, setMode] = useState(readMode);
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState('');
  const [socialLoading, setSocialLoading] = useState('');

  useEffect(() => {
    const onHash = () => {
      setMode(readMode());
      setAuthError('');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) return undefined;

    try {
      return observeAuthState((user) => setSession(user));
    } catch (error) {
      setAuthError(friendlyAuthError(error));
      return undefined;
    }
  }, []);

  const switchMode = (next) => {
    setMode(next);
    setAuthError('');
    window.history.replaceState(null, '', `#${next}`);
  };

  const handleSubmit = async (values) => {
    await authenticate(mode, values);
  };

  const handleSocialSignIn = async (provider) => {
    setAuthError('');
    setSocialLoading(provider);

    try {
      const result = await signInWithProvider(provider);
      setSession(result.user);
    } catch (error) {
      setAuthError(friendlyAuthError(error));
    } finally {
      setSocialLoading('');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutCurrentUser();
      setSession(null);
      setAuthError('');
    } catch (error) {
      setAuthError(friendlyAuthError(error));
    }
  };

  const heading = HEADINGS[mode];
  const displayName =
    session?.displayName || session?.email?.split('@')[0] || 'there';

  return (
    <div className="shell">
      <BrandPanel mode={mode} />

      <main className="stage">
        <div className="panel">
          {session ? (
            <section className="done" aria-live="polite">
              <span className="done-mark" aria-hidden="true">✓</span>
              <h1>{mode === 'signup' ? `You’re in, ${displayName}` : `Welcome back, ${displayName}`}</h1>
              <p>{session.email || 'Your account is authenticated.'}</p>
              <button className="btn ghost" type="button" onClick={handleSignOut}>
                Sign out
              </button>
            </section>
          ) : (
            <>
              <div className="switch" role="tablist" aria-label="Account access" data-mode={mode}>
                <span className="switch-thumb" aria-hidden="true" />
                <button
                  role="tab"
                  type="button"
                  id="tab-login"
                  aria-selected={mode === 'login'}
                  aria-controls="auth-panel"
                  onClick={() => switchMode('login')}
                >
                  Log in
                </button>
                <button
                  role="tab"
                  type="button"
                  id="tab-signup"
                  aria-selected={mode === 'signup'}
                  aria-controls="auth-panel"
                  onClick={() => switchMode('signup')}
                >
                  Create account
                </button>
              </div>

              <div
                key={mode}
                id="auth-panel"
                role="tabpanel"
                aria-labelledby={`tab-${mode}`}
                className="swap"
              >
                <header className="heading">
                  <h1>{heading.title}</h1>
                  <p>{heading.sub}</p>
                </header>

                <SocialButtons
                  mode={mode}
                  onSocial={handleSocialSignIn}
                  loadingProvider={socialLoading}
                  disabled={Boolean(socialLoading)}
                />

                {authError && (
                  <p className="banner" role="alert" style={{ marginTop: 16 }}>
                    {authError}
                  </p>
                )}

                <div className="divider">
                  <span>or use email</span>
                </div>

                {mode === 'login' ? (
                  <LoginForm onSubmit={handleSubmit} />
                ) : (
                  <SignupForm onSubmit={handleSubmit} />
                )}

                <p className="swap-line">
                  {mode === 'login' ? 'New to Kora?' : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  >
                    {mode === 'login' ? 'Create an account' : 'Log in'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

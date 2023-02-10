import {useEffect, useState} from 'react';

import Link from 'next/link';

import {getCookie, setCookie} from 'cookies-next';


const PRIVACY_POLICY_ACCEPTANCE_COOKIE = 'privacyPolicyAccepted';
const PRIVACY_POLICY_ACCEPTANCE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30,  // one month
};


export const CookieNotice = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const cookie = Boolean(getCookie(
        PRIVACY_POLICY_ACCEPTANCE_COOKIE, PRIVACY_POLICY_ACCEPTANCE_OPTIONS));
    setShow(cookie !== true);
  }, []);
  if (!show) {
    return null;
  }
  return (
    <div style={{
      padding: '1em',
      position: 'fixed',
      width: '100%',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      textAlign: 'right',
      color: 'white',
      fontWeight: 600,
    }}>
      This website uses cookies to improve the navigation experience. Please read
      our <Link href="/pp">privacy policy</Link>. <button onClick={() => {
        setCookie(PRIVACY_POLICY_ACCEPTANCE_COOKIE, true, PRIVACY_POLICY_ACCEPTANCE_OPTIONS);
        setShow(false);
      }}>Accept</button>
    </div>
  );
};

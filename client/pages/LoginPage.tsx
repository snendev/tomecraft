import React from 'react'
import GoogleButton from 'react-google-button'

import { loginGoogle } from '../api/auth.ts'
import IntroPage from '../components/IntroPage.tsx'

// https://developers.google.com/identity/branding-guidelines
// https://developers.google.com/identity/sign-in/web/sign-in
function GoogleLoginButton() {
  const onClick = React.useCallback(async () => {
    await loginGoogle()
  }, [])

  return (
    <GoogleButton onClick={onClick} />
  )
}

export default function LoginPage() {
  return (
    <IntroPage>
      <div>
        <GoogleLoginButton />
      </div>
    </IntroPage>
  )
}

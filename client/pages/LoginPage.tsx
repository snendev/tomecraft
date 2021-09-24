import React from 'react'
import GoogleButton from 'react-google-button'

// import { loginGoogle } from '../api/auth.ts'
import Page from '../components/Page.tsx'

// https://developers.google.com/identity/branding-guidelines
// https://developers.google.com/identity/sign-in/web/sign-in
function GoogleLoginButton() {
  const onClick = React.useCallback(async () => {
    // await loginGoogle()
  }, [])

  return (
    <GoogleButton onClick={onClick} />
  )
}

export default function LoginPage() {
  return (
    <Page>
      <div>
        <GoogleLoginButton />
      </div>
    </Page>
  )
}

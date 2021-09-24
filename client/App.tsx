import React from 'react'

import assertNever from '~/common/assertNever.ts'

import AppPage from './pages/AppPage.tsx'
import LoadingPage from './pages/LoadingPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import { AuthProvider, UserProvider, useAuth } from './user.tsx'

function AuthRouter() {
  const user = useAuth()

  switch (user.loginState) {
    case 'pending': return <LoadingPage />
    case 'logged-out': return <LoginPage />
    case 'logged-in': {
      return (
        <UserProvider profile={user.profile}>
          <AppPage />
        </UserProvider>
      )
    }
    default: return assertNever(user)
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AuthRouter />
    </AuthProvider>
  )
}

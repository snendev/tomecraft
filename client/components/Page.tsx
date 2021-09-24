import React from 'react'

import GithubIcon from './GithubIcon.tsx'

interface PageProps {
  children: React.ReactNode
}

export default function Page({children}: PageProps): JSX.Element {
  return (
    <div className="page">
      <header className="header">
        <h2 className="header-text">
          Tomecraft
        </h2>
        <a
          href="https://github.com/sullivansean27/deno-react-web-starter"
          target="_blank"
        >
          <GithubIcon size={60} />
        </a>
      </header>
      <main className="main">
        {children}
      </main>
    </div>
  )
}

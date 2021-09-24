import React from 'react'

import GithubIcon from './GithubIcon.tsx'

interface PageProps {
  children: React.ReactNode
}

export default function Page({children}: PageProps): JSX.Element {
  return (
    <div className="page">
      <img className="tassle" src="assets/tassle.png" />
      <div className="vertical-ribbon" />
      <header className="intro-title-card-ribbon">
        <div className="intro-title-ribbon">
          <div className="into-title-container">
            <h1 className="intro-title-text">
              Tomecraft
            </h1>
            <a
              href="https://github.com/sullivansean27/tomecraft"
              target="_blank"
            >
              <GithubIcon size={80} />
            </a>
          </div>
        </div>
      </header>
      <main className="intro-main">
        {children}
      </main>
    </div>
  )
}

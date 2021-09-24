import React from 'react'

import Page from '../components/Page.tsx'

export default function AppPage() {
  return (
    <Page>
      <div>
        <p>Hello world!</p>
        <img style={{width: 100, height: 100}} src="/assets/example.png" />
      </div>
    </Page>
  )
}

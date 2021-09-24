import React from 'react'

import assertNever from '~/common/assertNever.ts'

import IntroPage from '../components/IntroPage.tsx'
import Page from '../components/Page.tsx'
import GameClient from '../game/GameClient.tsx'

type MenuState = 'menu' | 'play'

export default function AppPage() {
  const [menuState, setMenuState] = React.useState<MenuState>('menu')

  switch (menuState) {
    case 'menu': {
      return (
        <IntroPage>
          <button className="menu-button" onClick={() => setMenuState('play')}>
            Play
          </button>
        </IntroPage>
      )
    }
    case 'play': {
      return (
        <Page>
          <GameClient />
        </Page>
      )
    }
    default: return assertNever(menuState)
  }
}

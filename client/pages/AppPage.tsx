import React from 'react'

import assertNever from '~/common/assertNever.ts'

import IntroPage from '../components/IntroPage.tsx'
import Page from '../components/Page.tsx'
import Game from '../game/Game.tsx'

type MenuState = 'menu' | 'play'

export default function AppPage() {
  const [menuState, setMenuState] = React.useState<MenuState>('menu')

  switch (menuState) {
    case 'menu': {
      return (
        <IntroPage>
          <button onClick={() => setMenuState('play')}>
            Play
          </button>
        </IntroPage>
      )
    }
    case 'play': {
      return (
        <Page>
          <Game />
        </Page>
      )
    }
    default: return assertNever(menuState)
  }
}

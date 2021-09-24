import React from 'react'
import ReactDOM from 'react-dom'

import App from '~/client/App.tsx'

window.addEventListener('load', (event) => {
  ReactDOM.render(<App />, document.getElementById('root'))
})

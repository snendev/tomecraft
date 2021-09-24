import React from 'react'
import ReactDOM from 'react-dom'

//// import any necessary wasm file here
// import initWasm from '~/common/wasm/wasm_chess.js'

import App from '~/client/App.tsx'

//// init wasm file here
//// fetch file contents from webserver so browser has access
// initWasm(fetch('wasm_chess.wasm'))

window.addEventListener('load', (event) => {
  ReactDOM.hydrate(<App />, document.getElementById('root'))
})

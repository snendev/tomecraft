# Deno React Web Starter

This is a template repository for bootstrapping simple React SSR applications using [Deno](https://deno.land/), [Oak](https://deno.land/x/oak), [React](https://reactjs.org/), and [Firebase](https://console.firebase.google.com/u/0/).

## Why

Using Deno means being able to work with modern JS features in a direct way without needing transpilation steps. `Deno.emit()` creates a client bundle which is exposed by a simple webserver.

## Features

Quickly supports websockets connections, static file serving, and authentication with Firebase. Simply uncomment the appropriate locations in code and add your configuration variables.

## Code layout

- `~/client`: any code that is compiled and shipped to the browser.
    - `~/client/styles.css`: the stylesheet for the application. more could certainly be integrated here.
    - `~/client/App.tsx`: the entrypoint for the app, which imports everything else in the folder.
- `~/common`: modules shared between browser and server code.
    - `~/common/wasm`: doesn't exist in this repository, but can be added (using e.g. [`wasm-pack`](https://github.com/rustwasm/wasm-pack)) to easily support webassembly modules in both client and server.
    - other common utilities as a common import example.
- `~/server`: a simple webserver with example websocket and REST endpoints.
- `~/import_map.json`: the import map! starts with any relevant dependencies.
- `~/Procfile`: an example Procfile showing how to run the service. To convert this to any other form of script, simply trim the prefix `web:`.

Enable SSR by un-commenting the React and ReactDOMServer lines in `~/server/routes/static.tsx`.

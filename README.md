# Tomecraft Web

This is a client for a tactical card game server. It is made using [my Deno-React-Web-Starter template repository](https://github.com/sullivansean27/deno-react-web-starter).

Deployed server is at http://www.tomecraft.xyz/. Code for the websocket server was written by @stryan.

## Code layout

- `~/client`: any code that is compiled and shipped to the browser.
    - `~/client/styles.css`: the stylesheet for the application.
    - `~/client/App.tsx`: the entrypoint for the app, which imports everything else in the folder.
- `~/common`: modules shared between browser and server code.
- `~/server`: a simple webserver (and an entrypoint for client code).
- `~/import_map.json`: the import map used for both client and server code.
    - these could be separated, but I prefer to avoid the maintenance cost.

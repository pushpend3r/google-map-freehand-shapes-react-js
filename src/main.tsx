import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import MapProvider from "./components/Map/MapProvider.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MapProvider>
      <App />
    </MapProvider>
  </React.StrictMode>
);

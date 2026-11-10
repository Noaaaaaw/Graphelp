import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import App from "./App.jsx";
import favicon from './assets/Graphelp.png'

const link = document.querySelector("link[rel='icon']")
link.href = favicon

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
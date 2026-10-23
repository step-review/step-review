// Load the design tokens first, so that every stylesheet can use them.
import "./styles.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const element = document.getElementById("root");
if (!element) {
  throw new Error("Application root element is missing.");
}
createRoot(element).render(<App />);

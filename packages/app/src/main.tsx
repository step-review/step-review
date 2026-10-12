// Load Mantine styles first so that CSS modules can override them.
import "./styles.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const element = document.getElementById("root");
if (!element) {
  throw new Error("Application root element is missing.");
}
createRoot(element).render(<App />);

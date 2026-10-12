import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles.css";

const element = document.getElementById("root");
if (!element) {
  throw new Error("Application root element is missing.");
}
createRoot(element).render(<App />);

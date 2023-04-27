import ReactDOM from "react-dom/client";
import { App } from "./components/App.js";

// rome-ignore lint/style/noNonNullAssertion: this is guaranteed in index.html
const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<App />);

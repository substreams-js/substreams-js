import { App } from "./components/app.js";
import ReactDOM from "react-dom/client";

// rome-ignore lint/style/noNonNullAssertion: this is guaranteed in index.html
const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<App />);

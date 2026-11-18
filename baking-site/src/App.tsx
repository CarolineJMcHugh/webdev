import './App.css'
import {Home} from "./Home.tsx"
import { Results } from "./Results.tsx"


export default function App() {
  const page = window.location.pathname === "/results" ? <Results /> : <Home />

  return (
   <div className = "App">
    {page}
    </div>
  );
}


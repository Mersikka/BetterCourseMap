import { useState } from 'react';
import { API_URL } from './lib/api';
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>BetterCourseMap</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App

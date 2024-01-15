import { useState } from 'react'
import { Navbar } from './NavBar.tsx'

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <h1 className="text-3xl font-bold underline bg-yellow-500">Hello world!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
      </div>
    </>
  )
}

export default App

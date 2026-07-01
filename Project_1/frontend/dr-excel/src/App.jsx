import { useState } from "react"
// import Homepage from "../src/homepage/Homepage"
import Loginpage from "./login-page/Loginpage"
import SignupPage from "./signup-page/SignupPage"

function App() {
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <>
      {isSignupOpen ? (
        <SignupPage onBackToLogin={() => setIsSignupOpen(false)} />
      ) : (
        <Loginpage onCreateAccount={() => setIsSignupOpen(true)} />
      )}
    </>
  )
}

export default App

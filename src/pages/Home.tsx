import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/investments");
  }, [])
  return (
    <div className="w-full flex h-screen flex-col justify-center items-center">
      <div className="md:text-8xl text-6xl font-bold">GPTBOTS</div>
    </div>
  )
}

export default Home
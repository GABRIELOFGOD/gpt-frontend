import { NavLink } from "react-router-dom"
import { adminSidebar } from "../../utils/contants"

const Sidebar = () => {
  return (
    <div className={`md:flex flex-col hidden w-[250px] bg-white sticky top-0 left-0 rounded-r-2xl`}>
      <div className="flex items-center space-x-4 py-5 px-3">
        <img className="w-[30px]" src="/static/3.png" alt="Logo" />
        <p className=" text-secondary my-auto font-bold text-2xl">GPTBOT</p>
      </div>
      <div className="flex flex-col gap-1 admin">
        {
          adminSidebar.map((item, i) => (
            <NavLink
              to={item.path} 
              key={i}
              className={`text-gray-600 py-2 px-3 font-semibold flex justify-between relative`}
              end
            >
              {item.name}
              <div className="add absolute top-0 right-0 border-l-4 border-white"></div>
            </NavLink>
          ))
        }
      </div>
    </div>
  )
}

export default Sidebar
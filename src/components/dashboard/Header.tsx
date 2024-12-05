import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { BiLogOut, BiUserCircle } from "react-icons/bi";
import toast from "react-hot-toast";

const Header = () => {
  const [profileHover, setProfileHover] = useState(false);
  const { allUsers, userProfile, userProfileState } = useGlobalContext();
  
  useEffect(() => {
    userProfile();
    allUsers();
  }, []);

  const logout = async () => {
    // await disconnect();
    localStorage.removeItem("user");
    toast.success("Logout successful");
    location.reload();
  };

  return (
    <div className="w-full p-3 bg-white flex justify-between rounded-2xl ">
      <p className="my-auto font-bold">{userProfileState?.name}</p>
      <div
        className="my-auto cursor-pointer bg-primary text-white p-1 rounded-full"
        onMouseEnter={() => setProfileHover(true)}
        onMouseLeave={() => setProfileHover(false)}
      >
        <BiUserCircle size={20} />
        <div
          onClick={logout}
          className={`absolute right-1 top-12 gap-2 cursor-pointer bg-white text-black p-2 ${profileHover ? "flex" : "hidden"}`}
        >
          <div className="my-auto">
            <BiLogOut />
          </div>
          <button>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Header
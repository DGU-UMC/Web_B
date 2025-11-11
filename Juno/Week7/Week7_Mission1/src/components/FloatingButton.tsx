import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FloatingButton = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) setIsDisabled(false);
  }, [accessToken]);

  return (
    <button
      disabled={isDisabled}
      className="box-border fixed right-4 bottom-4 flex justify-center items-center w-12 h-12 p-3.5 bg-gray-700 rounded-full cursor-pointer disabled:cursor-not-allowed"
      onClick={() => {
        navigate("/createLp");
      }}
    >
      <img src="../../public/images/plus.svg" alt="" />
    </button>
  );
};

export default FloatingButton;

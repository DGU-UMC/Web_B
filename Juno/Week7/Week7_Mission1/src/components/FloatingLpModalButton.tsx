import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface FloatingLpModalButtonProps {
  toggleLpModal: () => void;
}

const FloatingLpModalButton = ({
  toggleLpModal,
}: FloatingLpModalButtonProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (accessToken) setIsDisabled(false);
  }, [accessToken]);

  return (
    <button
      disabled={isDisabled}
      className="box-border fixed right-4 bottom-4 flex justify-center items-center w-12 h-12 p-3.5 bg-gray-700 rounded-full cursor-pointer disabled:cursor-not-allowed"
      onClick={() => {
        toggleLpModal();
      }}
    >
      <img src="../../public/images/plus.svg" alt="" />
    </button>
  );
};

export default FloatingLpModalButton;

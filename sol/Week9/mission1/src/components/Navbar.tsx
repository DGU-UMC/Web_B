import { FaShoppingCart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../hooks/useCostomRedux";
import { useEffect } from "react";
import { calculateTotals } from "../slices/cartSlice";

const Navbar = () => {
  const { amount, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1
        onClick={() => {
          window.location.href = "/";
        }}
        className="text-2xl font-semibold cursor-pointer"
      >
        Hansol Jo
      </h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-xl font-medium" />
        <span className="text-xl fon font-medium">{amount}</span>
      </div>
    </div>
  );
};
export default Navbar;

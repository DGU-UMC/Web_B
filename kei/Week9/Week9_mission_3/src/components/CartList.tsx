import CartItem from "./CartItem";
import { useCartInfo } from "../hooks/useCartStore";

const CartList = () => {
    const { cartItems } = useCartInfo();
    
    return (
        <div className='flex flex-col items-center justify-center'>
            {cartItems.length === 0 && (
                <div className='my-10'>
                    <p className='text-2xl font-semibold'>장바구니가 비어있습니다.</p>
                </div>
            )}
            <ul>
                {cartItems.map((item) => (
                    <CartItem key={item.id} lp={item}/>
                ))}
            </ul>
        </div>
    )
};

export default CartList;
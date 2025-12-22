import { useCartInfo } from "../hooks/useCartStore";
import { useModalStore } from "../hooks/useModalStore";

const PriceBox = () => {
    const { total } = useCartInfo();
    const { open } = useModalStore();
    

    const handleInitializeCart = () => {
        open();
    };

    return (
        <div className='p-12 flex justify-between'>
            <button 
                onClick={handleInitializeCart}
                className='border p-4 rounded-md cursor-pointer'>
                전체 삭제
            </button>
            <div>총 가격 : { total }원</div>
        </div>
    )
};

export default PriceBox;
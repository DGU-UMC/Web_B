import { create } from "zustand";
import type { CartItems } from "../types/cart";
import { immer } from "zustand/middleware/immer";
import cartItems from "../constants/cartItems";
import { useShallow } from "zustand/shallow";

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void; // cart의 action이라고 가정
}

interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
  actions: CartActions;
}

// immer: 불변성 유지를 위한 zustand 내장 라이브러리
export const useCartStore = create<CartState>()(
  // 활용하지 않는 parameter를 _로 표현
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  immer((set, _) => ({
    // set이 자체적으로 draft가 되므로 불변성이 유지됨
    cartItems: cartItems,
    amount: 0,
    total: 0,
    actions: {
      increase: (id: string) => {
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);

          if (cartItem) {
            cartItem.amount += 1;
          }
        });
      },
      decrease: (id: string) => {
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);

          if (cartItem) {
            cartItem.amount -= 1;
          }
        });
      },
      removeItem: (id: string) => {
        set((state) => {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        });
      },
      clearCart: () => {
        set((state) => {
          state.cartItems = [];
        });
      },
      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;

          state.cartItems.forEach((item) => {
            amount += item.amount;
            total += item.amount * parseInt(item.price, 10);
          });

          state.amount = amount;
          state.total = total;
        });
      }, // cart의 action이라고 가정
    },
  }))
);

export const useCartInfo = () =>
  useCartStore(
    // Zustand에서 얕은 비교(shallow comparison)를 통해 불필요한 리렌더링을 방지하는 유틸리티
    // 매번 새 객체를 반환하면 값이 같아도 다르다고 판단하므로, 객체 내부 값을 얕게 비교하도록 만든다.
    useShallow((state) => ({
      cartItems: state.cartItems,
      amount: state.amount,
      total: state.total,
    }))
  );

export const useCartActions = () => useCartStore((state) => state.actions);

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

export interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
}

const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

// cartSlice 생성: createSlice(reduxToolkit 제공)
const cartSlice = createSlice({
  name: "cart",
  initialState,
  // reducer: 상태 관리 로직
  reducers: {
    // 수량 증가(상한선 고려 X)
    increase: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);

      if (item) {
        item.amount += 1;
      }
    },
    // 수량 감소
    decrease: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);

      if (item) {
        item.amount -= 1;
      }
    },
    // 카트에 담긴 아이템 제거
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== itemId
      );
    },
    // 전체 아이템 제거
    clearCart: (state) => {
      state.cartItems = [];
    },
    // 총액 계산
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * parseInt(item.price, 10);
      });

      state.amount = amount;
      state.total = total;
    },
  },
});

// duck pattern: Redux에서 액션 타입, 액션 생성함수, 리듀서를 서로 다른 파일로 쪼개지 않고 한 모듈(파일) 안에 모두 묶어 관리하는 방식
export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

export const cartReducer = cartSlice.reducer;

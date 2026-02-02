import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "../slices/cartSlices";

// 1. 중앙 저장소 생성
function createStore() {
  const store = configureStore({
    // 2. reducer 설정: cartSlices.ts에서 설정한 이름
    reducer: { cart: cartReducer },
  });

  return store;
}

// 싱글톤 패턴
// 앱 전역에서 인스턴스가 하나만 존재하도록, 생성해서 export
const store = createStore();

// 3. App.tsx에서 Provider로 감싸기
export default store;

// 타입 추론을 위한 export
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

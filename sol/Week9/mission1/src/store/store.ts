import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../slices/modalSlice";
import cartReducer from "../slices/cartSlice";

// 1. 저장소 생성
function createStore() {
  const store = configureStore({
    // 2. 리듀서 설정
    reducer: { cart: cartReducer, modal: modalReducer },
  });
  return store;

  // store를 활용할 수 있도록 반환
  // 여기서 실행해서 스토어를 빼준다
  // 싱글톤 패턴
}
const store = createStore();
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

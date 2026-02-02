import {
  useDispatch as useDefaultDispatch,
  useSelector as useDefaultSelector,
} from "react-redux";
import { type AppDispatch, type RootState } from "../store/store";

export const useDispatch = useDefaultDispatch.withTypes<AppDispatch>();
export const useSelector = useDefaultSelector.withTypes<RootState>();

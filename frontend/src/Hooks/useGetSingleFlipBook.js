import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../utils/apiRequest";
import { FLIPBOOK_API_END_POINT } from "../constant";
import { setCurrentFlipbook } from "../Redux/Slices/EventSlice";

export const useGetSingleFlipBook = (flipBookId) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);

  const fetchFlipBook = useCallback(async () => {
    if (!flipBookId) return;

    try {
      const endpoint = `${FLIPBOOK_API_END_POINT}/getSingleFlipbookById/${flipBookId}`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch);

      if (res.status === 200) {
        dispatch(setCurrentFlipbook(res.data.data));
      }
    } catch (err) {
      console.error("🔴 Error fetching single flipbook:", err);
    }
  }, [flipBookId, accessToken, dispatch]);

  useEffect(() => {
    fetchFlipBook();
  }, [fetchFlipBook]);

  return { refetchFlipBook: fetchFlipBook };
};

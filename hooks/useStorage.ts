// hooks/useStorage.ts
import { useState, useCallback } from "react";
import {
  loadAccounts,
  registerAccount,
  loginAccount,
  loadCurrentUser,
  logoutUser,
  loadAllOrders,
  StoredUser,
} from "../services/StorageService";

export function useStorage() { // Custom hook này sẽ cung cấp các hàm liên quan đến AsyncStorage với trạng thái loading để dễ dàng sử dụng trong các component, tránh phải quản lý loading state riêng lẻ ở nhiều nơi
  const [loading, setLoading] = useState(false); // Trạng thái loading chung cho tất cả các thao tác liên quan đến AsyncStorage

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => { // 
    setLoading(true); //
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  return { //
    loading,

    loadAccounts: () => withLoading(loadAccounts), 

    registerAccount: (user: StoredUser) =>
      withLoading(() => registerAccount(user)),

    loginAccount: (email: string, password: string) =>
      withLoading(() => loginAccount(email, password)),

    loadCurrentUser: () => withLoading(loadCurrentUser),

    logoutUser: () => withLoading(logoutUser),

    loadAllOrders: () => withLoading(loadAllOrders),
  };
}
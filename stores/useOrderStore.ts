import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Order {
  id: string;
  userId: string;
  txHash: string;
  status: 'pending' | 'success' | 'failed';
  amount: bigint;
  timestamp: number;
  createdAt: number;
  isRepurchase: boolean;
  activationCode?: string;
  taskGroupId?: string;
  paymentMethod?: 'contract' | 'balance';
}

interface OrderState {
  // 状态
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  selectedOrder: Order | null;

  // 操作
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setCurrentOrder: (order: Order | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSelectedOrder: (order: Order | null) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      // 初始状态
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,
      selectedOrder: null,

      // 操作方法
      setOrders: (orders) => set({ orders }),
      addOrder: (order) => set((state) => ({ 
        orders: [...state.orders, order] 
      })),
      updateOrder: (orderId, updates) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, ...updates } : order
        ),
      })),
      setCurrentOrder: (order) => set({ currentOrder: order }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setSelectedOrder: (order) => set({ selectedOrder: order }),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 
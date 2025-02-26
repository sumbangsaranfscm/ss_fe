import { create } from "zustand";

interface MyState {
  role:  "komite" | "approval" | undefined;
  setRole: (role: "komite" | "approval" | undefined) => void;
}

export const useMyStore = create<MyState>()((set) => ({
  role: undefined,
  setRole: (role) => set(() => ({ role: role })),
}));

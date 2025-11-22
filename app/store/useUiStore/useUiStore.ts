import { create } from 'zustand';

type UiType = {
    isMenu: boolean,
    openMobileMenu: () => void,
    closeMobileMenu: ()=> void
}

export const useUIStore = create<UiType>((set) => ({
    isMenu: false,
    openMobileMenu: () => set(state => ({ isMenu: true })),
    closeMobileMenu: () => set(state => ({ isMenu: false }))
}))


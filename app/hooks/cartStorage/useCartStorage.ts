'use client';

import React, { useEffect, useState } from 'react';
import {CartStorageType, CartItemType} from '@/types/hook/cartStorage/cartStorage';

const useCartStorage = () => {
  
    const [state, setState] = useState({});

    useEffect(() => {
        if (!window || !window.localStorage) return;

        const cart = localStorage.getItem('cart');

        if (cart){
            const cartJson = JSON.parse(cart);
            setState(cartJson);
        }
    }, [])
    
    const getCart = (): CartStorageType | undefined => {
        if (!window || !window.localStorage) return;
        
        const storage = localStorage.getItem('cart');

        if (!storage) return;

        try {
            const cart: CartStorageType = JSON.parse(storage);
            return cart;
        } catch (error) {
            console.error(error);
        }
    }

    const areObjectsEqual= (obj1: {}, obj2: {}) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    const isItemExist = (item: CartItemType): number | undefined=> {
        if(!item) return;
        
        try {
            const cart = getCart();
            if (!cart || !cart.items.length) return;
            
            return cart.items.findIndex(itm => itm.itemId === item.itemId && 
                                          itm.size === item.size &&
                                          areObjectsEqual(itm.addOns, item.addOns) &&
                                          itm.notes === item.notes);
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
    
    const storeItem = (item: CartItemType): boolean | undefined => {
        if (!item) return;
        
        try {
            const cart = getCart();

            if (!cart) {
                localStorage.removeItem('cart');
                const dateTime = new Date().toLocaleString();

                const cart: CartStorageType = {
                    createdAt: dateTime,
                    updatedAt: dateTime,
                    items: [],
                    total: {
                        itemCount: item.quantity,
                        uniqueItems: 1,
                        subtotal: item.price,
                        discount: 0,
                        shipping: 0
                    }
                }

                cart.items.push(item);
                setLocalStorage(cart);
                setState(cart);
                return true;
            }
            else {
                const updateTime = new Date().toLocaleString();
                cart.updatedAt = updateTime;
                
                cart.items.push(item);

                if (cart.total) {
                    cart.total.itemCount += item.quantity;
                    cart.total.subtotal += item.price;
                    cart.total.uniqueItems += 1;
                }

                setState(cart);
                setLocalStorage(cart);
                return true;
            }

        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    const setLocalStorage = (cart: CartStorageType): boolean | undefined => {
        if (!cart) return;

        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            setState(cart);
            return true;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    const removeItem = (item: CartItemType) => {
        const cart = getCart();

        if (cart){
            try {
                const itemIdx = cart?.items.findIndex(itm => itm.itemId === item.itemId && 
                                                             itm.price === item.price &&
                                                             itm.size === item.size &&
                                                             itm.quantity === item.quantity );

                
                const priceToDeduct = item.price * item.quantity;

                cart?.items.splice(itemIdx, 1);

                if (cart.total?.subtotal) cart.total.subtotal -= priceToDeduct;
                
                const uniqueItem = [
                    ...new Map(cart.items.map(itm => [itm.name, itm]))
                ].map(([_, item]) => item).length;
                
                if (cart.total?.uniqueItems){
                    cart.total.uniqueItems = uniqueItem;
                }

                if (cart.total?.itemCount) cart.total.itemCount -= 1;

                setLocalStorage(cart);
                setState(cart);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const clearCartStorage = () => {
        const cart = getCart();

        if (!cart) return;

        try {
            localStorage.removeItem('cart');
        } catch (error) {
            console.error(error);
        }
    }

    return { state, getCart, storeItem, removeItem, clearCartStorage };
}
    
export default useCartStorage;

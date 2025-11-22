"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { ItemType } from "@/types/item/item";
import { CartItemType } from '@/types/hook/cartStorage/cartStorage';
import { multiPriceHandler } from "@/app/utilities/utilities";
import useCartStorage from '@/app/hooks/cartStorage/useCartStorage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type ItemCustomizerProps = {
  item: ItemType
};




export function ItemCustomizer({ item }: ItemCustomizerProps) {
  const addItem = useCartStore((s) => s.addItem);

  const { state, getCart, storeItem } = useCartStorage();

  // simple local state for demo – you can extend later
  const [size, setSize] = useState("medium");
  const [extraToppings, setExtraToppings] = useState([]);
  const [oatMilk, setOatMilk] = useState(false);
  const [noOlives, setNoOlives] = useState(false);
  const [noCheese, setNoCheese] = useState(false);
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [topping, setTopping] = useState({
      Anchovies: false,
      "BBQ Sauce": false,
      Bacon: false,
      Beef: false,
      Cabanossi: false,
      Capsicum: false,
      Cheese: false,
      Chicken: false,
      Chilli: false,
      "Diced Tomato": false,
      Egg: false,
      Garlic: false,
      "Garlic Base": false,
      Ham: false,
      Jalapenos: false,
      Mushroom: false,
      Olives: false,
      Onions: false,
      Pepperoni: false,
      Pineapple: false,
      Prawns: false,
      "Sweet Chilli Sauce": false,
      "Tandoori Sauce": false,
      "Tomato Base": false
    })
  console.log(quantity)
  const price = item.multiPrice ? JSON.parse(item.multiPrice) : {}
  const prices = multiPriceHandler(price, size);

  const toppingPrice = Object.keys(topping).filter(itm => topping[itm]);

  
  const unitPrice = (prices || item.basePrice) + (toppingPrice.length ? toppingPrice.length * 2.50 : 0);
  const linePrice = (unitPrice ? unitPrice : 0) * quantity;

  function handleAddToCart() {
    if (quantity < 1) return;

    try {
      const cartItem: CartItemType = {
        itemId: item.id,
        name: item.name,
        quantity,
        size,
        price: linePrice,
        addOns: {
          extraToppings: toppingPrice,
          noCheese,
          noOlives
        },
        notes: notes.trim()
      }

      const status = storeItem(cartItem);

      if (status){
        console.log(status)
        toast.success(`${quantity} ${item.name} added to cart`.toUpperCase());
      }
      
    } catch (error) {
      //handle error
    }
  }

  console.log(topping);

  return (
    <div className="space-y-4">
      <ToastContainer />
      {/* Size */}
      <div>
        <h2 className="text-sm font-semibold mb-1">Size</h2>
        <div className="flex gap-2 text-xs">
          {
            Object.keys(price).map(s => 
            <button key={s}
                    type="button"
                    onClick={() => setSize(s)}
                     className={`border rounded-full px-3 py-1 ${
                        size === s ? "bg-amber-600 text-white border-amber-600" : ""
                      }`} >
                {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>)
          }
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <h2 className="text-sm font-semibold mb-1">Extra Toppings ($2.50)</h2>
        <div className="space-y-1 text-xs 'w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[25px]'">
          {
            Object.keys(topping).map(top => <label key={top} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={topping[top]}
                onChange={(e) => setTopping(prev => ({
                  ...prev,
                  [top]: e.target.checked
                })) }
              />
              {top.toUpperCase()} $2.50
            </label>)
          }
        </div>
      </div>

      {/* Remove ingredients */}
      <div>
        <h2 className="text-sm font-semibold mb-1">Remove</h2>
        <div className="space-y-1 text-xs">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={noCheese}
              onChange={(e) => setNoCheese(e.target.checked)}
            />
            No Cheese
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={noOlives}
              onChange={(e) => setNoOlives(e.target.checked)}
            />
            No Olives
          </label>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h2 className="text-sm font-semibold mb-1">Special instructions</h2>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm"
          rows={3}
          placeholder="E.g. Please make it extra hot."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Quantity + Add */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs">Qty</span>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value) || 1))
            }
            className="w-16 border rounded-lg px-2 py-1 text-sm"
          />
        </div>
        <div className="flex-1 text-right text-sm">
          <div className="font-semibold">
            Total: ${linePrice.toFixed(2)}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-1 rounded-full bg-amber-600 text-white px-5 py-2 text-sm font-medium hover:bg-amber-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

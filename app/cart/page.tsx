"use client";

import { FormEvent, useState } from "react";
import useCartStorage from "../hooks/cartStorage/useCartStorage";
import { toast, ToastContainer } from 'react-toastify';
import { CartItemType } from "@/types/hook/cartStorage/cartStorage";

export default function CartPage() {
  const { getCart, removeItem, clearCartStorage } = useCartStorage();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cart = getCart();
  const items = cart?.items || [];
  const total = cart?.total;

  console.log(cart)

  async function handleCheckout(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOrderId(null);

    const form = e.currentTarget;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const address = (form.elements.namedItem("address") as HTMLInputElement)
      .value;
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement)
      .value;

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        name,
        phone,
        email,
        address: type === "delivery" ? address : undefined,
        notes,
        items: items.map((i) => ({
          itemId: i.itemId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          notes: i.notes,
          addOns: i.addOns
        })),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to place order");
      return;
    }

    // clear();
    setOrderId(data.id);
    form.reset();
    clearCartStorage();
    return toast.success('order submitted'.toUpperCase());
  }

  const removeHandler = (item: CartItemType) => {
    if (!item) return;

    try {
      removeItem(item);
      return toast.error(`${item.quantity} ${item.name} removed`);
    } catch (error) {
      
    }
  }

  return (
    <>
    <ToastContainer />
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Your Cart</h1>

      {items.length === 0 && !orderId && (
        <p className="text-sm text-slate-600">Your cart is empty.</p>
      )}

      {orderId && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl p-3">
          Order placed successfully! Your order ID is <b>{orderId}</b>.
        </div>
      )}

      {items.length > 0 && (
        <div className="grid gap-6 md:grid-cols-[2fr,1.5fr]">
          <div className="bg-white border rounded-xl p-4 space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-2 text-sm border-b last:border-b-0 pb-3 last:pb-0"
              >
                <div>
                  <p className="font-medium">{item.name.toUpperCase()}</p>
                  <p className="text-xs text-slate-500">
                    Qty: {item.quantity} * {item.size}
                  </p>
                    {
                      item.addOns['extraToppings'] ? <div className="my-5">
                        <p className="text-xs">Extra topptings * $2.50</p>
                        {
                          item.addOns['extraToppings'].map((tps, idx) => <p key={idx} className="text-xs text-slate-500">{tps}</p>)
                        }
                      </div> : null
                    }
                  <p className="text-xs text-slate-500">
                    total: ${item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeHandler(item)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleCheckout}
            className="bg-white border rounded-xl p-4 space-y-4 text-sm"
          >
            <h2 className="font-semibold">Checkout</h2>

            <div className="space-y-1">
              <label>Order Type</label>
              <select
                name="type"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                defaultValue="pickup"
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
                <option value="dine-in">Dine-in</option>
              </select>
            </div>

            <div className="space-y-1">
              <label>Name</label>
              <input
                name="name"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label>Phone</label>
              <input
                name="phone"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label>Email (optional)</label>
              <input
                name="email"
                type="email"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label>Delivery Address (only if delivery)</label>
              <input
                name="address"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label>Notes (optional)</label>
              <textarea
                name="notes"
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="font-semibold">
                Total: ${total?.subtotal.toFixed(2)}
              </p>
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="rounded-full bg-amber-600 text-white px-5 py-2 text-sm font-medium hover:bg-amber-700 disabled:opacity-60"
              >
                {loading ? "Placing order..." : "Place Order (Pay on pickup)"}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-600 mt-1">
                {error}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
    </>
  );
}

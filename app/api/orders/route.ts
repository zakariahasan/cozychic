import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clearScreenDown } from "readline";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 50,
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();

  const {
    type,
    name,
    phone,
    email,
    address,
    notes,
    items,
  }: {
    type: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
    items: {
      itemId: string;
      name: string;
      quantity: number;
      price: number;
      notes?: string;
      addOns?: string;
    }[];
  } = body;

  items.map(itm => console.log(itm))

  if (!type || !name || !phone || !items || items.length === 0) {
    return NextResponse.json(
      { error: "Missing fields or empty cart" },
      { status: 400 }
    );
  }

  const total = items.reduce((sum, i) => sum + i.price, 0);

  const order = await prisma.order.create({
    data: {
      type,
      status: "NEW",
      name,
      phone,
      email,
      address,
      notes,
      total,
      items: {
        create: items.map((i) => ({
          itemId: i.itemId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          notes: i.notes,
          addOns: JSON.stringify(i.addOns)
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}

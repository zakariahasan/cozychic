import { prisma } from "@/lib/prisma";
import { MenuItemCard } from "@/components/menu/MenuItemCard";

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        where: { active: true },
        orderBy: { name: "asc" },
      },
    },
  });

  return (
    <div className="space-y-6 p-[10px]">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Menu</h1>
          <p className="text-sm text-slate-600">
            Choose a category, customise items, and add to your cart.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search items (demo only)..."
            className="border rounded-full px-3 py-1.5 text-sm"
          />
        </div>
      </header>

      {categories.length === 0 && (
        <p className="text-sm text-slate-600">
          No categories found. Log in as admin to create menu items.
        </p>
      )}

      {categories.map((category) => (
        <section key={category.id} className="space-y-5">
          <h2 className="text-lg font-semibold capitalize">{category.name}</h2>
          {/* {category.description && (
            <p className="text-xs text-slate-600">{category.description}</p>
          )} */}
          {category.items.length === 0 ? (
            <p className="text-xs text-slate-500">
              No items in this category yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {category.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

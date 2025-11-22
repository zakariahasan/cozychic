import React from 'react'
import { prisma } from '@/lib/prisma';
import { MenuItemCard } from '@/components/menu/MenuItemCard';

const Products = async () => {

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

    console.log(categories)

    return (
        <div>
            {
                categories.map(cat => <section key={cat.id} className='w-full flex flex-col justify-center align-center my-10 p-[20px]'>
                    <h3 className='text-2xl font-bold uppercase my-8'>{cat.name}</h3>
                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]'>
                        {
                            cat.items.map(itm => <MenuItemCard key={itm.id} item={itm}/>)
                        }
                    </div>
                </section>)
            }
        </div>
    )
}

export default Products

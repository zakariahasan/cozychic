import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/UI/hero/hero";
import Products from "@/components/UI/products/products";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <Hero />
      <Products />
    </div>
  );
}

import { ProductPlatform } from "@/components/product-platform";

export const revalidate = 60; // 86400 seconds is 1 day

export default async function Home() {
  await fetch('https://shoes-marketplace-backend-d76726f71a85.herokuapp.com/products/scrape/adidas')
  await fetch('https://shoes-marketplace-backend-d76726f71a85.herokuapp.com/products/scrape/grid')
  const data = await fetch('https://shoes-marketplace-backend-d76726f71a85.herokuapp.com/products')
  const products = await data.json()
  return (
    <ProductPlatform products={products} />
  );
}

import { ProductPlatform } from "@/components/product-platform";

export default async function Home() {
  const data = await fetch('https://shoes-marketplace-backend-d76726f71a85.herokuapp.com/products')
  const products = await data.json()
  return (
    <ProductPlatform products={products} />
  );
}

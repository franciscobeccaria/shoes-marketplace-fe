'use client'

import type { Product } from "@/types/global-types";

import { useState, useEffect } from 'react'
import { Menu, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebounce } from 'use-debounce'
import { ProductCard } from "./product-card";

export function ProductPlatform() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('default')
  const [currentPage, setCurrentPage] = useState(1)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const itemsPerPage = 36

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // fetch products from API
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://shoes-marketplace-backend-d76726f71a85.herokuapp.com/products')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('An error occurred while fetching products. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleStoreToggle = (store: string) => {
    setSelectedStores(prev =>
      prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]
    )
  }

  const getPriceRange = (range: string): [number, number] => {
    switch (range) {
      case 'under50': return [0, 50000];
      case '50to100': return [50000, 100000];
      case '100to200': return [100000, 200000];
      case 'over200': return [200000, Infinity];
      default: return [0, Infinity];
    }
  }

  const sortProducts = (products: Product[]): Product[] => {
    switch (sortBy) {
      case 'priceLowToHigh':
        return [...products].sort((a, b) => a.price - b.price);
      case 'priceHighToLow':
        return [...products].sort((a, b) => b.price - a.price);
      case 'nameAZ':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'nameZA':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  }

  const filteredProducts = sortProducts(products.filter(product => {
    const [minPrice, maxPrice] = getPriceRange(priceRange);
    return (selectedStores.length === 0 || selectedStores.includes(product.store)) &&
      product.price >= minPrice && product.price <= maxPrice &&
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  }))

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage)
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, selectedStores, priceRange, sortBy])

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Store</h3>
        <div className="space-y-2">
          {['adidas', 'grid'].map(store => (
            <div key={store} className="flex items-center">
              <Checkbox
                id={`store-${store}`}
                checked={selectedStores.includes(store)}
                onCheckedChange={() => handleStoreToggle(store)}
              />
              <Label htmlFor={`store-${store}`} className="ml-2">
                {store.charAt(0).toUpperCase() + store.slice(1)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="under50">Under $50.000</SelectItem>
            <SelectItem value="50to100">$50.000 - $100.000</SelectItem>
            <SelectItem value="100to200">$100.000 - $200.000</SelectItem>
            <SelectItem value="over200">Over $200.000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Sort By</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
            <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
            <SelectItem value="nameAZ">Name: A to Z</SelectItem>
            <SelectItem value="nameZA">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[400px]">
      <Skeleton className="h-[360px]" />
      <div className="p-4 flex flex-col flex-grow">
        <Skeleton className="h-6 w-24 mb-1" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold mb-2">No products found</h2>
      <p className="text-gray-600">Try adjusting your filters or search term</p>
    </div>
  )

  const ErrorState = ({ message }: { message: string }) => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Platform</h1>
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterSidebar />
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          <div className="mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {error ? (
            <ErrorState message={error} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : displayedProducts.length > 0 ? (
                displayedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState />
                </div>
              )}
            </div>
          )}

          {!loading && !error && pageCount > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                size="icon"
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {pageCount}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                disabled={currentPage === pageCount}
                size="icon"
                variant="outline"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </main>

        <aside className="w-full lg:w-64 hidden lg:block">
          <FilterSidebar />
        </aside>
      </div>
    </div>
  )
}
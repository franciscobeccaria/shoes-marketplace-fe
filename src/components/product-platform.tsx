'use client'

import { useState, useEffect } from 'react'
import { Menu, Search, ChevronLeft, ChevronRight } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'

interface Product {
  _id: string;
  name: string;
  type: string;
  store: string;
  price: number;
  link: string;
  image: string;
}

export function ProductPlatform() {
  const [products, setProducts] = useState<Product[]>([]);

  // fetch products from API
  useEffect(() => {
    fetch('https://shoes-marketplace-backend-d76726f71a85.herokuapp.com/products')
      .then(res => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 300000])
  const [currentPage, setCurrentPage] = useState(1)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const itemsPerPage = 8

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleStoreToggle = (store: string) => {
    setSelectedStores(prev =>
      prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]
    )
  }

  const filteredProducts = products.filter(product => 
    (selectedTypes.length === 0 || selectedTypes.includes(product.type)) &&
    (selectedStores.length === 0 || selectedStores.includes(product.store)) &&
    // product.price >= priceRange[0] && product.price <= priceRange[1] &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage)
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedTypes, selectedStores, priceRange])

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Product Type</h3>
        <div className="space-y-2">
          {['shoes', 'clothes'].map(type => (
            <div key={type} className="flex items-center">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
              />
              <Label htmlFor={`type-${type}`} className="ml-2">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Store</h3>
        <div className="space-y-2">
          {['adidas', 'nike'].map(store => (
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
        <Slider
          min={0}
          max={300000}
          step={1000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          <span>$ {priceRange[0].toLocaleString()}</span>
          <span>$ {priceRange[1].toLocaleString()}</span>
        </div>
      </div>
    </div>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map(product => (
              <a
                key={product._id}
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[400px] transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                <div className="relative h-[280px]">
                  <Image fill={true} src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {product.store}
                  </Badge>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-gray-600 text-lg font-bold mb-1">$ {product.price.toLocaleString()}</p>
                  <h2 className="text-base font-semibold line-clamp-2 h-12">{product.name}</h2>
                </div>
              </a>
            ))}
          </div>

          {pageCount > 1 && (
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
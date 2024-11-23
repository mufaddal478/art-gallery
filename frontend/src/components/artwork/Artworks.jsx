import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getArtworks } from '../../store/slices/artworkSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';

const Artworks = () => {
  const dispatch = useDispatch();
  const { artworks = [], isLoading, error } = useSelector((state) => state.artworks);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    dispatch(getArtworks());
  }, [dispatch]);

  const handleAddToCart = (artwork) => {
    dispatch(
      addToCart({
        id: artwork._id,
        title: artwork.title,
        price: artwork.price,
        image: artwork.image,
        quantity: 1,
      })
    );
    toast.success('Added to cart');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredArtworks = Array.isArray(artworks) 
    ? artworks
      .filter((artwork) => {
        if (!filters.category) return true;
        return artwork.category === filters.category;
      })
      .filter((artwork) => {
        if (!filters.priceRange) return true;
        const [min, max] = filters.priceRange.split('-').map(Number);
        return artwork.price >= min && artwork.price <= max;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low-high':
            return a.price - b.price;
          case 'price-high-low':
            return b.price - a.price;
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'newest':
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      })
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const categories = ['Painting', 'Photography', 'Digital Art', 'Sculpture'];
  const priceRanges = [
    { label: 'Under $100', value: '0-100' },
    { label: '$100 - $500', value: '100-500' },
    { label: '$500 - $1000', value: '500-1000' },
    { label: 'Over $1000', value: '1000-999999' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          name="priceRange"
          value={filters.priceRange}
          onChange={handleFilterChange}
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Prices</option>
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>

        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {filteredArtworks.map((artwork) => (
          <div key={artwork._id} className="group">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <Link to={`/artwork/${artwork._id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {artwork.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{artwork.category}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">${artwork.price}</p>
            </div>
            <button
              onClick={() => handleAddToCart(artwork)}
              className="mt-2 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredArtworks.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No artworks found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or check back later for new artworks.
          </p>
        </div>
      )}
    </div>
  );
};

export default Artworks;

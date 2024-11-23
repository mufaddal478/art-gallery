import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getArtworkDetails } from '../../store/slices/artworkSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';

const ArtworkDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedArtwork, isLoading, error } = useSelector((state) => state.artwork);

  useEffect(() => {
    dispatch(getArtworkDetails(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: selectedArtwork._id,
        title: selectedArtwork.title,
        price: selectedArtwork.price,
        image: selectedArtwork.image,
        quantity: 1,
      })
    );
    toast.success('Added to cart');
  };

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

  if (!selectedArtwork) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-gray-500 text-xl">Artwork not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col">
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
            <img
              src={selectedArtwork.image}
              alt={selectedArtwork.title}
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        {/* Artwork info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {selectedArtwork.title}
          </h1>
          <div className="mt-3">
            <h2 className="sr-only">Artwork information</h2>
            <p className="text-3xl text-gray-900">${selectedArtwork.price}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              <p>{selectedArtwork.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <h4 className="text-sm font-medium text-gray-900">Artist:</h4>
              <p className="ml-2 text-sm text-gray-500">{selectedArtwork.artist}</p>
            </div>
            <div className="mt-2 flex items-center">
              <h4 className="text-sm font-medium text-gray-900">Category:</h4>
              <p className="ml-2 text-sm text-gray-500">{selectedArtwork.category}</p>
            </div>
            <div className="mt-2 flex items-center">
              <h4 className="text-sm font-medium text-gray-900">Medium:</h4>
              <p className="ml-2 text-sm text-gray-500">{selectedArtwork.medium}</p>
            </div>
            {selectedArtwork.dimensions && (
              <div className="mt-2 flex items-center">
                <h4 className="text-sm font-medium text-gray-900">Dimensions:</h4>
                <p className="ml-2 text-sm text-gray-500">{selectedArtwork.dimensions}</p>
              </div>
            )}
          </div>

          <div className="mt-10 flex sm:flex-col1">
            <button
              onClick={handleAddToCart}
              className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
            >
              Add to Cart
            </button>
          </div>

          {/* Reviews section */}
          <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-900">Reviews</h3>
            <div className="mt-6">
              {selectedArtwork.reviews && selectedArtwork.reviews.length > 0 ? (
                selectedArtwork.reviews.map((review) => (
                  <div key={review._id} className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-900">{review.name}</h4>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">{review.rating} / 5</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetails;

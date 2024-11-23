import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getArtworks } from '../../store/slices/artworkSlice';
import ArtworkCard from './ArtworkCard';

const ArtworkGrid = () => {
  const dispatch = useDispatch();
  const { artworks, isLoading, isError, message } = useSelector(
    (state) => state.artwork
  );

  useEffect(() => {
    dispatch(getArtworks());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 mt-8">
        Error: {message || 'Failed to fetch artworks'}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
        Featured Artworks
      </h2>
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork._id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
};

export default ArtworkGrid;

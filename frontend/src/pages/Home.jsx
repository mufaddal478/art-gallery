import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedArtworks } from '../store/slices/artworkSlice';
import ArtworkCard from '../components/artwork/ArtworkCard';

const Home = () => {
  const dispatch = useDispatch();
  const { artworks, isLoading } = useSelector((state) => state.artworks);

  useEffect(() => {
    dispatch(getFeaturedArtworks());
  }, [dispatch]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Art Gallery"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Welcome to Art Gallery
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Discover unique artworks from talented artists around the world. From contemporary to classical,
            find the perfect piece for your collection.
          </p>
        </div>
      </div>

      {/* Featured Artworks Section */}
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
          Featured Artworks
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {artworks && artworks.length > 0 ? (
              artworks.map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No featured artworks available at the moment.
              </p>
            )}
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              About Our Gallery
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              We curate the finest collection of artworks from emerging and established artists.
              Our mission is to make art accessible to everyone while supporting artists in their creative journey.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start collecting?</span>
            <span className="block">Create an account today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join our community of art enthusiasts and start building your collection.
          </p>
          <a
            href="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Sign up for free
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;

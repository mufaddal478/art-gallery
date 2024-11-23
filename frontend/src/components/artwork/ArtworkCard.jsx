import React from 'react';
import { Link } from 'react-router-dom';

const ArtworkCard = ({ artwork }) => {
  const {
    _id,
    title,
    imageUrl,
    price,
    artist,
    category,
  } = artwork;

  return (
    <Link to={`/artwork/${_id}`} className="group">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-center object-cover group-hover:opacity-75"
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{title}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">${price}</p>
      <div className="mt-1 flex justify-between items-center">
        <p className="text-sm text-gray-500">{artist}</p>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {category}
        </span>
      </div>
    </Link>
  );
};

export default ArtworkCard;

'use client';
import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import useContentStore from '@/store/contentStore';
import LoadingSpinner from '../Loader/loader';

const FeaturedSection: React.FC = () => {
  const { featured, loading } = useContentStore((state) => state);
  const [activeSlide, setActiveSlide] = useState(0);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Carousel
          showArrows={true}
          showThumbs={false}
          showStatus={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          transitionTime={500}
          onChange={(index) => setActiveSlide(index)}
          renderArrowPrev={(onClickHandler, hasPrev) => (
            <button
              type="button"
              onClick={onClickHandler}
              disabled={!hasPrev}
              className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-300 rounded-full p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          renderArrowNext={(onClickHandler, hasNext) => (
            <button
              type="button"
              onClick={onClickHandler}
              disabled={!hasNext}
              className="absolute z-10 right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-300 rounded-full p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        >
          {featured.map((item, index) => (
            <div key={index} className="relative">
              <Image 
                src={item} 
                alt={item} 
                width={1920} 
                height={1080} 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
              {/* <div className="absolute bottom-10 left-10 text-left">
                <h2 className="text-4xl font-bold text-white mb-2">{"hello"}</h2>
                <p className="text-xl text-gray-200 mb-4">{item.description}</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                  Learn More
                </button>
              </div> */}
            </div>
          ))}
        </Carousel>
        <div className="flex justify-center mt-4">
          {featured.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-3 w-3 rounded-full mx-1 transition-all duration-300 ${
                activeSlide === index ? 'bg-orange-500 w-6' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
'use client';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import Image from 'next/image';

const FeaturedSection: React.FC = () => {
  return (
    <div className="bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          showArrows={true}
          showThumbs={false}
          showStatus={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={3000}
          transitionTime={500}
          renderArrowPrev={(onClickHandler, hasPrev) => (
            <button
              type="button"
              onClick={onClickHandler}
              disabled={!hasPrev}
              className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-500 transition-colors duration-300"
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          renderArrowNext={(onClickHandler, hasNext) => (
            <button
              type="button"
              onClick={onClickHandler}
              disabled={!hasNext}
              className="absolute z-10 right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-500 transition-colors duration-300"
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        >
          <div>
            <Link href="/offer1">
              <Image src="/images/offer1.png" alt="Offer 1" layout="responsive" width={1920} height={1080} className="object-cover" />
            </Link>
          </div>
          <div>
            <Link href="/offer2">
              <Image src="/images/offer2.png" alt="Offer 2" layout="responsive" width={1920} height={1080} className="object-cover" />
            </Link>
          </div>
          <div>
            <Link href="/offer3">
              <Image src="/images/offer3.png" alt="Offer 3" layout="responsive" width={1920} height={1080} className="object-cover" />
            </Link>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default FeaturedSection;

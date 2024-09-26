'use client'
import React, { useState, useEffect } from "react";

interface CarouselProps {
  slides: React.ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative">
      <div className="w-full overflow-hidden relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide w-full h-[170px] hidden transition-opacity ea ${index === currentSlide ? "active" : ""}`}
          >
            {slide}
          </div>
        ))}
      </div>
      <div className="text-center">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`indicator inline-block w-[10px] h-[10px] bg-white rounded-[50%] ml-[5px] cursor-pointer transition-all ease-in-out ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  images: string[];
}

const ImageSlider = ({ images }: ImageSliderProps) => {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (!images || images.length === 0) return null;

  const next = () => setActive((prev) => (prev + 1) % images.length);
  const prev = () =>
    setActive((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* MAIN SLIDER */}
      <div className="relative w-full h-[350px] lg:h-[450px] bg-gray-100 rounded-2xl overflow-hidden shadow-md group">
        
        <Image
          src={images[active]}
        alt="listing image"
        fill
        sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
          onClick={() => setFullscreen(true)}
        />

        {/* arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
        >
          <ChevronRight size={20} />
        </button>

        {/* thumbnails */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-12 h-12 rounded-md overflow-hidden border cursor-pointer ${
                active === i ? "border-black shadow" : "border-transparent opacity-60"
              }`}
            >
              <Image src={img} alt="thumb" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-6 right-6 bg-white p-2 rounded-full shadow"
            >
              <X size={22} />
            </button>

            <div className="relative w-[90%] h-[90%]">
              <Image
                src={images[active]}
                alt="fullscreen"
                fill
                className="object-contain rounded-xl"
              />
            </div>

            <button
              onClick={prev}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white"
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={next}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white"
            >
              <ChevronRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageSlider;
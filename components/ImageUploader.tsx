
import React, { useRef, useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  currentImageUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, currentImageUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageChange(event.dataTransfer.files[0]);
    }
  }, [onImageChange]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  
  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`relative w-full aspect-video border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300 ${
        isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-dark-border hover:border-brand-secondary'
      }`}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {currentImageUrl ? (
        <img src={currentImageUrl} alt="Uploaded preview" className="object-contain w-full h-full rounded-lg" />
      ) : (
        <div className="text-center text-medium-text">
          <UploadIcon />
          <p className="mt-2 font-semibold">Nhấp để tải lên hoặc kéo & thả</p>
          <p className="text-xs">Hỗ trợ PNG, JPG, hoặc WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;


import React from 'react';
import type { EditedImageResult } from '../types';
import { DownloadIcon } from './icons';

interface ResultDisplayProps {
  originalImageUrl: string;
  editedResult: EditedImageResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImageUrl, editedResult }) => {
  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-center mb-2 text-medium-text">Ảnh gốc</h3>
          <img src={originalImageUrl} alt="Original" className="w-full h-auto rounded-lg shadow-md border border-dark-border" />
        </div>
        <div className="relative">
          <h3 className="text-lg font-semibold text-center mb-2 text-light-text">Đã chỉnh sửa</h3>
          <img src={editedResult.imageUrl} alt="Edited" className="w-full h-auto rounded-lg shadow-md border border-dark-border" />
          <a
            href={editedResult.imageUrl}
            download="edited-image.png"
            className="absolute top-12 right-2 bg-dark-bg/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-brand-primary transition-colors"
            title="Tải ảnh xuống"
          >
            <DownloadIcon />
          </a>
        </div>
      </div>
      {editedResult.text && (
         <div className="bg-dark-bg/50 border border-dark-border p-3 rounded-lg mt-2">
           <p className="text-sm text-medium-text italic">
             <span className="font-semibold text-light-text">Ghi chú từ AI:</span> "{editedResult.text}"
           </p>
         </div>
      )}
    </div>
  );
};

export default ResultDisplay;


import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptInput from './components/PromptInput';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';
import { MagicWandIcon } from './components/icons';
import { editImageWithNanoBanana } from './services/geminiService';
import type { EditedImageResult } from './types';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editedResult, setEditedResult] = useState<EditedImageResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setOriginalImageFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setEditedResult(null); // Clear previous result on new image upload
      setError(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!originalImageFile) {
      setError('Vui lòng tải ảnh lên trước.');
      return;
    }
    if (!prompt.trim()) {
      setError('Vui lòng nhập hướng dẫn chỉnh sửa.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedResult(null);

    try {
      const result = await editImageWithNanoBanana(originalImageFile, prompt);
      if (result) {
        setEditedResult(result);
      } else {
        setError('Model không trả về hình ảnh. Vui lòng thử một câu lệnh khác.');
      }
    } catch (e) {
      console.error(e);
      setError(`Đã xảy ra lỗi: ${e instanceof Error ? e.message : 'Lỗi không xác định'}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt]);

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-light-text font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Inputs */}
          <div className="bg-dark-card rounded-xl shadow-2xl p-6 flex flex-col gap-6 border border-dark-border">
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">1. Tải ảnh lên & Mô tả</h2>
            <ImageUploader onImageChange={handleImageChange} currentImageUrl={originalImageUrl} />
            <PromptInput value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !originalImageFile || !prompt}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <MagicWandIcon />
                  Áp dụng phép thuật
                </>
              )}
            </button>
          </div>

          {/* Right Panel: Output */}
          <div className="bg-dark-card rounded-xl shadow-2xl p-6 border border-dark-border flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">2. Xem kết quả</h2>
            {isLoading && (
              <div className="text-center">
                <Spinner size="lg" />
                <p className="mt-4 text-medium-text">Đang chỉnh sửa ảnh của bạn, vui lòng đợi...</p>
                <p className="text-sm text-gray-500">(Quá trình này có thể mất một lúc)</p>
              </div>
            )}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                <p className="font-bold">Lỗi</p>
                <p>{error}</p>
              </div>
            )}
            {!isLoading && !error && editedResult && originalImageUrl && (
              <ResultDisplay
                originalImageUrl={originalImageUrl}
                editedResult={editedResult}
              />
            )}
            {!isLoading && !error && !editedResult && (
              <div className="text-center text-medium-text">
                <p>Ảnh đã chỉnh sửa của bạn sẽ xuất hiện ở đây.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-medium-text text-sm">
        <p>Phát triển với Gemini API của Google</p>
      </footer>
    </div>
  );
};

export default App;

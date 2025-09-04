
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-dark-card/50 backdrop-blur-sm border-b border-dark-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          Trình chỉnh sửa ảnh AI ✨
        </h1>
      </div>
    </header>
  );
};

export default Header;


import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="prompt" className="block text-sm font-medium text-medium-text mb-2">
        Hướng dẫn chỉnh sửa
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={onChange}
        placeholder="ví dụ: 'Thêm một con robot thân thiện nhỏ bên cạnh người' hoặc 'Đổi nền thành thành phố tương lai vào ban đêm'"
        rows={4}
        className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 placeholder:text-gray-600"
      />
    </div>
  );
};

export default PromptInput;

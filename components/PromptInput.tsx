
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="prompt" className="block text-sm font-medium text-medium-text mb-2">
        Editing Instructions
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={onChange}
        placeholder="e.g., 'Add a small, friendly robot next to the person' or 'Change the background to a futuristic city at night'"
        rows={4}
        className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 placeholder:text-gray-600"
      />
    </div>
  );
};

export default PromptInput;

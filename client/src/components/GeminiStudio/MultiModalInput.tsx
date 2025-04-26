// MultiModalInput.tsx
import React, { useState } from 'react';
import { FiImage, FiFile, FiMic, FiCode } from 'react-icons/fi';

const MultiModalInput: React.FC = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'text':
        return (
          <textarea
            className="w-full h-64 p-3 border rounded-md"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter your prompt here..."
          />
        );
      case 'image':
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setImageUrl(e.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            
            {imageUrl ? (
              <div className="mt-2">
                <img src={imageUrl} alt="Uploaded" className="max-h-48
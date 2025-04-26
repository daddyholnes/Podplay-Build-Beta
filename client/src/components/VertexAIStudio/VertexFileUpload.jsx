import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileText, Image, Music, Video, File } from 'lucide-react';
import { Button } from '~/components/ui/Button';

export default function VertexFileUpload({ files, setFiles, acceptedTypes = '' }) {
  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: acceptedTypes ? { [acceptedTypes]: [] } : undefined
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    const type = file.type.split('/')[0];
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'audio':
        return <Music className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'text':
        return <FileText className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const renderPreview = (file, index) => {
    if (file.type.startsWith('image/')) {
      return (
        <div key={index} className="relative group">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="h-24 w-24 object-cover rounded-md border"
          />
          <button
            onClick={() => removeFile(index)}
            className="absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3 text-white" />
          </button>
          <p className="text-xs mt-1 truncate max-w-[96px]">{file.name}</p>
        </div>
      );
    }

    return (
      <div key={index} className="relative group flex flex-col items-center">
        <div className="h-24 w-24 border rounded-md flex items-center justify-center bg-muted">
          {getFileIcon(file)}
        </div>
        <button
          onClick={() => removeFile(index)}
          className="absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3 text-white" />
        </button>
        <p className="text-xs mt-1 truncate max-w-[96px]">{file.name}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {acceptedTypes === 'image/*' 
            ? 'Supported formats: JPG, PNG, GIF, WebP' 
            : acceptedTypes === 'audio/*'
            ? 'Supported formats: MP3, WAV, OGG, M4A'
            : 'Upload files to analyze'}
        </p>
      </div>

      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Uploaded Files ({files.length})</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFiles([])}
              className="h-8 text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {files.map((file, index) => renderPreview(file, index))}
          </div>
        </div>
      )}
    </div>
  );
}
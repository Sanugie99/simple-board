import React, { useState, useRef, useCallback } from 'react';
import { uploadFile } from '../../api/fileApi';
import { validateFileSize, validateFileType, formatFileSize } from '../../utils/fileUtils';
import './FileUploader.css';

const FileUploader = ({ onFileSelect, maxFiles = 5, maxSize = 5 * 1024 * 1024 }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = async (selectedFiles) => {
    const newErrors = [];
    const validFiles = [];

    // 파일 개수 검증
    if (files.length + selectedFiles.length > maxFiles) {
      newErrors.push(`최대 ${maxFiles}개의 파일만 업로드 가능합니다.`);
      setErrors(newErrors);
      return;
    }

    for (const file of selectedFiles) {
      // 파일 크기 검증
      if (!validateFileSize(file, maxSize)) {
        newErrors.push(`${file.name}: 파일 크기가 ${formatFileSize(maxSize)}를 초과합니다.`);
        continue;
      }

      // 파일 타입 검증
      if (!validateFileType(file)) {
        newErrors.push(`${file.name}: 지원하지 않는 파일 형식입니다.`);
        continue;
      }

      try {
        // 파일을 서버에 업로드
        setIsUploading(true);
        const response = await uploadFile(file);
        if (response.fileUrl) {
          const fileInfo = {
            name: file.name,
            size: file.size,
            type: file.type,
            url: response.fileUrl,
            id: Date.now() + Math.random()
          };
          validFiles.push(fileInfo);
        } else {
          newErrors.push(`${file.name}: 파일 업로드에 실패했습니다.`);
        }
      } catch (error) {
        newErrors.push(`${file.name}: 파일 업로드 중 오류가 발생했습니다.`);
      } finally {
        setIsUploading(false);
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFileSelect(updatedFiles);
    }
  };

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    await processFiles(selectedFiles);
    // 파일 입력 초기화
    event.target.value = '';
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  }, [files]);

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const handleLabelClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div 
      className={`file-uploader ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="file-uploader-header">
        <label 
          htmlFor="file-input" 
          className="file-input-label" 
          style={{ opacity: isUploading ? 0.5 : 1 }}
          onClick={handleLabelClick}
        >
          <span className="upload-icon">📁</span>
          {isUploading ? '업로드 중...' : '파일 선택'}
        </label>
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          multiple
          onChange={handleFileSelect}
          className="file-input"
          accept="image/*,.pdf,.doc,.docx,.txt"
          disabled={isUploading}
        />
        <span className="file-info">
          최대 {maxFiles}개, {formatFileSize(maxSize)}까지
        </span>
      </div>

      <div className="drag-drop-area">
        <div className="drag-drop-text">
          <span className="drag-icon">📤</span>
          <p>파일을 여기에 드래그하거나 위의 버튼을 클릭하세요</p>
          <p className="drag-hint">지원 형식: 이미지, PDF, DOC, DOCX, TXT</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              {error}
              <button onClick={clearErrors} className="error-close">×</button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="file-list">
          <h4>선택된 파일 ({files.length}/{maxFiles})</h4>
          {files.map((file) => (
            <div key={file.id} className="file-item">
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="remove-file-btn"
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader; 
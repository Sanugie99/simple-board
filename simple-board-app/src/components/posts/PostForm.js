import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../api/postApi';
import { validateForm } from '../../utils/validationUtils';
import { useAuth } from '../../contexts/AuthContext';
import FileUploader from '../common/FileUploader';
import RichTextEditor from '../common/RichTextEditor';
import './PostForm.css';

const PostForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: ''
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { value: 'DEV', label: '개발' },
    { value: 'GENERAL', label: '일반' },
    { value: 'QNA', label: '질문' },
    { value: 'NOTICE', label: '공지' }
  ];

  // 로그인 체크
  if (!user) {
    return (
      <div className="post-form-container">
        <div className="auth-required">
          <h2>로그인이 필요합니다</h2>
          <p>게시글을 작성하려면 로그인해주세요.</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
    
    // 입력 시 해당 필드의 에러 제거
    if (errors.content) {
      setErrors(prev => ({
        ...prev,
        content: ''
      }));
    }
  };

  const handleFileSelect = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateForm(formData, 'post');
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    
    try {
      const postData = {
        ...formData,
        fileUrls: files.map(file => file.url || file.base64)
      };

      const response = await createPost(postData, user.userId);
      if (response.id) {
        alert('게시글이 성공적으로 작성되었습니다.');
        navigate('/');
      } else {
        setErrors({ general: response.message || '게시글 작성에 실패했습니다.' });
      }
    } catch (error) {
      setErrors({ general: '게시글 작성 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
      navigate('/');
    }
  };

  return (
    <div className="post-form-container">
      <div className="post-form-header">
        <h2>게시글 작성</h2>
        <button onClick={handleCancel} className="cancel-button">
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit} className="post-form">
        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="category">카테고리 *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={errors.category ? 'error' : ''}
          >
            <option value="">카테고리를 선택하세요</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="title">제목 *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={errors.title ? 'error' : ''}
            placeholder="제목을 입력하세요 (1-100자)"
            maxLength={100}
          />
          <div className="input-counter">
            {formData.title.length}/100
          </div>
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="content">내용 *</label>
          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="내용을 입력하세요..."
            error={errors.content}
          />
          <div className="input-counter">
            {formData.content.replace(/<[^>]*>/g, '').length}/10000
          </div>
        </div>

        <div className="form-group">
          <label>첨부파일</label>
          <FileUploader onFileSelect={handleFileSelect} maxFiles={5} />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary">
            취소
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? '작성 중...' : '게시글 작성'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm; 
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPostDetail, updatePost } from '../api/postApi';
import { validateForm } from '../utils/validationUtils';
import FileUploader from '../components/common/FileUploader';
import RichTextEditor from '../components/common/RichTextEditor';
import '../components/posts/PostForm.css';

const EditPostPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: ''
  });
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);

  const categories = [
    { value: 'DEV', label: '개발' },
    { value: 'GENERAL', label: '일반' },
    { value: 'QNA', label: '질문' },
    { value: 'NOTICE', label: '공지' }
  ];

  // 기존 게시글 정보 로드
  useEffect(() => {
    const loadPost = async () => {
      if (!postId || !user) {
        setIsLoadingPost(false);
        return;
      }

      try {
        const post = await getPostDetail(postId, user.userId);
        
        // 작성자 확인
        if (post.authorUserId !== user.userId) {
          alert('게시글을 수정할 권한이 없습니다.');
          navigate('/mypage');
          return;
        }

        setFormData({
          category: post.category,
          title: post.title,
          content: post.content
        });

        // 기존 파일 정보 설정
        if (post.fileUrls && post.fileUrls.length > 0) {
          const existingFileList = post.fileUrls.map((url, index) => ({
            id: `existing-${index}`,
            name: url.split('/').pop() || `파일${index + 1}`,
            url: url,
            size: 0, // 기존 파일은 크기 정보가 없으므로 0으로 설정
            isExisting: true
          }));
          setExistingFiles(existingFileList);
        }
      } catch (error) {
        console.error('게시글 로드 오류:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다.');
        navigate('/mypage');
      } finally {
        setIsLoadingPost(false);
      }
    };

    loadPost();
  }, [postId, user, navigate]);

  // 로그인 체크
  if (!user) {
    return (
      <div className="post-form-container">
        <div className="auth-required">
          <h2>로그인이 필요합니다</h2>
          <p>게시글을 수정하려면 로그인해주세요.</p>
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

  const handleRemoveExistingFile = (fileId) => {
    setExistingFiles(prev => prev.filter(file => file.id !== fileId));
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
        fileUrls: [
          ...existingFiles.map(file => file.url),
          ...files.map(file => file.url || file.base64)
        ]
      };

      const response = await updatePost(postId, postData, user.userId);
      if (response.id) {
        alert('게시글이 성공적으로 수정되었습니다.');
        navigate(`/post/${postId}`);
      } else {
        setErrors({ general: response.message || '게시글 수정에 실패했습니다.' });
      }
    } catch (error) {
      setErrors({ general: error.message || '게시글 수정 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
      navigate(`/post/${postId}`);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="post-form-container">
        <div className="loading-message">
          <h2>게시글을 불러오는 중...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="post-form-container">
      <div className="post-form-header">
        <h2>게시글 수정</h2>
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
          
          {/* 기존 파일 목록 */}
          {existingFiles.length > 0 && (
            <div className="existing-files">
              <h4>기존 파일</h4>
              <div className="file-list">
                {existingFiles.map((file) => (
                  <div key={file.id} className="file-item existing">
                    <span className="file-name">{file.name}</span>
                    <button
                      type="button"
                      className="remove-file"
                      onClick={() => handleRemoveExistingFile(file.id)}
                      title="파일 제거"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 새 파일 업로드 */}
          <FileUploader onFileSelect={handleFileSelect} maxFiles={5 - existingFiles.length} />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary">
            취소
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? '수정 중...' : '게시글 수정'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage; 
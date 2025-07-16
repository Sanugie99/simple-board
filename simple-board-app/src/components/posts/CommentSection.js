import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createComment, getCommentsByPostId, updateComment, deleteComment } from '../../api/commentApi';
import './CommentSection.css';

/**
 * 댓글 섹션
 */

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    getComments();
  }, [postId]);

  const getComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await getCommentsByPostId(postId);
      if (response.success) {
        setComments(response.comments || []);
      }
    } catch (error) {
      console.error('댓글 로드 오류:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (newComment.trim().length > 1000) {
      alert('댓글은 1000자를 초과할 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await createComment(postId, newComment.trim(), user.userId);
      
      if (response.success) {
        setNewComment('');
        await getComments();
        alert('댓글이 작성되었습니다.');
      } else {
        alert(response.message || '댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      alert(error.message || '댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 수정 시작
  const handleStartEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  // 댓글 수정 완료
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (editContent.trim().length > 1000) {
      alert('댓글은 1000자를 초과할 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await updateComment(commentId, editContent.trim(), user.userId);
      
      if (response.success) {
        setEditingComment(null);
        setEditContent('');
        await getComments();
        alert('댓글이 수정되었습니다.');
      } else {
        alert(response.message || '댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      alert(error.message || '댓글 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await deleteComment(commentId, user.userId);
      
      if (response.success) {
        await getComments();
        alert('댓글이 삭제되었습니다.');
      } else {
        alert(response.message || '댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      alert(error.message || '댓글 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (isLoadingComments) {
    return (
      <div className="comment-section">
        <h3>댓글</h3>
        <div className="loading-comments">댓글을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="comment-section">
      <h3>댓글 ({comments.length})</h3>
      
      {/* 댓글 작성 폼 */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            maxLength={1000}
            disabled={isLoading}
          />
          <div className="comment-form-footer">
            <span className="character-count">{newComment.length}/1000</span>
            <button type="submit" disabled={isLoading || !newComment.trim()}>
              {isLoading ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      ) : (
        <div className="login-required">
          <p>댓글을 작성하려면 로그인이 필요합니다.</p>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.authorName}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
                {comment.updatedAt !== comment.createdAt && (
                  <span className="comment-edited">(수정됨)</span>
                )}
              </div>
              
              {editingComment === comment.id ? (
                <div className="comment-edit-form">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    maxLength={1000}
                    disabled={isLoading}
                  />
                  <div className="comment-edit-actions">
                    <span className="character-count">{editContent.length}/1000</span>
                    <div className="edit-buttons">
                      <button 
                        type="button" 
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={isLoading || !editContent.trim()}
                      >
                        {isLoading ? '수정 중...' : '수정'}
                      </button>
                      <button 
                        type="button" 
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="comment-content">
                  <p>{comment.content}</p>
                  
                  {/* 댓글 작성자만 수정/삭제 버튼 표시 */}
                  {user && user.userId === comment.authorUserId && (
                    <div className="comment-actions">
                      <button 
                        type="button" 
                        onClick={() => handleStartEdit(comment)}
                        className="action-link"
                      >
                        수정
                      </button>
                      <span className="action-separator">|</span>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="action-link"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection; 
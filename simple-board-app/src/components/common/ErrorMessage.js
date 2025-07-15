import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry, retryText = '다시 시도' }) => {
  return (
    <div className="error-message-container">
      <div className="error-message">
        <p>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 
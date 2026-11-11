import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './StoryViewer.css';

const StoryViewer = ({ story, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      onClose();
    }, 10000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 100);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(progressInterval);
    };
  }, [onClose]);

  return (
    <div className="story-viewer-overlay">
      <div className="story-viewer-container">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="story-header">
          <img src={story.avatar} alt={story.username} className="viewer-avatar" />
          <span className="viewer-username">{story.username}</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="story-content">
          <img src={story.image} alt="Story content" className="story-image" />
        </div>
      </div>
    </div>
  );
};

StoryViewer.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StoryViewer;

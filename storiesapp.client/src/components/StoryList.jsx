import PropTypes from 'prop-types';
import './StoryList.css';

const StoryList = ({ stories, viewedStories, onStoryClick }) => {
    return (
        <div className="stories-tray">
            {stories.map((story) => {
                const isViewed = viewedStories.includes(story.id);
                return (
                    <div
                        key={story.id}
                        className={`story-circle-wrapper ${isViewed ? 'viewed' : 'new'}`}
                        onClick={() => onStoryClick(story)}
                    >
                        <div className="story-circle">
                            <img src={story.avatar} alt={story.username} />
                        </div>
                        <span className="story-username">{story.username}</span>
                    </div>
                );
            })}
        </div>
    );
};

StoryList.propTypes = {
    stories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
        })
    ).isRequired,
    viewedStories: PropTypes.arrayOf(PropTypes.number).isRequired,
    onStoryClick: PropTypes.func.isRequired,
};

export default StoryList;

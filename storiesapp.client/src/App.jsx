import { Component } from 'react';
import StoryList from './components/StoryList';
import StoryViewer from './components/StoryViewer';
import AuthForm from './components/AuthForm';
import AddStoryForm from './components/AddStoryForm';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
            stories: [],
            viewedStories: JSON.parse(localStorage.getItem('viewedStories')) || [],
            activeStory: null
        };
    }

    componentDidMount() {
        this.loadStories();
    }

    loadStories = () => {
        fetch('api/stories')
            .then(res => res.json())
            .then(data => this.setState({ stories: data }))
            .catch(err => console.error('Ошибка загрузки историй:', err));
    };

    handleLogin = (user) => {
        this.setState({ currentUser: user });
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    handleLogout = () => {
        this.setState({ currentUser: null });
        localStorage.removeItem('currentUser');
    };

    handleStoryClick = (story) => {
        this.setState(prevState => {
            const updatedViewed = prevState.viewedStories.includes(story.id)
                ? prevState.viewedStories
                : [...prevState.viewedStories, story.id];

            localStorage.setItem('viewedStories', JSON.stringify(updatedViewed));
            return {
                activeStory: story,
                viewedStories: updatedViewed
            };
        });
    };

    handleCloseStory = () => {
        this.setState({ activeStory: null });
    };

    handleAddStory = (username, avatar, image) => {
        fetch('api/stories/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, avatar, image })
        })
            .then(res => {
                if (!res.ok) throw new Error('Не удалось добавить историю');
                return res.json();
            })
            .then(newStory => {
                this.setState(prevState => ({
                    stories: [newStory, ...prevState.stories]
                }));
            })
            .catch(err => alert(err.message));
    };

    render() {
        const { stories, viewedStories, activeStory, currentUser } = this.state;

        return (
            <div className="app-container">
                <header className="app-header">
                    <h1>Stories App</h1>
                    {currentUser && (
                        <div className="user-profile">
                            <img src={currentUser.avatar} alt="Avatar" className="nav-avatar" />
                            <span>{currentUser.username}</span>
                            <button onClick={this.handleLogout} className="logout-btn">Выйти</button>
                        </div>
                    )}
                </header>

                <main className="app-main">
                    <StoryList
                        stories={stories}
                        viewedStories={viewedStories}
                        onStoryClick={this.handleStoryClick}
                    />

                    {currentUser ? (
                        <AddStoryForm currentUser={currentUser} onAddStory={this.handleAddStory} />
                    ) : (
                        <AuthForm onLogin={this.handleLogin} />
                    )}

                    {activeStory && (
                        <StoryViewer story={activeStory} onClose={this.handleCloseStory} />
                    )}
                </main>
            </div>
        );
    }
}

export default App;


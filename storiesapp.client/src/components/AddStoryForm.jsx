import { Component } from 'react';
import PropTypes from 'prop-types';

class AddStoryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageBase64: '',
            fileName: '',
            error: ''
        };
    }

    handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        this.setState({ fileName: file.name, error: '' });
        const reader = new FileReader();
        reader.onloadend = () => {
            this.setState({ imageBase64: reader.result });
        };
        reader.readAsDataURL(file);
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { imageBase64 } = this.state;
        const { onAddStory, currentUser } = this.props;

        if (!imageBase64) {
            this.setState({ error: 'Сначала выберите картинку с компьютера' });
            return;
        }

        onAddStory(currentUser.username, currentUser.avatar, imageBase64);
        this.setState({ imageBase64: '', fileName: '', error: '' });
    };

    render() {
        const { fileName, imageBase64, error } = this.state;

        return (
            <div className="glass-card">
                <h2 className="card-title">Новая история</h2>
                <p className="card-subtitle">Поделитесь фото с подписчиками на 10 секунд</p>

                <form onSubmit={this.handleSubmit} className="modern-form">
                    <label className="story-dropzone">
                        {imageBase64 ? (
                            <div className="preview-wrapper">
                                <img src={imageBase64} alt="Предпросмотр" className="story-upload-preview" />
                                <span className="change-photo-badge">Нажмите, чтобы заменить фото</span>
                            </div>
                        ) : (
                            <div className="dropzone-placeholder">
                                <span className="upload-icon">📸</span>
                                <span className="upload-text">Нажмите, чтобы выбрать фото</span>
                                <span className="upload-hint">Поддерживаются JPG, PNG, WEBP</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={this.handleFileChange} hidden />
                    </label>

                    {fileName && <p className="selected-file-name">Файл: {fileName}</p>}
                    {error && <div className="error-badge">{error}</div>}

                    <button type="submit" className="primary-gradient-btn">
                        Опубликовать историю
                    </button>
                </form>
            </div>
        );
    }
}

AddStoryForm.propTypes = {
    currentUser: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
    }).isRequired,
    onAddStory: PropTypes.func.isRequired,
};

export default AddStoryForm;

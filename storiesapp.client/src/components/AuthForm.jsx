import { useState } from 'react';
import PropTypes from 'prop-types';

const AuthForm = ({ onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatarBase64, setAvatarBase64] = useState('');
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarBase64(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Заполните имя пользователя и пароль');
            return;
        }

        const endpoint = isLoginMode ? 'api/stories/login' : 'api/stories/register';
        const payload = isLoginMode
            ? { username, password }
            : { username, password, avatar: avatarBase64 || '/images/default-avatar.png' };

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || 'Ошибка сервера');
                }
                return res.json();
            })
            .then((data) => {
                if (isLoginMode) {
                    onLogin(data);
                } else {
                    alert('Аккаунт создан! Теперь войдите в систему.');
                    setIsLoginMode(true);
                    setPassword('');
                    setAvatarBase64('');
                    setFileName('');
                }
            })
            .catch((err) => setError(err.message));
    };

    return (
        <div className="glass-card">
            <h2 className="card-title">{isLoginMode ? 'С возвращением' : 'Создать аккаунт'}</h2>
            <p className="card-subtitle">
                {isLoginMode ? 'Войдите, чтобы делиться моментами' : 'Присоединяйтесь к ленте историй'}
            </p>

            <form onSubmit={handleSubmit} className="modern-form">
                <div className="input-group">
                    <label>Логин</label>
                    <input
                        type="text"
                        placeholder="Введите имя..."
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Пароль</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                {!isLoginMode && (
                    <div className="input-group">
                        <label>Фото профиля (необязательно)</label>
                        <label className="file-upload-btn">
                            <span>{fileName ? `Выбрано: ${fileName}` : '📁 Выбрать файл с компьютера'}</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                        </label>
                    </div>
                )}

                {error && <div className="error-badge">{error}</div>}

                <button type="submit" className="primary-gradient-btn">
                    {isLoginMode ? 'Войти в аккаунт' : 'Зарегистрироваться'}
                </button>
            </form>

            <div className="auth-switch">
                <span>{isLoginMode ? 'Впервые здесь?' : 'Уже есть профиль?'}</span>
                <button
                    type="button"
                    className="link-btn"
                    onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
                >
                    {isLoginMode ? 'Создать аккаунт' : 'Войти'}
                </button>
            </div>
        </div>
    );
};

AuthForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default AuthForm;

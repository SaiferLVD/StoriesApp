using Microsoft.AspNetCore.Mvc;
using StoriesApp.Server.Models;
using System.Text.Json;

namespace StoriesApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoriesController : ControllerBase
    {
        private static readonly string UsersFile = "users_db.json";
        private static readonly string StoriesFile = "stories_db.json";
        private static readonly object _lock = new();

        private List<UserDto> LoadUsers()
        {
            if (!System.IO.File.Exists(UsersFile))
            {
                var defaultUsers = new List<UserDto>
                {
                    new UserDto { Username = "admin", Password = "123", Avatar = "/images/avatar1.jpg" },
                    new UserDto { Username = "traveler", Password = "123", Avatar = "/images/avatar2.jpg" }
                };
                SaveUsers(defaultUsers);
                return defaultUsers;
            }
            var json = System.IO.File.ReadAllText(UsersFile);
            return JsonSerializer.Deserialize<List<UserDto>>(json) ?? new List<UserDto>();
        }

        private void SaveUsers(List<UserDto> users)
        {
            var json = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(UsersFile, json);
        }

        private List<Story> LoadStories()
        {
            if (!System.IO.File.Exists(StoriesFile))
            {
                var defaultStories = new List<Story>
                {
                    new Story { Id = 1, Username = "admin", Avatar = "/images/avatar1.jpg", Image = "/images/story1.jpg" },
                    new Story { Id = 2, Username = "traveler", Avatar = "/images/avatar2.jpg", Image = "/images/story2.jpg" }
                };
                SaveStories(defaultStories);
                return defaultStories;
            }
            var json = System.IO.File.ReadAllText(StoriesFile);
            return JsonSerializer.Deserialize<List<Story>>(json) ?? new List<Story>();
        }

        private void SaveStories(List<Story> stories)
        {
            var json = JsonSerializer.Serialize(stories, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(StoriesFile, json);
        }

        [HttpGet]
        public IActionResult GetStories()
        {
            lock (_lock)
            {
                var stories = LoadStories();
                return Ok(stories.OrderByDescending(s => s.Id));
            }
        }

        [HttpPost("register")]
        [RequestSizeLimit(52428800)] // Лимит 50 МБ для загрузки фото
        public IActionResult Register([FromBody] UserDto user)
        {
            if (string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.Password))
                return BadRequest("Имя и пароль обязательны.");

            lock (_lock)
            {
                var users = LoadUsers();
                if (users.Any(u => u.Username.Equals(user.Username.Trim(), StringComparison.OrdinalIgnoreCase)))
                    return BadRequest("Пользователь с таким именем уже существует.");

                user.Username = user.Username.Trim();
                if (string.IsNullOrWhiteSpace(user.Avatar))
                    user.Avatar = "/images/default-avatar.png";

                users.Add(user);
                SaveUsers(users);
                return Ok(new { message = "Регистрация успешна" });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserDto loginData)
        {
            lock (_lock)
            {
                var users = LoadUsers();
                var user = users.FirstOrDefault(u =>
                    u.Username.Equals(loginData.Username?.Trim(), StringComparison.OrdinalIgnoreCase) &&
                    u.Password == loginData.Password);

                if (user == null)
                    return Unauthorized("Неверное имя пользователя или пароль.");

                return Ok(new { username = user.Username, avatar = user.Avatar });
            }
        }

        [HttpPost("add")]
        [RequestSizeLimit(52428800)] // Лимит 50 МБ для загрузки фото
        public IActionResult AddStory([FromBody] NewStoryDto newStory)
        {
            if (string.IsNullOrWhiteSpace(newStory.Image))
                return BadRequest("Выберите изображение для истории.");

            lock (_lock)
            {
                var stories = LoadStories();
                var story = new Story
                {
                    Id = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Username = newStory.Username,
                    Avatar = newStory.Avatar,
                    Image = newStory.Image
                };

                stories.Add(story);
                SaveStories(stories);
                return Ok(story);
            }
        }
    }
}

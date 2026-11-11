namespace StoriesApp.Server.Models
{
    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
    }

    public class NewStoryDto
    {
        public string Username { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
    }

    public class Story
    {
        public long Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
    }
}

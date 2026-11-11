var builder = WebApplication.CreateBuilder(args);

// 1. Включаем поддержку API-контроллеров
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 2. Подключаем маршруты из нашего StoriesController
app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

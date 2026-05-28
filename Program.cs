using WebAppidistribuidora.Data;

var builder = WebApplication.CreateBuilder(args);

// Servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Conexión helper
builder.Services.AddScoped<DbHelper>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTodo", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

// HTTPS desactivado para evitar problemas locales
// app.UseHttpsRedirection();

// CORS
app.UseCors("PermitirTodo");

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
using AlpTaskManager.API.Middlewares;
using AlpTaskManager.Application.Interfaces;
using AlpTaskManager.Application.Mappings;
using AlpTaskManager.Application.Services;
using AlpTaskManager.Application.Validators;
using AlpTaskManager.Core.Interfaces;
using AlpTaskManager.Infrastructure.Context;
using AlpTaskManager.Infrastructure.Repositories;
using FluentValidation.AspNetCore;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events; 

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information() 
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning) 
    .MinimumLevel.Override("System", LogEventLevel.Warning)    
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Warning) 
    .WriteTo.Console() 
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day) 
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateTaskValidator>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        b => b.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();



app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        
        context.Database.Migrate(); 
        
        Log.Information("Veritabanı migration işlemi başarıyla tamamlandı.");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Veritabanı migration sırasında hata oluştu.");
    }
}

app.Run();
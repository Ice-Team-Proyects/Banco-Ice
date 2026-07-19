using AuthService.Api.Extensions;
using AuthService.Api.Middlewares;
using AuthService.Api.ModelBinders;
using AuthService.Persistence.Data;
using NetEscapades.AspNetCore.SecurityHeaders.Infrastructure;
using Serilog;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORRECCIÓN: Omitir validación SSL (Cloudinary, etc.)
System.Net.ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;

// Configure Serilog from appsettings.json only (avoid duplicate sinks)
builder.Host.UseSerilog((context, services, loggerConfiguration) =>
    loggerConfiguration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services));

// Add services to the container
builder.Services.AddControllers(options =>
{
    // Agregar el enlazador de modelos para IFileData
    options.ModelBinderProviders.Insert(0, new FileDataModelBinderProvider());
})
.AddJsonOptions(o =>
{
    // Estandarizar respuestas en camelCase para coincidir con auth-node
    o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

// Configure services through extension methods
builder.Services.AddApiDocumentation();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
var jwtSection = builder.Configuration.GetSection("JwtSettings");
Console.WriteLine($"JWT CONFIG - Issuer: '{jwtSection["Issuer"]}' Audience: '{jwtSection["Audience"]}' Key: '{jwtSection["SecretKey"]?.Substring(0, 10)}...'");
builder.Services.AddRateLimitingPolicies();

// Add security services
builder.Services.AddSecurityPolicies(builder.Configuration);
builder.Services.AddSecurityOptions();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Add Serilog request logging
app.UseSerilogRequestLogging();

// Add Security Headers using NetEscapades package
app.UseSecurityHeaders(policies => policies
    .AddDefaultSecurityHeaders()
    .RemoveServerHeader()
);

// Manejo global de excepciones
app.UseMiddleware<GlobalExceptionMiddleware>();

// Middlewares principales
//app.UseHttpsRedirection();
app.UseCors("DefaultCorsPolicy");
app.UseRateLimiter();
app.Use(async (context, next) =>
{
    var auth = context.Request.Headers["Authorization"].ToString();
    Console.WriteLine($"AUTH HEADER RAW: '{auth}'");
    await next();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Endpoints de verificación de salud - ambas versiones para compatibilidad
// Endpoint estándar de verificación de salud
app.MapHealthChecks("/health");

// Endpoint personalizado de salud para coincidir con formato de respuesta Node.js
app.MapGet("/health", () =>
{
    var response = new
    {
        status = "Saludable",
        timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    };
    return Results.Ok(response);
});

app.MapHealthChecks("/api/v1/health");

// Log de inicio: direcciones y endpoint de salud
var startupLogger = app.Services.GetRequiredService<ILogger<Program>>();
app.Lifetime.ApplicationStarted.Register(() =>
{
    try
    {
        var server = app.Services.GetRequiredService<IServer>();
        var addressesFeature = server.Features.Get<IServerAddressesFeature>();
        var addresses = (IEnumerable<string>?)addressesFeature?.Addresses ?? app.Urls;

        if (addresses != null && addresses.Any())
        {
            foreach (var addr in addresses)
            {
                var health = $"{addr.TrimEnd('/')}/health";
                startupLogger.LogInformation("API de AuthService está ejecutándose en {Url}. Endpoint de salud: {HealthUrl}", addr, health);
            }
        }
        else
        {
            startupLogger.LogInformation("API de AuthService iniciada. Endpoint de salud: /health");
        }
    }
    catch (Exception ex)
    {
        startupLogger.LogWarning(ex, "Fallo al determinar las direcciones de escucha para el log de inicio");
    }
});

// Inicializar base de datos y datos semilla
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        logger.LogInformation("Verificando conexión a la base de datos...");

        // Garantizar que la base de datos se crea (similar a Sequelize sync en Node.js)
        await context.Database.MigrateAsync();

        logger.LogInformation("Base de datos lista. Ejecutando datos semilla...");
        await DataSeeder.SeendAsync(context);

        logger.LogInformation("Inicialización de base de datos completada exitosamente");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Ocurrió un error al inicializar la base de datos");
        throw; // Relanzar para detener la aplicación
    }
}

app.Run();

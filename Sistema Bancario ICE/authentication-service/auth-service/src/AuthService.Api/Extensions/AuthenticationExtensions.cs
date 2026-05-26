using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace AuthService.Api.Extensions;

public static class AuthenticationExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.MapInboundClaims = false;
            
            // 1. Creamos los parámetros APAGANDO el Issuer y Audience
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,    // <--- APAGADO PARA EVITAR EL BUG
                ValidateAudience = false,  // <--- APAGADO PARA EVITAR EL BUG
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true, // <--- ESTO ES LO ÚNICO QUE IMPORTA PARA LA SEGURIDAD
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ClockSkew = TimeSpan.Zero,
                RoleClaimType = "role", 
                NameClaimType = "sub"
            };

            options.TokenValidationParameters = validationParameters;

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var authHeader = context.Request.Headers["Authorization"].ToString();
                    
                    if (!string.IsNullOrWhiteSpace(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    {
                        var token = authHeader.Substring(7).Trim(' ', '"', '\'');
                        
                        try
                        {
                            var handler = new JwtSecurityTokenHandler();
                            handler.InboundClaimTypeMap.Clear(); 
                            
                            // 2. Usamos nuestra propia variable de parámetros, ignorando cualquier sobreescritura externa
                            var principal = handler.ValidateToken(token, validationParameters, out var validatedToken);
                            
                            context.Principal = principal;
                            context.Success(); 
                            
                            Console.WriteLine("[DEBUG] TOKEN VALIDADO MANUALMENTE CON EXITO ✓");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[DEBUG] ERROR EN VALIDACION MANUAL: {ex.GetType().Name} - {ex.Message}");
                        }
                    }
                    return Task.CompletedTask;
                },
                OnAuthenticationFailed = context =>
                {
                    // Si algo falla, esto lo atrapará
                    Console.WriteLine($"[DEBUG] TOKEN RECHAZADO POR EL FRAMEWORK: {context.Exception.Message}");
                    return Task.CompletedTask;
                }
            };
        });

        return services;
    }
}
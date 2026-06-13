using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using AuthService.Application.Interfaces;

namespace AuthService.Application.Services;

public class EmailService(IConfiguration configuration, ILogger<EmailService> logger) : IEmailService
{
    public async Task SendEmailVerificationAsync(string email, string username, string token)
    {
        var subject = "Verifica tu dirección de correo electrónico";
        var verificationUrl = $"{configuration["AppSettings:FrontendUrl"]}/verify-email?token={token}";
                var htmlBody = $@"
                        <div style='font-family: Arial,Helvetica,sans-serif; background:#f4f6f9; padding:30px;'>
                            <div style='max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e6e9ef;'>
                                <div style='padding:24px 28px;background:linear-gradient(90deg,#003A8F,#1a5cb8);color:#fff'>
                                    <h1 style='margin:0;font-size:20px'>Banco ICE</h1>
                                </div>
                                <div style='padding:28px;color:#0a1628'>
                                    <h2 style='margin-top:0'>¡Hola {username}!</h2>
                                    <p style='color:#475569'>Gracias por registrarte en Banco ICE. Para completar tu registro, confirma tu correo haciendo clic en el botón de abajo.</p>
                                    <p style='text-align:center;margin:24px 0'>
                                        <a href='{verificationUrl}' style='display:inline-block;background:#003A8F;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:600;'>Verificar mi correo</a>
                                    </p>
                                    <p style='color:#475569;font-size:13px'>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
                                    <p style='word-break:break-all;color:#0b2a66;font-size:13px'>{verificationUrl}</p>
                                    <p style='color:#94a3b8;font-size:13px;margin-top:18px'>Este enlace expirará en 24 horas. Si no reconoces esta acción, ignora este correo.</p>
                                </div>
                                <div style='padding:16px 28px;background:#fbfdff;border-top:1px solid #eef2f7;color:#64748b;font-size:13px'>
                                    <p style='margin:0'>¿Necesitas ayuda? Contáctanos en <strong>{configuration["SmtpSettings:FromEmail"]}</strong></p>
                                </div>
                            </div>
                        </div>
                ";

                var textBody = $"Hola {username}!\n\nVisita la siguiente URL para verificar tu correo:\n{verificationUrl}\n\nEste enlace expirará en 24 horas. Si no solicitaste esto, ignora este correo.";

                await SendEmailAsync(email, subject, htmlBody, textBody);
    }

    public async Task SendPasswordResetAsync(string email, string username, string token)
    {
        var subject = "Restablece tu contraseña";
        var resetUrl = $"{configuration["AppSettings:FrontendUrl"]}/reset-password?token={token}";
                var htmlBody = $@"
                        <div style='font-family: Arial,Helvetica,sans-serif; background:#f9fafb; padding:30px;'>
                            <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e6e9ef;'>
                                <div style='padding:20px 24px;background:#111827;color:#fff'>
                                    <h1 style='margin:0;font-size:18px'>Restablecer contraseña</h1>
                                </div>
                                <div style='padding:24px;color:#0a1628'>
                                    <p>Hola {username},</p>
                                    <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón a continuación para continuar:</p>
                                    <p style='text-align:center;margin:20px 0'>
                                        <a href='{resetUrl}' style='display:inline-block;background:#dc3545;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;'>Restablecer Contraseña</a>
                                    </p>
                                    <p style='color:#475569;font-size:13px'>Si no solicitaste este cambio, ignora este correo. El enlace expirará en 1 hora.</p>
                                </div>
                                <div style='padding:12px 18px;background:#f8fafc;border-top:1px solid #eef2f7;color:#64748b;font-size:13px'>
                                    <p style='margin:0'>Si necesitas ayuda, responde a este correo.</p>
                                </div>
                            </div>
                        </div>
                ";

                var textBody = $"Hola {username}!\n\nUsa la siguiente URL para restablecer tu contraseña:\n{resetUrl}\n\nEl enlace expirará en 1 hora. Si no solicitaste esto, ignora este correo.";

                await SendEmailAsync(email, subject, htmlBody, textBody);
    }

    public async Task SendWelcomeEmailAsync(string email, string username)
    {
                var subject = "¡Bienvenido a Banco ICE!";

                var htmlBody = $@"
                        <div style='font-family: Arial,Helvetica,sans-serif; background:#f4f6f9; padding:30px;'>
                            <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e6e9ef;'>
                                <div style='padding:20px 24px;background:linear-gradient(90deg,#003A8F,#1a5cb8);color:#fff'>
                                    <h1 style='margin:0;font-size:18px'>Bienvenido a Banco ICE</h1>
                                </div>
                                <div style='padding:24px;color:#0a1628'>
                                    <h2 style='margin-top:0'>¡Hola {username}!</h2>
                                    <p style='color:#475569'>Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión y comenzar a usar nuestros servicios bancarios.</p>
                                    <p style='margin-top:16px'>Te recomendamos revisar la sección de ayuda si necesitas orientación sobre las funciones disponibles.</p>
                                    <p style='margin-top:18px;color:#94a3b8;font-size:13px'>Gracias por confiar en Banco ICE.</p>
                                </div>
                                <div style='padding:12px 18px;background:#fbfdff;border-top:1px solid #eef2f7;color:#64748b;font-size:13px'>
                                    <p style='margin:0'>¿Dudas? Contacta a <strong>{configuration["SmtpSettings:FromEmail"]}</strong></p>
                                </div>
                            </div>
                        </div>
                ";

                var textBody = $"Hola {username}!\n\nTu cuenta en Banco ICE ha sido activada. Ya puedes iniciar sesión en la plataforma.\n\nGracias por unirte.";

                await SendEmailAsync(email, subject, htmlBody, textBody);
    }

    private async Task SendEmailAsync(string to, string subject, string? htmlBody, string? textBody = null)
    {
        var smtpSettings = configuration.GetSection("SmtpSettings");

        try
        {
            // Verificar si el email está habilitado
            var enabled = bool.Parse(smtpSettings["Enabled"] ?? "true");
            if (!enabled)
            {
                logger.LogInformation("El envío de emails está deshabilitado en la configuración. Omitiendo envío");
                return;
            }

            // Validar configuración
            var host = smtpSettings["Host"];
            var portString = smtpSettings["Port"];
            var username = smtpSettings["Username"];
            var password = smtpSettings["Password"];
            var fromEmail = smtpSettings["FromEmail"];
            var fromName = smtpSettings["FromName"];

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                logger.LogError("La configuración SMTP no está configurada correctamente");
                throw new InvalidOperationException("La configuración SMTP no está configurada correctamente");
            }

            // Avoid logging sensitive SMTP details

            var port = int.Parse(portString ?? "587");

            using var client = new SmtpClient();

            // Configurar timeout
            var timeoutMs = int.Parse(smtpSettings["Timeout"] ?? "30000");
            client.Timeout = timeoutMs;

            try
            {
                // Configurar validación de certificados SSL
                var ignoreCertErrors = bool.Parse(smtpSettings["IgnoreCertificateErrors"] ?? "false");
                if (ignoreCertErrors)
                {
                    logger.LogWarning("Validación de certificados SSL deshabilitada. Solo usar en desarrollo.");
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                }
 
                // Verificar configuración de SSL implícito
                var useImplicitSsl = bool.Parse(smtpSettings["UseImplicitSsl"] ?? "false");

                // Configuración específica por puerto y SSL
                if (useImplicitSsl || port == 465)
                {
                    await client.ConnectAsync(host, port, SecureSocketOptions.SslOnConnect);
                }
                else if (port == 587)
                {
                    await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                }
                else
                {
                    await client.ConnectAsync(host, port, SecureSocketOptions.Auto);
                }

                // Autenticación
                await client.AuthenticateAsync(username, password);

                // Crear mensaje con MimeKit (multipart alternative: text + html)
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromEmail));
                message.To.Add(new MailboxAddress("", to));
                message.Subject = subject;

                var builder = new MimeKit.BodyBuilder();
                builder.HtmlBody = htmlBody ?? textBody ?? string.Empty;
                builder.TextBody = textBody ?? StripHtmlToPlainText(htmlBody ?? string.Empty);
                message.Body = builder.ToMessageBody();

                // Enviar
                await client.SendAsync(message);
                logger.LogInformation("Email enviado exitosamente");

                await client.DisconnectAsync(true);
                logger.LogInformation("Pipeline de email completado");
            }
            catch (MailKit.Security.AuthenticationException authEx)
            {
                logger.LogError(authEx, "La autenticación de Gmail falló. Verifica la contraseña de aplicación.");
                throw new InvalidOperationException($"La autenticación de Gmail falló: {authEx.Message}. Por favor, verifica la contraseña de aplicación.", authEx);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error al enviar el email");
                throw;
            }
            logger.LogInformation("Email processed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al enviar el email");

            // Verificar si usar fallback
            var useFallback = bool.Parse(smtpSettings["UseFallback"] ?? "false");
            if (useFallback)
            {
                logger.LogWarning("Usando respaldo de email");
                return; // No fallar, solo logear
            }

            throw new InvalidOperationException($"Error al enviar el email: {ex.Message}", ex);
        }
    }

    // Simple helper para eliminar etiquetas HTML y producir texto plano básico
    private string StripHtmlToPlainText(string html)
    {
        if (string.IsNullOrWhiteSpace(html)) return string.Empty;
        // Remover scripts/styles
        var noScripts = System.Text.RegularExpressions.Regex.Replace(html, "<script[\\s\\S]*?>[\\s\\S]*?<\\/script>", "", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        var noStyles = System.Text.RegularExpressions.Regex.Replace(noScripts, "<style[\\s\\S]*?>[\\s\\S]*?<\\/style>", "", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        // Reemplazar etiquetas por saltos de línea donde tenga sentido
        var withBreaks = System.Text.RegularExpressions.Regex.Replace(noStyles, "<(br|p|div|li|tr)[^>]*>", "\n", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        // Remover todas las etiquetas restantes
        var cleaned = System.Text.RegularExpressions.Regex.Replace(withBreaks, "<[^>]+>", string.Empty);
        // Decode HTML entities
        var decoded = System.Net.WebUtility.HtmlDecode(cleaned);
        // Normalizar espacios
        return System.Text.RegularExpressions.Regex.Replace(decoded, "\n{2,}", "\n\n").Trim();
    }
}


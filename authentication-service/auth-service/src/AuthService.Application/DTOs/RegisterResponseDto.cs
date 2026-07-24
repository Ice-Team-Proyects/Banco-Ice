namespace AuthService.Application.DTOs;

public class RegisterResponseDto
{
    public bool Success { get; set; } = false;
    public UserResponseDto User { get; set; } = new();
    public string Message { get; set; } = string.Empty;
    public bool EmailVerificationRequired { get; set; } = true;

    /// <summary>
    /// Token de verificación expuesto solo cuando SMTP está deshabilitado
    /// (entornos demo/local) para poder activar la cuenta sin correo.
    /// </summary>
    public string? EmailVerificationToken { get; set; }
}

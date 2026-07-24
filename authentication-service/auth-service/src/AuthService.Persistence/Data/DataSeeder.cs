using System;
using AuthService.Domain.Entities;
using AuthService.Domain.Constants;
using Microsoft.EntityFrameworkCore;
using AuthService.Application.Services;

namespace AuthService.Persistence.Data;

public static class DataSeeder
{
    public static async Task SeendAsync(ApplicationDbContext context)
    {
        if (!context.Roles.Any())
        {
            var roles = new List<Role>
            {
                new()
                {
                    Id= UuidGenerator.GenerateRoleId(),
                    Name = RoleConstants.ADMIN_ROLE
                },

                new()
                {
                    Id= UuidGenerator.GenerateRoleId(),
                    Name = RoleConstants.USER_ROLE
                }
            };

            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }

        if (!await context.Users.AnyAsync())
        {
            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == RoleConstants.ADMIN_ROLE);
            if (adminRole != null)
            {
                var passwordHasher = new PasswordHashService();
                var userId = UuidGenerator.GenerateUserId();
                var profileId = UuidGenerator.GenerateUserId();
                var emailId = UuidGenerator.GenerateUserId();
                var userRoleId = UuidGenerator.GenerateUserId();

                var adminUser = new User
                {
                    Id = userId,
                    Name = "Admin User",
                    Surname = "Admin Surname",
                    Username = "admin",
                    Email = "ksadmin@local.com",
                    Password = passwordHasher.HashPassword("Kinal2026!"),
                    Status = true,

                    UserProfile = new UserProfile
                    {
                        Id = profileId,
                        UserId = userId,
                        Phone = "00000000",

                    },

                    UserEmail = new UserEmail
                    {
                        Id = emailId,
                        UserId = userId,
                        EmailVerified = true,
                        EmailVerificationToken = null,
                        EmailVerificationTokenExpiry = null
                    },

                    UserRoles = 
                    [
                        new UserRole
                        {
                            Id = userRoleId,
                            UserId = userId,
                            RoleId = adminRole.Id
                        }
                    ]
                };
                await context.Users.AddAsync(adminUser);
                await context.SaveChangesAsync();
            }

        }

        // Asegura un usuario cliente de demo (útil cuando SMTP no entrega el correo de verificación).
        await EnsureDemoClientAsync(context);
    }

    private static async Task EnsureDemoClientAsync(ApplicationDbContext context)
    {
        const string demoUsername = "cliente";
        if (await context.Users.AnyAsync(u => u.Username == demoUsername))
        {
            return;
        }

        var userRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == RoleConstants.USER_ROLE);
        if (userRole == null)
        {
            return;
        }

        var passwordHasher = new PasswordHashService();
        var userId = UuidGenerator.GenerateUserId();
        var profileId = UuidGenerator.GenerateUserId();
        var emailId = UuidGenerator.GenerateUserId();
        var userRoleId = UuidGenerator.GenerateUserId();

        var clientUser = new User
        {
            Id = userId,
            Name = "Cliente",
            Surname = "Demo",
            Username = demoUsername,
            Email = "cliente@bancoice.local",
            Password = passwordHasher.HashPassword("Cliente2026!"),
            Status = true,
            UserProfile = new UserProfile
            {
                Id = profileId,
                UserId = userId,
                Phone = "55551234",
            },
            UserEmail = new UserEmail
            {
                Id = emailId,
                UserId = userId,
                EmailVerified = true,
                EmailVerificationToken = null,
                EmailVerificationTokenExpiry = null,
            },
            UserRoles =
            [
                new UserRole
                {
                    Id = userRoleId,
                    UserId = userId,
                    RoleId = userRole.Id,
                },
            ],
        };

        await context.Users.AddAsync(clientUser);
        await context.SaveChangesAsync();
    }
}

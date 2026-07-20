using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthService.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CambiosModelosFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_refresh_tokens_users_user_id",
                table: "refresh_tokens");

            migrationBuilder.DropForeignKey(
                name: "fk_user_emails_users_user_id",
                table: "user_emails");

            migrationBuilder.DropForeignKey(
                name: "fk_user_password_resets_users_user_id",
                table: "user_password_resets");

            migrationBuilder.DropForeignKey(
                name: "fk_user_profiles_users_user_id",
                table: "user_profiles");

            migrationBuilder.DropForeignKey(
                name: "fk_user_roles_roles_role_id",
                table: "user_roles");

            migrationBuilder.DropForeignKey(
                name: "fk_user_roles_users_user_id",
                table: "user_roles");

            migrationBuilder.DropPrimaryKey(
                name: "pk_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "pk_user_roles",
                table: "user_roles");

            migrationBuilder.DropPrimaryKey(
                name: "pk_user_profiles",
                table: "user_profiles");

            migrationBuilder.DropPrimaryKey(
                name: "pk_user_password_resets",
                table: "user_password_resets");

            migrationBuilder.DropPrimaryKey(
                name: "pk_user_emails",
                table: "user_emails");

            migrationBuilder.DropPrimaryKey(
                name: "pk_roles",
                table: "roles");

            migrationBuilder.DropPrimaryKey(
                name: "pk_refresh_tokens",
                table: "refresh_tokens");

            migrationBuilder.RenameIndex(
                name: "ix_users_username",
                table: "users",
                newName: "IX_users_username");

            migrationBuilder.RenameIndex(
                name: "ix_users_email",
                table: "users",
                newName: "IX_users_email");

            migrationBuilder.RenameIndex(
                name: "ix_user_roles_user_id",
                table: "user_roles",
                newName: "i_x_user_roles_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_user_roles_role_id",
                table: "user_roles",
                newName: "i_x_user_roles_role_id");

            migrationBuilder.RenameIndex(
                name: "ix_user_profiles_user_id",
                table: "user_profiles",
                newName: "i_x_user_profiles_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_user_password_resets_user_id",
                table: "user_password_resets",
                newName: "i_x_user_password_resets_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_user_emails_user_id",
                table: "user_emails",
                newName: "i_x_user_emails_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_refresh_tokens_user_id",
                table: "refresh_tokens",
                newName: "i_x_refresh_tokens_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_refresh_tokens_token_hash",
                table: "refresh_tokens",
                newName: "i_x_refresh_tokens_token_hash");

            migrationBuilder.RenameIndex(
                name: "ix_refresh_tokens_family_id",
                table: "refresh_tokens",
                newName: "i_x_refresh_tokens_family_id");

            migrationBuilder.AddPrimaryKey(
                name: "p_k_users",
                table: "users",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "p_k_user_roles",
                table: "user_roles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "p_k_user_profiles",
                table: "user_profiles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "p_k_user_password_resets",
                table: "user_password_resets",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "p_k_user_emails",
                table: "user_emails",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "p_k_roles",
                table: "roles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "p_k_refresh_tokens",
                table: "refresh_tokens",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_refresh_tokens_users_user_id",
                table: "refresh_tokens",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_emails_users_user_id",
                table: "user_emails",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_password_resets_users_user_id",
                table: "user_password_resets",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_profiles_users_user_id",
                table: "user_profiles",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_roles_roles_role_id",
                table: "user_roles",
                column: "role_id",
                principalTable: "roles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_roles_users_user_id",
                table: "user_roles",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_refresh_tokens_users_user_id",
                table: "refresh_tokens");

            migrationBuilder.DropForeignKey(
                name: "FK_user_emails_users_user_id",
                table: "user_emails");

            migrationBuilder.DropForeignKey(
                name: "FK_user_password_resets_users_user_id",
                table: "user_password_resets");

            migrationBuilder.DropForeignKey(
                name: "FK_user_profiles_users_user_id",
                table: "user_profiles");

            migrationBuilder.DropForeignKey(
                name: "FK_user_roles_roles_role_id",
                table: "user_roles");

            migrationBuilder.DropForeignKey(
                name: "FK_user_roles_users_user_id",
                table: "user_roles");

            migrationBuilder.DropPrimaryKey(
                name: "p_k_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "p_k_user_roles",
                table: "user_roles");

            migrationBuilder.DropPrimaryKey(
                name: "p_k_user_profiles",
                table: "user_profiles");

            migrationBuilder.DropPrimaryKey(
                name: "p_k_user_password_resets",
                table: "user_password_resets");

            migrationBuilder.DropPrimaryKey(
                name: "p_k_user_emails",
                table: "user_emails");

            migrationBuilder.DropPrimaryKey(
                name: "p_k_roles",
                table: "roles");

            migrationBuilder.DropPrimaryKey(
                name: "p_k_refresh_tokens",
                table: "refresh_tokens");

            migrationBuilder.RenameIndex(
                name: "IX_users_username",
                table: "users",
                newName: "ix_users_username");

            migrationBuilder.RenameIndex(
                name: "IX_users_email",
                table: "users",
                newName: "ix_users_email");

            migrationBuilder.RenameIndex(
                name: "i_x_user_roles_user_id",
                table: "user_roles",
                newName: "ix_user_roles_user_id");

            migrationBuilder.RenameIndex(
                name: "i_x_user_roles_role_id",
                table: "user_roles",
                newName: "ix_user_roles_role_id");

            migrationBuilder.RenameIndex(
                name: "i_x_user_profiles_user_id",
                table: "user_profiles",
                newName: "ix_user_profiles_user_id");

            migrationBuilder.RenameIndex(
                name: "i_x_user_password_resets_user_id",
                table: "user_password_resets",
                newName: "ix_user_password_resets_user_id");

            migrationBuilder.RenameIndex(
                name: "i_x_user_emails_user_id",
                table: "user_emails",
                newName: "ix_user_emails_user_id");

            migrationBuilder.RenameIndex(
                name: "i_x_refresh_tokens_user_id",
                table: "refresh_tokens",
                newName: "ix_refresh_tokens_user_id");

            migrationBuilder.RenameIndex(
                name: "i_x_refresh_tokens_token_hash",
                table: "refresh_tokens",
                newName: "ix_refresh_tokens_token_hash");

            migrationBuilder.RenameIndex(
                name: "i_x_refresh_tokens_family_id",
                table: "refresh_tokens",
                newName: "ix_refresh_tokens_family_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_users",
                table: "users",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_user_roles",
                table: "user_roles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_user_profiles",
                table: "user_profiles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_user_password_resets",
                table: "user_password_resets",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_user_emails",
                table: "user_emails",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_roles",
                table: "roles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_refresh_tokens",
                table: "refresh_tokens",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_refresh_tokens_users_user_id",
                table: "refresh_tokens",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_user_emails_users_user_id",
                table: "user_emails",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_user_password_resets_users_user_id",
                table: "user_password_resets",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_user_profiles_users_user_id",
                table: "user_profiles",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_user_roles_roles_role_id",
                table: "user_roles",
                column: "role_id",
                principalTable: "roles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_user_roles_users_user_id",
                table: "user_roles",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

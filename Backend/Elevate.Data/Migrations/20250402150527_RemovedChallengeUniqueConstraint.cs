using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Elevate.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovedChallengeUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Challenges_UserId_FriendId",
                table: "Challenges");

            migrationBuilder.CreateIndex(
                name: "IX_Challenges_UserId_FriendId",
                table: "Challenges",
                columns: new[] { "UserId", "FriendId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Challenges_UserId_FriendId",
                table: "Challenges");

            migrationBuilder.CreateIndex(
                name: "IX_Challenges_UserId_FriendId",
                table: "Challenges",
                columns: new[] { "UserId", "FriendId" },
                unique: true);
        }
    }
}

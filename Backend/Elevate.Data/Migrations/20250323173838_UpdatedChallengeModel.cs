using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Elevate.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedChallengeModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChallengeModel_AspNetUsers_FriendId",
                table: "ChallengeModel");

            migrationBuilder.DropForeignKey(
                name: "FK_ChallengeModel_AspNetUsers_UserId",
                table: "ChallengeModel");

            migrationBuilder.DropForeignKey(
                name: "FK_ChallengeModel_Habits_HabitId",
                table: "ChallengeModel");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChallengeModel",
                table: "ChallengeModel");

            migrationBuilder.RenameTable(
                name: "ChallengeModel",
                newName: "Challenges");

            migrationBuilder.RenameIndex(
                name: "IX_ChallengeModel_UserId_FriendId",
                table: "Challenges",
                newName: "IX_Challenges_UserId_FriendId");

            migrationBuilder.RenameIndex(
                name: "IX_ChallengeModel_HabitId",
                table: "Challenges",
                newName: "IX_Challenges_HabitId");

            migrationBuilder.RenameIndex(
                name: "IX_ChallengeModel_FriendId",
                table: "Challenges",
                newName: "IX_Challenges_FriendId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Challenges",
                table: "Challenges",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Challenges_AspNetUsers_FriendId",
                table: "Challenges",
                column: "FriendId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Challenges_AspNetUsers_UserId",
                table: "Challenges",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Challenges_Habits_HabitId",
                table: "Challenges",
                column: "HabitId",
                principalTable: "Habits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Challenges_AspNetUsers_FriendId",
                table: "Challenges");

            migrationBuilder.DropForeignKey(
                name: "FK_Challenges_AspNetUsers_UserId",
                table: "Challenges");

            migrationBuilder.DropForeignKey(
                name: "FK_Challenges_Habits_HabitId",
                table: "Challenges");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Challenges",
                table: "Challenges");

            migrationBuilder.RenameTable(
                name: "Challenges",
                newName: "ChallengeModel");

            migrationBuilder.RenameIndex(
                name: "IX_Challenges_UserId_FriendId",
                table: "ChallengeModel",
                newName: "IX_ChallengeModel_UserId_FriendId");

            migrationBuilder.RenameIndex(
                name: "IX_Challenges_HabitId",
                table: "ChallengeModel",
                newName: "IX_ChallengeModel_HabitId");

            migrationBuilder.RenameIndex(
                name: "IX_Challenges_FriendId",
                table: "ChallengeModel",
                newName: "IX_ChallengeModel_FriendId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChallengeModel",
                table: "ChallengeModel",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ChallengeModel_AspNetUsers_FriendId",
                table: "ChallengeModel",
                column: "FriendId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChallengeModel_AspNetUsers_UserId",
                table: "ChallengeModel",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChallengeModel_Habits_HabitId",
                table: "ChallengeModel",
                column: "HabitId",
                principalTable: "Habits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

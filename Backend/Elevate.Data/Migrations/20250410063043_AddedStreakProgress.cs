using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Elevate.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedStreakProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StreakProgression",
                table: "Habits",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StreakProgression",
                table: "Habits");
        }
    }
}

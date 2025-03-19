using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Elevate.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedDeletedFieldToHabitLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "HabitLogs",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "HabitLogs");
        }
    }
}

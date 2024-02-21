using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CryptoWallet.Server.Migrations
{
    /// <inheritdoc />
    public partial class FileImportAddPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PurchasedAmount",
                table: "Assets",
                newName: "Price");

            migrationBuilder.AddColumn<double>(
                name: "Amount",
                table: "Assets",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateIndex(
                name: "IX_Assets_UserId",
                table: "Assets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assets_Users_UserId",
                table: "Assets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assets_Users_UserId",
                table: "Assets");

            migrationBuilder.DropIndex(
                name: "IX_Assets_UserId",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Assets");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Assets",
                newName: "PurchasedAmount");
        }
    }
}

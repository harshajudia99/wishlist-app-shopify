/*
  Warnings:

  - Added the required column `customerId` to the `WishlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productTitle" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productImage" TEXT NOT NULL,
    "productAlt" TEXT NOT NULL,
    "productCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_WishlistItem" ("createdAt", "customerName", "id", "productAlt", "productCount", "productId", "productImage", "productTitle") SELECT "createdAt", "customerName", "id", "productAlt", "productCount", "productId", "productImage", "productTitle" FROM "WishlistItem";
DROP TABLE "WishlistItem";
ALTER TABLE "new_WishlistItem" RENAME TO "WishlistItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

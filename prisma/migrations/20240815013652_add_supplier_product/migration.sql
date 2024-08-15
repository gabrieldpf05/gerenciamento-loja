/*
  Warnings:

  - You are about to drop the column `qrcode` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_SupplierProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SupplierProducts" DROP CONSTRAINT "_SupplierProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_SupplierProducts" DROP CONSTRAINT "_SupplierProducts_B_fkey";

-- DropIndex
DROP INDEX "Product_code_index";

-- DropIndex
DROP INDEX "Supplier_cnpj_index";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "qrcode";

-- DropTable
DROP TABLE "_SupplierProducts";

-- CreateTable
CREATE TABLE "SupplierProduct" (
    "supplierId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "qrcode" TEXT NOT NULL,

    CONSTRAINT "SupplierProduct_pkey" PRIMARY KEY ("supplierId","productId")
);

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

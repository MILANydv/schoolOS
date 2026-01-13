-- AlterTable
ALTER TABLE "Admission" ALTER COLUMN "parentPhone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "admissionNumber" DROP NOT NULL;

-- CreateEnum
CREATE TYPE "StatusSubscription" AS ENUM ('TRIAL', 'PAID', 'NOT_PAID', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "StatusNotification" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('DAY', 'WEEK', 'MONTH', 'YEAR', 'LIFE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CINEMA', 'MUSIC', 'TV', 'GAMING', 'SOFTWARE', 'EDUCATION', 'FITNESS', 'FOOD', 'CLOUD', 'STORAGE', 'NEWS', 'SHOPPING', 'FINANCE', 'TRANSPORT', 'OTHER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "password_hash" VARCHAR(64) NOT NULL,
    "is_2fa_auth" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_refresh" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,

    CONSTRAINT "token_refresh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subscription_id" TEXT,
    "message" VARCHAR(250) NOT NULL,
    "status" "StatusNotification" NOT NULL DEFAULT 'SENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "StatusSubscription" NOT NULL DEFAULT 'TRIAL',
    "last_payment_at" TIMESTAMP(3) NOT NULL,
    "period" "Period" NOT NULL DEFAULT 'MONTH',
    "count" INTEGER NOT NULL DEFAULT 1,
    "ahead_payment_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_category" (
    "subscription_id" TEXT NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "subscription_category_pkey" PRIMARY KEY ("subscription_id","category")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "token_refresh_user_id_idx" ON "token_refresh"("user_id");

-- CreateIndex
CREATE INDEX "notification_user_id_idx" ON "notification"("user_id");

-- CreateIndex
CREATE INDEX "notification_user_id_status_idx" ON "notification"("user_id", "status");

-- CreateIndex
CREATE INDEX "subscription_user_id_idx" ON "subscription"("user_id");

-- CreateIndex
CREATE INDEX "subscription_user_id_status_idx" ON "subscription"("user_id", "status");

-- CreateIndex
CREATE INDEX "subscription_ahead_payment_at_idx" ON "subscription"("ahead_payment_at");

-- CreateIndex
CREATE INDEX "payment_subscription_id_idx" ON "payment"("subscription_id");

-- CreateIndex
CREATE INDEX "payment_payment_date_idx" ON "payment"("payment_date");

-- AddForeignKey
ALTER TABLE "token_refresh" ADD CONSTRAINT "token_refresh_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_category" ADD CONSTRAINT "subscription_category_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "user" (
  "id" uuid PRIMARY KEY,
  "email" varchar(320) UNIQUE NOT NULL,
  "password_hash" varchar(64) NOT NULL,
  "is_2fa_auth" bool DEFAULT false,
  "created_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "token_refresh" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "token_hash" varchar(64) NOT NULL
);

CREATE TABLE "notification" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "subscription_id" uuid,
  "message" varchar(250) NOT NULL,
  "status" text DEFAULT 'sent',
  "created_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "subscription" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "name" varchar(100) NOT NULL,
  "amount" decimal(10,2) DEFAULT 0,
  "status" text DEFAULT 'trial',
  "start" timestamp NOT NULL,
  "period" text DEFAULT 'month',
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "subscription_category" (
  "subscription_id" uuid PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "payment" (
  "id" uuid PRIMARY KEY,
  "subscription_id" uuid NOT NULL,
  "amount" decimal(10,2) NOT NULL,
  "payment_date" timestamp NOT NULL
);

CREATE UNIQUE INDEX ON "subscription_category" ("subscription_id", "name");

ALTER TABLE "token_refresh"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "notification"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "subscription"
ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "notification"
ADD FOREIGN KEY ("subscription_id") REFERENCES "subscription" ("id");

ALTER TABLE "subscription_category"
ADD FOREIGN KEY ("subscription_id") REFERENCES "subscription" ("id");

ALTER TABLE "payment"
ADD FOREIGN KEY ("subscription_id") REFERENCES "subscription" ("id");
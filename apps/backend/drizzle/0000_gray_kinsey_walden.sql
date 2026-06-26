CREATE TYPE "public"."child_gender" AS ENUM('female', 'male', 'non_binary', 'unspecified');--> statement-breakpoint
CREATE TABLE "children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"middle_name" varchar(100),
	"last_name" varchar(100) NOT NULL,
	"gender" "child_gender" NOT NULL,
	"date_of_birth" date NOT NULL,
	"avatar_url" varchar(2048),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

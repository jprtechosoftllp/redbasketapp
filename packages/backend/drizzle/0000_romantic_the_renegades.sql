CREATE TABLE "admins" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admins_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"username" varchar,
	"phone" varchar NOT NULL,
	"photo" varchar,
	"role" varchar DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" varchar,
	CONSTRAINT "admins_email_unique" UNIQUE("email"),
	CONSTRAINT "admins_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "managers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "managers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"username" varchar,
	"phone" varchar NOT NULL,
	"photo" varchar,
	"vendors_Id" json,
	"role" varchar DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" varchar,
	CONSTRAINT "managers_email_unique" UNIQUE("email"),
	CONSTRAINT "managers_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"description" text,
	"image" json,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"sub_category" varchar,
	"description" text NOT NULL,
	"image_urls" json,
	"net_weight" varchar,
	"gross_weight" varchar,
	"base_price" numeric,
	"discount_price" numeric,
	"vendor_Id" varchar,
	"slaughter_date" date,
	"expiry_date" date,
	"freshness_grade" varchar,
	"is_halal" boolean NOT NULL,
	"packaging_type" varchar,
	"estimated_prep_time" varchar,
	"delivery_time_estimate" varchar,
	"protein_per_100g" varchar,
	"calories_per_100g" varchar,
	"review_Id" json,
	"reviews_count" text,
	"fssai_certified" boolean,
	"hygiene_verified_by_meato" boolean,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" varchar
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer,
	"user_id" varchar(50),
	"rating" integer,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subcategories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subcategories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"categoryId" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"isActive" boolean DEFAULT true,
	"image" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar,
	"password" varchar,
	"username" varchar,
	"phone" varchar NOT NULL,
	"default_address" text,
	"city" varchar,
	"state" varchar,
	"pinCode" integer,
	"wallet_balance" integer DEFAULT 0,
	"loyalty_points" integer DEFAULT 0,
	"status" varchar DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"username" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"shop_address" text NOT NULL,
	"shop_name" text NOT NULL,
	"gst_number" varchar NOT NULL,
	"shop_city" varchar NOT NULL,
	"shop_state" varchar NOT NULL,
	"shop_pinCode" varchar NOT NULL,
	"bank_account" varchar NOT NULL,
	"ifsc_code" varchar NOT NULL,
	"fssai_license" varchar NOT NULL,
	"commission_rate" varchar,
	"product_Id" json,
	"status" varchar DEFAULT 'active' NOT NULL,
	"oreders" varchar,
	"rejected_orderds" varchar,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" varchar,
	CONSTRAINT "vendors_email_unique" UNIQUE("email"),
	CONSTRAINT "vendors_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
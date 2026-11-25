CREATE TYPE "public"."post_type" AS ENUM('snippet', 'article', 'question');--> statement-breakpoint
CREATE TABLE "accounts" (
	"access_token" text,
	"expires_at" integer,
	"id_token" text,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"scope" text,
	"session_state" text,
	"token_type" text,
	"type" text NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id_post" uuid NOT NULL,
	"id_user" uuid NOT NULL,
	CONSTRAINT "bookmarks_id_user_id_post_pk" PRIMARY KEY("id_user","id_post")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"code_line" text,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_parent" uuid,
	"id_post" uuid NOT NULL,
	"id_user" uuid
);
--> statement-breakpoint
CREATE TABLE "comment_likes" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id_comment" uuid NOT NULL,
	"id_user" uuid NOT NULL,
	CONSTRAINT "comment_likes_id_comment_id_user_pk" PRIMARY KEY("id_comment","id_user")
);
--> statement-breakpoint
CREATE TABLE "followers" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id_follower" uuid NOT NULL,
	"id_user" uuid NOT NULL,
	CONSTRAINT "followers_id_follower_id_user_pk" PRIMARY KEY("id_follower","id_user")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"code_filename" text,
	"code_language" text,
	"code_snippet" text,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_user" uuid,
	"image_url" text,
	"title" text NOT NULL,
	"type" "post_type" DEFAULT 'snippet' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_likes" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id_post" uuid NOT NULL,
	"id_user" uuid NOT NULL,
	CONSTRAINT "post_likes_id_post_id_user_pk" PRIMARY KEY("id_post","id_user")
);
--> statement-breakpoint
CREATE TABLE "post_shares" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id_post" uuid NOT NULL,
	"id_user" uuid NOT NULL,
	CONSTRAINT "post_shares_id_post_id_user_pk" PRIMARY KEY("id_post","id_user")
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id_post" uuid NOT NULL,
	"id_tag" uuid NOT NULL,
	CONSTRAINT "post_tags_id_post_id_tag_pk" PRIMARY KEY("id_post","id_tag")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"avatar_url" text,
	"bio" text,
	"cover_url" text,
	"id_user" uuid PRIMARY KEY NOT NULL,
	"location" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"website" text
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "tags_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password_hash" text,
	"username" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "user_tag_follows" (
	"followed_at" timestamp DEFAULT now() NOT NULL,
	"id_tag" uuid NOT NULL,
	"id_user" uuid NOT NULL,
	CONSTRAINT "user_tag_follows_id_tag_id_user_pk" PRIMARY KEY("id_tag","id_user")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_id_post_posts_id_fk" FOREIGN KEY ("id_post") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_id_parent_comments_id_fk" FOREIGN KEY ("id_parent") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_id_post_posts_id_fk" FOREIGN KEY ("id_post") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_id_comment_comments_id_fk" FOREIGN KEY ("id_comment") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_id_follower_users_id_fk" FOREIGN KEY ("id_follower") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_id_post_posts_id_fk" FOREIGN KEY ("id_post") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_shares" ADD CONSTRAINT "post_shares_id_post_posts_id_fk" FOREIGN KEY ("id_post") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_shares" ADD CONSTRAINT "post_shares_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_id_post_posts_id_fk" FOREIGN KEY ("id_post") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_id_tag_tags_id_fk" FOREIGN KEY ("id_tag") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tag_follows" ADD CONSTRAINT "user_tag_follows_id_tag_tags_id_fk" FOREIGN KEY ("id_tag") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tag_follows" ADD CONSTRAINT "user_tag_follows_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_user_idx" ON "posts" USING btree ("id_user");--> statement-breakpoint
CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
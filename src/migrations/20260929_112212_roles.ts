import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"is_super_admin" boolean DEFAULT false,
  	"permissions" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "roles_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "role_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "roles_id" integer;
  ALTER TABLE "roles_locales" ADD CONSTRAINT "roles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "roles_slug_idx" ON "roles" USING btree ("slug");
  CREATE INDEX "roles_updated_at_idx" ON "roles" USING btree ("updated_at");
  CREATE INDEX "roles_created_at_idx" ON "roles" USING btree ("created_at");
  CREATE UNIQUE INDEX "roles_locales_locale_parent_id_unique" ON "roles_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_roles_fk" FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_role_idx" ON "users" USING btree ("role_id");
  CREATE INDEX "payload_locked_documents_rels_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("roles_id");
  -- Built-in roles
  INSERT INTO "roles" ("slug", "is_super_admin", "permissions") VALUES ('admin', true, '{}'::jsonb);
  INSERT INTO "roles_locales" ("name", "description", "_locale", "_parent_id") SELECT 'مدير', 'صلاحيات كاملة على كل الأقسام، بما فيها المستخدمون والأدوار.', 'ar', "id" FROM "roles" WHERE "slug" = 'admin';
  INSERT INTO "roles_locales" ("name", "description", "_locale", "_parent_id") SELECT 'Admin', 'Full access to everything, including users and roles.', 'en', "id" FROM "roles" WHERE "slug" = 'admin';
  INSERT INTO "roles" ("slug", "is_super_admin", "permissions") VALUES ('writer', false, '{"posts":{"read":true,"create":true,"update":true,"delete":true},"pages":{"read":true,"create":true,"update":true,"delete":true},"media":{"read":true,"create":true,"update":true,"delete":true},"categories":{"read":true,"create":true,"update":true,"delete":true},"forms":{"read":true},"form-submissions":{"read":true}}'::jsonb);
  INSERT INTO "roles_locales" ("name", "description", "_locale", "_parent_id") SELECT 'كاتب', 'يكتب وينشر ويعدّل المقالات والصفحات والوسائط والتصنيفات.', 'ar', "id" FROM "roles" WHERE "slug" = 'writer';
  INSERT INTO "roles_locales" ("name", "description", "_locale", "_parent_id") SELECT 'Writer', 'Writes, publishes and edits posts, pages, media and categories.', 'en', "id" FROM "roles" WHERE "slug" = 'writer';
  INSERT INTO "roles" ("slug", "is_super_admin", "permissions") VALUES ('reader', false, '{"posts":{"read":true},"pages":{"read":true},"media":{"read":true},"categories":{"read":true},"forms":{"read":true},"form-submissions":{"read":true},"header":{"read":true},"footer":{"read":true}}'::jsonb);
  INSERT INTO "roles_locales" ("name", "description", "_locale", "_parent_id") SELECT 'قارئ', 'يطّلع على المحتوى في لوحة التحكم دون أي تعديل.', 'ar', "id" FROM "roles" WHERE "slug" = 'reader';
  INSERT INTO "roles_locales" ("name", "description", "_locale", "_parent_id") SELECT 'Reader', 'Can view content in the admin panel without making changes.', 'en', "id" FROM "roles" WHERE "slug" = 'reader';
  -- Existing accounts keep full access so nobody is locked out after this migration
  UPDATE "users" SET "role_id" = (SELECT "id" FROM "roles" WHERE "slug" = 'admin') WHERE "role_id" IS NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "roles_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "roles" CASCADE;
  DROP TABLE "roles_locales" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT "users_role_id_roles_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_roles_fk";
  
  DROP INDEX "users_role_idx";
  DROP INDEX "payload_locked_documents_rels_roles_id_idx";
  ALTER TABLE "users" DROP COLUMN "role_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "roles_id";`)
}

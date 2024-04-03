CREATE TABLE IF NOT EXISTS "feat" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updtedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "type" text NOT NULL, "description" varchar NOT NULL, "prerequisites" varchar, "prerequisite_feats" varchar, "benefit" text NOT NULL, "normal" varchar, "special" varchar, "suggested_traits" varchar, "prerequisite_skills" varchar, "race_name" varchar, "note" varchar, "goal" varchar, "completion_benefit" varchar, "source" varchar NOT NULL, "teamwork" boolean NOT NULL, "critical" boolean NOT NULL, "grit" boolean NOT NULL, "style" boolean NOT NULL, "performance" boolean NOT NULL, "racial" boolean NOT NULL, "companion_familiar" boolean NOT NULL, "multiples" boolean NOT NULL, "panache" boolean NOT NULL, "betrayal" boolean NOT NULL, "targeting" boolean NOT NULL, "esoteric" boolean NOT NULL, "stare" boolean NOT NULL, "weapon_mastery" boolean NOT NULL, "item_mastery" boolean NOT NULL, "armor_mastery" boolean NOT NULL, "shield_mastery" boolean NOT NULL, "blood_hex" boolean NOT NULL, "trick" boolean NOT NULL);
CREATE INDEX "IDX_7972cc2c36b1e97e412a726a44" ON "feat" ("name") ;
CREATE INDEX "IDX_bdfc523d32b291f0b414e72fa9" ON "feat" ("type") ;
CREATE INDEX "IDX_7812367e718358a22fc02c708c" ON "feat" ("teamwork") ;
CREATE INDEX "IDX_6b20931f0004956b848d071029" ON "feat" ("critical") ;
CREATE INDEX "IDX_5dfb2b0cbd71377eb0204ba3fe" ON "feat" ("grit") ;
CREATE INDEX "IDX_77b745b526171bfd557b658904" ON "feat" ("style") ;
CREATE INDEX "IDX_5b9517424b51b4bfcd2c5d4684" ON "feat" ("performance") ;
CREATE INDEX "IDX_f75668696d3900569132741ff0" ON "feat" ("racial") ;
CREATE INDEX "IDX_346952cf0d9c197817147ad791" ON "feat" ("companion_familiar") ;
CREATE INDEX "IDX_9f72ab7fcb206e1cf531c70693" ON "feat" ("multiples") ;
CREATE INDEX "IDX_37b48be2a41573d48182215a2b" ON "feat" ("panache") ;
CREATE INDEX "IDX_e77b33e667b2d1244b39c94211" ON "feat" ("betrayal") ;
CREATE INDEX "IDX_8baf92354bc8a6a624c4929965" ON "feat" ("targeting") ;
CREATE INDEX "IDX_6998fe7696a0b20d87a007f2b3" ON "feat" ("esoteric") ;
CREATE INDEX "IDX_65ac98a6ef52e6de4ec6a662c9" ON "feat" ("stare") ;
CREATE INDEX "IDX_59875898c6cc152b2b7d334201" ON "feat" ("weapon_mastery") ;
CREATE INDEX "IDX_a259b303ce2be459a31b9e62e1" ON "feat" ("item_mastery") ;
CREATE INDEX "IDX_c634a6c96757ce3a61975bcdaa" ON "feat" ("armor_mastery") ;
CREATE INDEX "IDX_e3050091d549fec27546b6fca3" ON "feat" ("shield_mastery") ;
CREATE INDEX "IDX_c2509d666f9a01d810fb846e18" ON "feat" ("blood_hex") ;
CREATE INDEX "IDX_005007a847af4e6e58ab6544c3" ON "feat" ("trick") ;
CREATE TABLE IF NOT EXISTS "bloodline" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL);
CREATE UNIQUE INDEX "IDX_c8aabd010c6fe5b9892f914e8c" ON "bloodline" ("name") ;
CREATE TABLE IF NOT EXISTS "school" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL);
CREATE UNIQUE INDEX "IDX_73c2a2b94ffa6b0fabf50b6474" ON "school" ("name") ;
CREATE TABLE IF NOT EXISTS "subschool" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL);
CREATE UNIQUE INDEX "IDX_d255cec266eaf824d94a27daf2" ON "subschool" ("name") ;
CREATE TABLE IF NOT EXISTS "domain" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL);
CREATE UNIQUE INDEX "IDX_26a07113f90df161f919c7d5a6" ON "domain" ("name") ;
CREATE TABLE IF NOT EXISTS "patron" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL);
CREATE UNIQUE INDEX "IDX_4388517da425ca2f7f8d27c72b" ON "patron" ("name") ;
CREATE TABLE IF NOT EXISTS "class" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL);
CREATE UNIQUE INDEX "IDX_574dd394846fb85d495d0f77df" ON "class" ("name") ;
CREATE TABLE IF NOT EXISTS "deity" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "type" varchar NOT NULL, "alignement" varchar CHECK( "alignement" IN ('Lawful Good','Lawful Neutral','Lawful Evil','Neutral Good','Neutral','Neutral Evil','Chaotic Good','Chaotic Neutral','Chaotic Evil') ) NOT NULL);
CREATE UNIQUE INDEX "IDX_09308b947fe2cb10a928169ccf" ON "deity" ("name") ;
CREATE TABLE IF NOT EXISTS "user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "password" varchar NOT NULL, "isAdmin" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')));
CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") ;
CREATE TABLE IF NOT EXISTS "bloodline_spell" ("id" varchar PRIMARY KEY NOT NULL, "class_level" integer NOT NULL, "spellId" varchar, "bloodlineId" varchar, CONSTRAINT "FK_3c0e224776a7dc92968e78c4406" FOREIGN KEY ("spellId") REFERENCES "spell" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_eeefabd421fcfab362e43369a09" FOREIGN KEY ("bloodlineId") REFERENCES "bloodline" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);
CREATE TABLE IF NOT EXISTS "domain_spell" ("id" varchar PRIMARY KEY NOT NULL, "spell_level" integer NOT NULL, "spellId" varchar, "domainId" varchar, CONSTRAINT "FK_fc26a0aa022f40c4711112670df" FOREIGN KEY ("spellId") REFERENCES "spell" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bf60811c5035fcdb02de4bc0da5" FOREIGN KEY ("domainId") REFERENCES "domain" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);
CREATE TABLE IF NOT EXISTS "subdomain" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "parentId" varchar, CONSTRAINT "FK_cb72a31151ac1f1038de1e160e3" FOREIGN KEY ("parentId") REFERENCES "domain" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);
CREATE UNIQUE INDEX "IDX_faf202bdd9308a965fde9eaf59" ON "subdomain" ("name") ;
CREATE TABLE IF NOT EXISTS "subdomain_spell" ("id" varchar PRIMARY KEY NOT NULL, "spell_level" integer NOT NULL, "spellId" varchar, "subdomainId" varchar, CONSTRAINT "FK_75b158ada6d28341d33afdfa599" FOREIGN KEY ("spellId") REFERENCES "spell" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8df79ac8f3955801a2fb49d273f" FOREIGN KEY ("subdomainId") REFERENCES "subdomain" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);
CREATE TABLE IF NOT EXISTS "patron_spell" ("id" varchar PRIMARY KEY NOT NULL, "class_level" integer NOT NULL, "spellId" varchar, "patronId" varchar, CONSTRAINT "FK_618d23eb7a614558c19a32f99e7" FOREIGN KEY ("spellId") REFERENCES "spell" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a87dc463e420f05829d666b7bc4" FOREIGN KEY ("patronId") REFERENCES "patron" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);
CREATE TABLE IF NOT EXISTS "class_spell" ("id" varchar PRIMARY KEY NOT NULL, "spell_level" integer NOT NULL, "spellId" varchar, "classId" varchar, CONSTRAINT "FK_03d8f40e2c09882d0c5e3982a2f" FOREIGN KEY ("spellId") REFERENCES "spell" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a06297daf498bfb8352d55abe28" FOREIGN KEY ("classId") REFERENCES "class" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);
CREATE TABLE IF NOT EXISTS "spell" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "link" varchar, "description" text NOT NULL, "mythic_text" text, "augmented" text, "casting_time" varchar NOT NULL, "range" varchar NOT NULL, "area" varchar, "effect" varchar, "targets" varchar, "duration" varchar NOT NULL, "saving_throw" varchar, "spell_resistance" varchar, "sourcebook" varchar NOT NULL, "dismissible" boolean NOT NULL, "shapeable" boolean NOT NULL, "verbal" boolean NOT NULL, "somatic" boolean NOT NULL, "material" boolean NOT NULL, "focus" boolean NOT NULL, "divine_focus" boolean NOT NULL, "component_costs" integer, "permanency" boolean, "permanency_cl" integer, "permanency_cost" integer, "descriptors" text NOT NULL, "race" varchar, "schoolId" varchar, "subschoolId" varchar, "deityId" varchar, CONSTRAINT "FK_f1e3b9bcf119a8e549fec1b3c2c" FOREIGN KEY ("schoolId") REFERENCES "school" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0cc522de687c7334fa242d64d68" FOREIGN KEY ("subschoolId") REFERENCES "subschool" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8d2582a732e97d432d5d756f1f5" FOREIGN KEY ("deityId") REFERENCES "deity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);
CREATE INDEX "IDX_f7f62902d24e43ca00323db233" ON "spell" ("name") ;
CREATE INDEX "IDX_e05f723028f8d3f0769a172247" ON "spell" ("sourcebook") ;
CREATE TABLE IF NOT EXISTS "deity_domains_domain" ("deityId" varchar NOT NULL, "domainId" varchar NOT NULL, CONSTRAINT "FK_3851a1ba4e4213862351a420240" FOREIGN KEY ("deityId") REFERENCES "deity" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_50e56c1d6f7dc594fe86c565c47" FOREIGN KEY ("domainId") REFERENCES "domain" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("deityId", "domainId"));
CREATE INDEX "IDX_3851a1ba4e4213862351a42024" ON "deity_domains_domain" ("deityId") ;
CREATE INDEX "IDX_50e56c1d6f7dc594fe86c565c4" ON "deity_domains_domain" ("domainId") ;
CREATE TABLE IF NOT EXISTS "deity_subdomains_subdomain" ("deityId" varchar NOT NULL, "subdomainId" varchar NOT NULL, CONSTRAINT "FK_becd73f2bee11793c24ae55fd4d" FOREIGN KEY ("deityId") REFERENCES "deity" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_b7fc38be49e4fc30fb4aed53d58" FOREIGN KEY ("subdomainId") REFERENCES "subdomain" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("deityId", "subdomainId"));
CREATE INDEX "IDX_becd73f2bee11793c24ae55fd4" ON "deity_subdomains_subdomain" ("deityId") ;
CREATE INDEX "IDX_b7fc38be49e4fc30fb4aed53d5" ON "deity_subdomains_subdomain" ("subdomainId") ;

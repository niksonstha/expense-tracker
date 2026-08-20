CREATE INDEX "transactions_user_id_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_account_id_idx" ON "transactions" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "transactions_category_id_idx" ON "transactions" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "transactions_transfer_id_idx" ON "transactions" USING btree ("transfer_id");--> statement-breakpoint
CREATE INDEX "transactions_date_idx" ON "transactions" USING btree ("transaction_date");--> statement-breakpoint
CREATE INDEX "transactions_user_date_idx" ON "transactions" USING btree ("user_id","transaction_date");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_amount_positive" CHECK ("transactions"."amount" > 0);--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_type_direction_valid" CHECK (
      (
        "transactions"."type" = 'INCOME'
        AND "transactions"."direction" = 'IN'
      )
      OR
      (
        "transactions"."type" = 'EXPENSE'
        AND "transactions"."direction" = 'OUT'
      )
      OR
      (
        "transactions"."type" = 'TRANSFER'
      )
    );
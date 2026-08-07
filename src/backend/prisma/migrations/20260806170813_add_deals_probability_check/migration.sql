DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_catalog.pg_constraint
        WHERE conname = 'deals_probability_check'
          AND conrelid = 'public.deals'::regclass
    ) THEN
        ALTER TABLE public.deals
        ADD CONSTRAINT deals_probability_check
        CHECK (
            probability >= 0
            AND probability <= 100
        );
    END IF;
END
$$;
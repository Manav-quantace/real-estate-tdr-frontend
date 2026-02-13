export type DeveloperAsk = {
    id: string;
    state: "draft" | "submitted" | "locked";
    dcu_units: number;
    ask_price_per_unit_inr: number;
    submitted_at?: string | null;
    locked_at?: string | null;
};

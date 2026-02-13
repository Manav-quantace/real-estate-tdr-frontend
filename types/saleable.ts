export type SaleableProject = {
    id: string;                 // internal UUID
    project_id: string;         // PRJ-SALE-XXXX
    title: string;

    property_type: "cooperative_society" | "private_owner";
    owner_entity_name: string;
    address_line: string;
    city: string;
    zone: string;

    plot_area_sqm: number;
    existing_builtup_sqm: number;
    redevelopment_intent_notes?: string;

    consent_state: "DRAFT" | "CONSENTED" | "WITHDRAWN";
    consent_captured_at?: string;

    bidding_round_t0: number;
    bidding_window_start?: string;
    bidding_window_end?: string;
    timezone: string;

    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    metadata_locked: boolean;

    created_at: string;
    updated_at: string;
};

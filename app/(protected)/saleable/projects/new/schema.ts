//app/(protected)/saleable/projects/new/schema.ts
import { FormSchema } from "@/components/form-engine/types";

export const saleableCreateSchema: FormSchema = [
    { type: "text", name: "title", label: "Title", required: true },
    {
        type: "select",
        name: "property_type",
        label: "Owner type",
        options: [
            { label: "Cooperative Society", value: "cooperative_society" },
            { label: "Private Owner", value: "private_owner" },
        ],
    },
    { type: "text", name: "owner_entity_name", label: "Owner / Society name", required: true },
    { type: "text", name: "address_line", label: "Address line", required: true },
    { type: "text", name: "city", label: "City", required: true },
    { type: "text", name: "zone", label: "Zone", required: true },
    { type: "number", name: "plot_area_sqm", label: "Plot area (sqm)", min: 0 },
    { type: "number", name: "existing_builtup_sqm", label: "Existing built-up (sqm)", min: 0 },
    { type: "textarea", name: "redevelopment_intent_notes", label: "Redevelopment intent notes" },
    {
        type: "select",
        name: "consent_state",
        label: "Consent state",
        options: [
            { label: "Draft", value: "DRAFT" },
            { label: "Consented", value: "CONSENTED" },
            { label: "Withdrawn", value: "WITHDRAWN" },
        ],
    },
    { type: "number", name: "bidding_round_t0", label: "Round t0", min: 0 },
    { type: "text", name: "timezone", label: "Timezone" },
];

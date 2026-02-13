//app/(protected)/saleable/projects/[projectId]/new/SaleableCreateClient.tsx
"use client";

import { useRouter } from "next/navigation";
import FormRenderer from "@/components/form-engine/FormRenderer";
import { saleableCreateSchema } from "./schema";
import { toast } from "sonner";
import { FormValues } from "@/components/form-engine/types";

export default function SaleableCreateClient() {
    const router = useRouter();

    async function handleSubmit(values: FormValues) {
        const res = await fetch("/api/saleable/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: values.title,
                params: values,     // 👈 SNAPSHOT PAYLOAD
                action: "save",
            }),
        });

        if (!res.ok) {
            toast.error("Failed to create project");
            return;
        }

        const created = await res.json();
        toast.success("Project created");
        router.push(`/saleable/projects/${created.project_id}`);
    }

    return (
        <FormRenderer
            schema={saleableCreateSchema}
            onSubmit={handleSubmit}
            submitLabel="Save project"
        />
    );
}

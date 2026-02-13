"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Field from "./Field";
import { FormSchema, FormValues } from "./types";
import { Button } from "@/components/ui/button";

type Props = {
    schema: FormSchema;
    onSubmit: (values: FormValues) => Promise<void>;
    submitLabel?: string;
};

export default function FormRenderer({
    schema,
    onSubmit,
    submitLabel = "Submit",
}: Props) {
    const [values, setValues] = useState<FormValues>({});
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit(values);
            toast.success("Saved successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save");
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {schema.map((field) => (
                <Field
                    key={field.name}
                    field={field}
                    value={values[field.name]}
                    onChange={(v) =>
                        setValues((prev) => ({
                            ...prev,
                            [field.name]: v,
                        }))
                    }
                />
            ))}

            <div className="flex justify-end">
                <Button disabled={loading}>
                    {loading ? "Saving…" : submitLabel}
                </Button>
            </div>
        </motion.form>
    );
}

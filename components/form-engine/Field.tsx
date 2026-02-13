"use client";

import { motion } from "framer-motion";
import { FieldConfig, FormValues } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    field: FieldConfig;
    value: FormValues[string];
    onChange: (value: string | number) => void;
};

export default function Field({ field, value, onChange }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-1"
        >
            <label className="text-xs text-slate-600">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
            </label>

            {field.type === "text" && (
                <Input
                    value={(value as string) ?? ""}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}

            {field.type === "number" && (
                <Input
                    type="number"
                    value={value ?? ""}
                    min={field.min}
                    max={field.max}
                    disabled={field.disabled}
                    onChange={(e) => onChange(Number(e.target.value))}
                />
            )}

            {field.type === "textarea" && (
                <Textarea
                    rows={field.rows ?? 3}
                    value={(value as string) ?? ""}
                    disabled={field.disabled}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}

            {field.type === "select" && (
                <Select
                    value={(value as string) ?? ""}
                    onValueChange={onChange}
                    disabled={field.disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </motion.div>
    );
}

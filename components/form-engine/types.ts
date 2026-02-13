export type BaseField = {
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
};

export type TextField = BaseField & {
    type: "text";
    placeholder?: string;
};

export type NumberField = BaseField & {
    type: "number";
    min?: number;
    max?: number;
};

export type TextareaField = BaseField & {
    type: "textarea";
    rows?: number;
};

export type SelectField = BaseField & {
    type: "select";
    options: { label: string; value: string }[];
};

export type FieldConfig =
    | TextField
    | NumberField
    | TextareaField
    | SelectField;

export type FormSchema = FieldConfig[];

export type FormValues = Record<string, string | number | undefined>;

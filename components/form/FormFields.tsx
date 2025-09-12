"use client";

import {
  useForm,
  FieldErrors,
  FieldValues,
  Path,
  UseFormReturn,
  PathValue,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { get } from "lodash";

type BaseProps<T extends FieldValues> = {
  label: string;
  field: Path<T>;
  form: UseFormReturn<T>; // Der korrekte Typ für den Rückgabewert von useForm
  placeholder?: string;
  helper?: string;
  highlight?: "red" | "blue" | "yellow" | "purple";
};

function getError<T extends FieldValues>(
  errors: FieldErrors<T>,
  field: Path<T>
): string | undefined {
  const error = get(errors, field);
  return error?.message as string | undefined;
}

/** ------------------ SELECT ------------------ */
export function FormSelect<T extends FieldValues>({
  label,
  field,
  options,
  placeholder,
  form,
  highlight,
}: BaseProps<T> & {
  options: readonly string[] | { value: string; label: string }[];
}) {
  const value = (form.watch(field) as string) ?? "";
  const error = getError(form.formState.errors, field);

  return (
    <div
      className={`rounded-lg p-4 ${
        highlight
          ? `bg-${highlight}-500/10 border border-${highlight}-500/20`
          : ""
      }`}
    >
      <Label className="text-gray-300">{label}</Label>
      <Select
        value={value}
        onValueChange={(val) =>
          // Wir verwenden eine sicherere Typ-Zuweisung anstelle von 'any'
          form.setValue(field, val as PathValue<T, Path<T>>, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger className="bg-white/5 border-white/20 text-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {options.map((opt) =>
            typeof opt === "string" ? (
              <SelectItem
                key={opt}
                value={opt}
                className="text-white hover:bg-white/10"
              >
                {opt}
              </SelectItem>
            ) : (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-white hover:bg-white/10"
              >
                {opt.label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}

/** ------------------ RADIO ------------------ */
export function FormRadio<T extends FieldValues>({
  label,
  field,
  options,
  form,
  columns = 1,
}: BaseProps<T> & {
  options: { value: string; label: string; desc?: string }[];
  columns?: 1 | 2 | 3 | 4; // Besser für Tailwind, siehe Erklärung unten
}) {
  const value = (form.watch(field) as string) ?? "";
  const error = getError(form.formState.errors, field);

  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div>
      <Label className="text-gray-300 text-lg mb-3 block">{label}</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) =>
          form.setValue(field, val as PathValue<T, Path<T>>, {
            shouldValidate: true,
          })
        }
      >
        <div className={`grid ${columnClasses[columns]} gap-4`}>
          {options.map((opt) => (
            <div key={opt.value}>
              <RadioGroupItem
                value={opt.value}
                id={`${field}-${opt.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`${field}-${opt.value}`}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer hover:bg-white/5 transition-all ${
                  value === opt.value
                    ? "border-red-500 bg-red-500/20"
                    : "border-white/20"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="text-white font-medium block">
                      {opt.label}
                    </span>
                    {opt.desc && (
                      <span className="text-gray-400 text-sm">{opt.desc}</span>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      value === opt.value
                        ? "border-red-500 bg-red-500"
                        : "border-white/30"
                    }`}
                  >
                    {value === opt.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}

export function FormInput<T extends FieldValues>({
  label,
  field,
  placeholder,
  helper,
  form,
}: BaseProps<T>) {
  const error = getError(form.formState.errors, field);

  return (
    <div>
      <Label className="text-gray-300">{label}</Label>
      <Input
        {...form.register(field)}
        placeholder={placeholder}
        className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
      />
      {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}

export function FormTextarea<T extends FieldValues>({
  label,
  field,
  placeholder,
  form,
}: BaseProps<T>) {
  const error = getError(form.formState.errors, field);

  return (
    <div>
      <Label className="text-gray-300">{label}</Label>
      <Textarea
        {...form.register(field)}
        placeholder={placeholder}
        className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 resize-none"
        rows={3}
      />
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}

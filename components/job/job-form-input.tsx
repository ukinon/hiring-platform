import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { JobConfig } from "@/types";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CalendarIcon, Camera } from "lucide-react";
import PhotoCaptureDialog from "../photo-capture-dialog";
import { Combobox } from "../ui/combobox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { DatePicker } from "../ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PhoneCountry = {
  value: string;
  label: string;
  dialCode: string;
  example: string;
  flagColors: [string, string];
};

const PHONE_COUNTRIES: PhoneCountry[] = [
  {
    value: "id",
    label: "Indonesia",
    dialCode: "+62",
    example: "81XXXXXXXXXX",
    flagColors: ["#E5001A", "#FFFFFF"],
  },
];

function FlagIcon({ colors }: { colors: [string, string] }) {
  return (
    <span
      className="block h-5 w-5 rounded-full border border-neutral-200"
      style={{
        background: `linear-gradient(180deg, ${colors[0]} 0%, ${colors[0]} 50%, ${colors[1]} 50%, ${colors[1]} 100%)`,
      }}
    />
  );
}

export default function JobFormInput({
  field,
  required,
  formField,
}: {
  field: keyof JobConfig;
  required?: boolean;
  formField: ControllerRenderProps<FieldValues, string>;
}) {
  const [captureDialogOpen, setCaptureDialogOpen] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>(
    PHONE_COUNTRIES[0]
  );
  const [localPhone, setLocalPhone] = useState<string>("");

  const label = useMemo(() => {
    return field.at(0)?.toUpperCase() + field.slice(1).replace(/_/g, " ");
  }, [field]);

  useEffect(() => {
    if (field !== "phone_number") {
      return;
    }

    const currentValue =
      typeof formField.value === "string" ? formField.value.trim() : "";

    if (!currentValue) {
      setLocalPhone("");
      return;
    }

    const matchedCountry =
      PHONE_COUNTRIES.find((item) => currentValue.startsWith(item.dialCode)) ??
      phoneCountry;

    if (matchedCountry.value !== phoneCountry.value) {
      setPhoneCountry(matchedCountry);
    }

    const hasDialCode = currentValue.startsWith(matchedCountry.dialCode);

    const digits = (
      hasDialCode
        ? currentValue.slice(matchedCountry.dialCode.length)
        : currentValue
    )
      .trimStart()
      .replace(/\D/g, "");

    setLocalPhone(digits);
  }, [field, formField.value, phoneCountry]);

  const handlePhoneCountryChange = (value: string) => {
    const nextCountry =
      PHONE_COUNTRIES.find((item) => item.value === value) ??
      PHONE_COUNTRIES[0];

    setPhoneCountry(nextCountry);

    const combinedValue =
      localPhone.length > 0 ? `${nextCountry.dialCode} ${localPhone}` : "";

    formField.onChange(combinedValue);
  };

  const handlePhoneInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const digitsOnly = event.target.value.replace(/\D/g, "");
    const dialDigits = phoneCountry.dialCode.replace(/\D/g, "");

    const normalizedDigits = digitsOnly.startsWith(dialDigits)
      ? digitsOnly.slice(dialDigits.length)
      : digitsOnly;

    setLocalPhone(normalizedDigits);

    const combinedValue =
      normalizedDigits.length > 0
        ? `${phoneCountry.dialCode} ${normalizedDigits}`
        : "";

    formField.onChange(combinedValue);
  };

  const renderFIelds = () => {
    switch (field) {
      case "full_name":
        return (
          <Input
            id={field}
            required={required}
            type="text"
            placeholder="Enter your full name"
            {...formField}
          />
        );
      case "photo_profile":
        return (
          <>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCaptureDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Take a Picture
              </Button>
              {fileName && (
                <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-md text-sm">
                  <span className="text-neutral-600">{fileName}</span>
                </div>
              )}
            </div>
            <PhotoCaptureDialog
              open={captureDialogOpen}
              onOpenChange={setCaptureDialogOpen}
              onCapture={(file) => {
                formField.onChange(file);
                setFileName(file.name);
              }}
            />
          </>
        );
      case "gender":
        return (
          <RadioGroup
            {...formField}
            onValueChange={formField.onChange}
            className="flex "
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="female" id="r1" />
              <label className="text-m-regular" htmlFor="r1">
                She/her (female)
              </label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="male" id="r2" />
              <label className="text-m-regular" htmlFor="r2">
                He/him (male)
              </label>
            </div>
          </RadioGroup>
        );
      case "domicile":
        return (
          <Combobox
            items={[{ label: "Bogor", value: "bogor" }]}
            placeholder="Choose your domicile"
            onValueChange={formField.onChange}
            {...formField}
          />
        );
      case "email":
        return (
          <Input
            id={field}
            required={required}
            type="email"
            placeholder="Enter your email"
            {...formField}
          />
        );
      case "phone_number":
        return (
          <InputGroup className="h-12">
            <InputGroupAddon className="gap-2 pl-3 pr-2 py-0">
              <Select
                value={phoneCountry.value}
                onValueChange={handlePhoneCountryChange}
              >
                <SelectTrigger
                  aria-label="Country code"
                  className="h-8 w-10 border-0 bg-transparent p-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
                >
                  <span className="sr-only">
                    <SelectValue />
                  </span>
                  <FlagIcon colors={phoneCountry.flagColors} />
                </SelectTrigger>
                <SelectContent align="start" className="min-w-[12rem]">
                  {PHONE_COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      <span className="flex w-full items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          <FlagIcon colors={country.flagColors} />
                          {country.label}
                        </span>
                        <span className="text-muted-foreground">
                          {country.dialCode}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm font-medium text-foreground">
                {phoneCountry.dialCode}
              </span>
            </InputGroupAddon>
            <InputGroupInput
              id={field}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={phoneCountry.example}
              name={formField.name}
              onBlur={formField.onBlur}
              value={localPhone}
              onChange={handlePhoneInputChange}
              className="h-12 border-0 py-0"
              required={required}
            />
          </InputGroup>
        );
      case "linkedin_link":
        return (
          <Input
            id={field}
            required={required}
            type="url"
            placeholder="Enter your LinkedIn profile link"
            {...formField}
          />
        );
      case "date_of_birth":
        return (
          <DatePicker placeholder="Enter your date of birth" {...formField} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-start gap-1">
          <label htmlFor={field} className="text-s-regular">
            {label}
          </label>
          {required && (
            <span className="text-destructive h-fit flex items-start">*</span>
          )}
        </div>
      )}

      {renderFIelds()}
    </div>
  );
}

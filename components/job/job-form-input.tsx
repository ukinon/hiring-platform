import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { JobConfig } from "@/types";
import {
  ControllerRenderProps,
  ControllerFieldState,
  FieldValues,
} from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Camera, Check } from "lucide-react";
import PhotoCaptureDialog from "../photo-capture-dialog";
import { Combobox } from "../ui/combobox";
import { Autocomplete } from "../ui/autocomplete";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { DatePicker } from "../ui/date-picker";
import Image from "next/image";

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
  {
    value: "ps",
    label: "Palestine",
    dialCode: "+970",
    example: "59XXXXXXX",
    flagColors: ["#006233", "#D50032"],
  },
  {
    value: "pl",
    label: "Poland",
    dialCode: "+48",
    example: "512XXXXXX",
    flagColors: ["#FFFFFF", "#DC143C"],
  },
  {
    value: "pt",
    label: "Portugal",
    dialCode: "+351",
    example: "91XXXXXXX",
    flagColors: ["#046A38", "#DA291C"],
  },
  {
    value: "pr",
    label: "Puerto Rico",
    dialCode: "+1",
    example: "787XXXXXXX",
    flagColors: ["#003DA5", "#BF0D3E"],
  },
];

const PHONE_COUNTRY_MAP = PHONE_COUNTRIES.reduce<Record<string, PhoneCountry>>(
  (acc, country) => {
    acc[country.value] = country;
    return acc;
  },
  {}
);

const PHONE_COUNTRY_ITEMS = PHONE_COUNTRIES.map((country) => ({
  value: country.value,
  label: country.label,
  keywords: [
    country.label.toLowerCase(),
    country.dialCode,
    country.dialCode.replace("+", ""),
    country.value,
  ],
}));

const LINKEDIN_REGEX =
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9%_-]+\/?$/i;

const DOMICILE_OPTIONS = [
  { value: "kabupaten-aceh-barat", label: "Kabupaten Aceh Barat - Aceh" },
  { value: "kabupaten-aceh-besar", label: "Kabupaten Aceh Besar - Aceh" },
  { value: "kabupaten-aceh-jaya", label: "Kabupaten Aceh Jaya - Aceh" },
  { value: "kabupaten-aceh-selatan", label: "Kabupaten Aceh Selatan - Aceh" },
  { value: "kabupaten-aceh-singkil", label: "Kabupaten Aceh Singkil - Aceh" },
  { value: "kabupaten-aceh-tamiang", label: "Kabupaten Aceh Tamiang - Aceh" },
  { value: "kabupaten-aceh-tengah", label: "Kabupaten Aceh Tengah - Aceh" },
  { value: "kabupaten-aceh-tenggara", label: "Kabupaten Aceh Tenggara - Aceh" },
  { value: "kabupaten-aceh-timur", label: "Kabupaten Aceh Timur - Aceh" },
  { value: "kabupaten-aceh-utara", label: "Kabupaten Aceh Utara - Aceh" },
  { value: "kabupaten-bener-meriah", label: "Kabupaten Bener Meriah - Aceh" },
  { value: "kabupaten-bireuen", label: "Kabupaten Bireuen - Aceh" },
  { value: "kabupaten-gayo-lues", label: "Kabupaten Gayo Lues - Aceh" },
  { value: "kabupaten-nagan-raya", label: "Kabupaten Nagan Raya - Aceh" },
  { value: "kabupaten-pidie", label: "Kabupaten Pidie - Aceh" },
  { value: "kabupaten-pidie-jaya", label: "Kabupaten Pidie Jaya - Aceh" },
  { value: "kabupaten-simeulue", label: "Kabupaten Simeulue - Aceh" },
  { value: "kota-banda-aceh", label: "Kota Banda Aceh - Aceh" },
  { value: "kota-langsa", label: "Kota Langsa - Aceh" },
  { value: "kota-lhokseumawe", label: "Kota Lhokseumawe - Aceh" },
  { value: "kota-sabang", label: "Kota Sabang - Aceh" },
  { value: "kota-subulussalam", label: "Kota Subulussalam - Aceh" },
  { value: "kabupaten-badung", label: "Kabupaten Badung - Bali" },
  { value: "kabupaten-bangli", label: "Kabupaten Bangli - Bali" },
  { value: "kabupaten-buleleng", label: "Kabupaten Buleleng - Bali" },
  { value: "kabupaten-gianyar", label: "Kabupaten Gianyar - Bali" },
  { value: "kabupaten-jembrana", label: "Kabupaten Jembrana - Bali" },
  { value: "kabupaten-karangasem", label: "Kabupaten Karangasem - Bali" },
  { value: "kabupaten-klungkung", label: "Kabupaten Klungkung - Bali" },
  { value: "kabupaten-tabanan", label: "Kabupaten Tabanan - Bali" },
  { value: "kota-denpasar", label: "Kota Denpasar - Bali" },
  { value: "kabupaten-jakarta-barat", label: "Jakarta Barat - DKI Jakarta" },
  { value: "kabupaten-jakarta-pusat", label: "Jakarta Pusat - DKI Jakarta" },
  {
    value: "kabupaten-jakarta-selatan",
    label: "Jakarta Selatan - DKI Jakarta",
  },
  { value: "kabupaten-jakarta-timur", label: "Jakarta Timur - DKI Jakarta" },
  { value: "kabupaten-jakarta-utara", label: "Jakarta Utara - DKI Jakarta" },
  {
    value: "kabupaten-kepulauan-seribu",
    label: "Kepulauan Seribu - DKI Jakarta",
  },
  { value: "kabupaten-bandung", label: "Kabupaten Bandung - Jawa Barat" },
  {
    value: "kabupaten-bandung-barat",
    label: "Kabupaten Bandung Barat - Jawa Barat",
  },
  { value: "kabupaten-bekasi", label: "Kabupaten Bekasi - Jawa Barat" },
  { value: "kabupaten-bogor", label: "Kabupaten Bogor - Jawa Barat" },
  { value: "kabupaten-ciamis", label: "Kabupaten Ciamis - Jawa Barat" },
  { value: "kabupaten-cianjur", label: "Kabupaten Cianjur - Jawa Barat" },
  { value: "kabupaten-cirebon", label: "Kabupaten Cirebon - Jawa Barat" },
  { value: "kabupaten-garut", label: "Kabupaten Garut - Jawa Barat" },
  { value: "kabupaten-indramayu", label: "Kabupaten Indramayu - Jawa Barat" },
  { value: "kabupaten-karawang", label: "Kabupaten Karawang - Jawa Barat" },
  { value: "kabupaten-kuningan", label: "Kabupaten Kuningan - Jawa Barat" },
  { value: "kabupaten-majalengka", label: "Kabupaten Majalengka - Jawa Barat" },
  {
    value: "kabupaten-pangandaran",
    label: "Kabupaten Pangandaran - Jawa Barat",
  },
  { value: "kabupaten-purwakarta", label: "Kabupaten Purwakarta - Jawa Barat" },
  { value: "kabupaten-subang", label: "Kabupaten Subang - Jawa Barat" },
  { value: "kabupaten-sukabumi", label: "Kabupaten Sukabumi - Jawa Barat" },
  { value: "kabupaten-sumedang", label: "Kabupaten Sumedang - Jawa Barat" },
  {
    value: "kabupaten-tasikmalaya",
    label: "Kabupaten Tasikmalaya - Jawa Barat",
  },
  { value: "kota-bandung", label: "Kota Bandung - Jawa Barat" },
  { value: "kota-banjar", label: "Kota Banjar - Jawa Barat" },
  { value: "kota-bekasi", label: "Kota Bekasi - Jawa Barat" },
  { value: "kota-bogor", label: "Kota Bogor - Jawa Barat" },
  { value: "kota-cimahi", label: "Kota Cimahi - Jawa Barat" },
  { value: "kota-cirebon", label: "Kota Cirebon - Jawa Barat" },
  { value: "kota-depok", label: "Kota Depok - Jawa Barat" },
  { value: "kota-sukabumi", label: "Kota Sukabumi - Jawa Barat" },
  { value: "kota-tasikmalaya", label: "Kota Tasikmalaya - Jawa Barat" },
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
  fieldState,
}: {
  field: keyof JobConfig;
  required?: boolean;
  formField: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
}) {
  const [captureDialogOpen, setCaptureDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>(
    PHONE_COUNTRIES[0]
  );
  const [localPhone, setLocalPhone] = useState<string>("");

  const label = useMemo(() => {
    return field.at(0)?.toUpperCase() + field.slice(1).replace(/_/g, " ");
  }, [field]);

  const hasError = Boolean(fieldState.error);

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
    if (!value) {
      return;
    }

    const nextCountry = PHONE_COUNTRY_MAP[value] ?? PHONE_COUNTRIES[0];

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
            aria-invalid={hasError}
            {...formField}
          />
        );
      case "photo_profile":
        return (
          <>
            <div className="flex flex-col gap-2">
              <Image
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "/assets/image-placeholder.png"
                }
                width={128}
                height={128}
                alt="placeholder"
                className="rounded-full object-cover aspect-square"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setCaptureDialogOpen(true)}
                className="flex items-center gap-2 w-fit"
              >
                <Camera className="h-4 w-4" />
                Take a Picture
              </Button>
            </div>
            <PhotoCaptureDialog
              open={captureDialogOpen}
              onOpenChange={setCaptureDialogOpen}
              onCapture={(file) => {
                formField.onChange(file);
                setFile(file);
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
          <Autocomplete
            options={DOMICILE_OPTIONS}
            placeholder="Choose your domicile"
            emptyMessage="No domicile found."
            value={formField.value}
            onValueChange={formField.onChange}
            id={field}
            name={formField.name}
            onBlur={formField.onBlur}
            aria-invalid={hasError}
          />
        );
      case "email":
        return (
          <Input
            id={field}
            required={required}
            type="email"
            placeholder="Enter your email"
            aria-invalid={hasError}
            {...formField}
          />
        );
      case "phone_number":
        return (
          <InputGroup className="h-12">
            <InputGroupAddon className="gap-2 pl-3 pr-2 py-0">
              <Combobox
                items={PHONE_COUNTRY_ITEMS}
                value={phoneCountry.value}
                onValueChange={handlePhoneCountryChange}
                placeholder="Select country"
                searchPlaceholder="Search country"
                allowClear={false}
                triggerVariant="ghost"
                triggerSize="sm"
                triggerClassName="h-8 border-0 p-0 shadow-none focus-visible:ring-0 w-fit border-r"
                triggerWidth="44px"
                contentWidth="16rem"
                contentClassName="min-w-[16rem]"
                renderTriggerValue={(item) => {
                  const country =
                    PHONE_COUNTRY_MAP[item?.value ?? phoneCountry.value] ??
                    PHONE_COUNTRIES[0];
                  return (
                    <span className="flex items-center gap-2 text-foreground">
                      <FlagIcon colors={country.flagColors} />
                    </span>
                  );
                }}
                renderItem={(item) => {
                  const country =
                    PHONE_COUNTRY_MAP[item.value] ?? PHONE_COUNTRIES[0];
                  return (
                    <span className="flex w-full items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <FlagIcon colors={country.flagColors} />
                        {country.label}
                      </span>
                      <span className="text-muted-foreground">
                        {country.dialCode}
                      </span>
                    </span>
                  );
                }}
              />
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
              aria-invalid={hasError}
            />
          </InputGroup>
        );
      case "linkedin_link": {
        const value =
          typeof formField.value === "string" ? formField.value.trim() : "";
        const isValid = value.length > 0 && LINKEDIN_REGEX.test(value);

        return (
          <>
            <Input
              id={field}
              required={required}
              type="url"
              placeholder="Enter your LinkedIn profile link"
              aria-invalid={hasError}
              {...formField}
            />
            {isValid && (
              <div className="flex items-center gap-2">
                <span className="flex size-4 p-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  <Check className="size-3" />
                </span>
                <span className="text-s-regular text-primary">
                  URL address found
                </span>
              </div>
            )}
          </>
        );
      }
      case "date_of_birth":
        return (
          <DatePicker
            placeholder="Enter your date of birth"
            aria-invalid={hasError}
            {...formField}
          />
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

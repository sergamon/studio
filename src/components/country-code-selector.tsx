"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { countries } from "@/lib/countries"
import { useLanguage } from "@/hooks/use-language"

interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const CountryCodeSelector = ({ value, onChange }: CountryCodeSelectorProps) => {
  const [open, setOpen] = React.useState(false)
  const { t } = useLanguage()

  const selectedCountry = countries.find(
    (country) => country.code.replace(/-/g, "") === value
  )

  const getCountryFlag = (countryCode: string) => {
    // Basic mapping for some countries. In a real app, use a library or more robust mapping.
    const codeMap: { [key: string]: string } = {
        "57": "CO", "1": "US", "54": "AR", "55": "BR", "56": "CL", "593": "EC", "51": "PE", "598": "UY", "58": "VE", "52": "MX", "34": "ES",
    };

    const isoCode = codeMap[countryCode.replace(/-/g, "")] || "UN"; // Default to UN flag
    if (isoCode === 'UN') return '🏳️';
    return String.fromCodePoint(...[...isoCode.toUpperCase()].map(char => 0x1F1E6 + char.charCodeAt(0) - 65));
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? <><span className="mr-2">{getCountryFlag(selectedCountry?.code || '')}</span> +{value}</>
            : t('select_country_code')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={t('search_country')} />
          <CommandList>
            <CommandEmpty>{t('no_country_found')}</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={`${country.label}-${country.code}`}
                  value={`${country.label} +${country.code}`}
                  onSelect={() => {
                    onChange(country.code.replace(/-/g, ""))
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.code.replace(/-/g, "") ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="mr-2">{getCountryFlag(country.code)}</span>
                  <span>{country.label}</span>
                  <span className="ml-auto text-muted-foreground">+{country.code}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CountryCodeSelector;

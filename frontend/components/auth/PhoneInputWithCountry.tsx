"use client";
import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import countryCodes from "@/lib/countryCodes";

interface PhoneInputWithCountryProps {
    value: string;
    onChange: (e: { target: { value: string } }) => void;
    id: string;
    required?: boolean;
    selectedCountry: { name: string; code: string };
    setSelectedCountry: (country: { name: string; code: string }) => void;
    search: string;
    setSearch: (search: string) => void;
}

const PhoneInputWithCountry = React.memo(({
                                              value,
                                              onChange,
                                              id,
                                              required = false,
                                              selectedCountry,
                                              setSelectedCountry,
                                              search,
                                              setSearch
                                          }: PhoneInputWithCountryProps) => {
    const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = e.target.value.replace(/\D/g, '');
        onChange({ target: { value: cleaned } });
    }, [onChange]);

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="flex items-center px-3 py-2 border rounded-lg w-28 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    >
                        {selectedCountry?.code || '+227'}
                        <ChevronsUpDown className="w-4 h-4 ml-2" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                    <input
                        type="text"
                        placeholder="Rechercher un pays..."
                        className="w-full px-3 py-2 border rounded-lg mb-2 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="max-h-48 overflow-y-auto">
                        {countryCodes
                            .filter((country) =>
                                country.name.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((country) => (
                                <div
                                    key={country.code}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                                    onClick={() => {
                                        setSelectedCountry(country);
                                        document.getElementById(id)?.focus();
                                    }}
                                >
                                    {country.name} ({country.code})
                                </div>
                            ))}
                    </div>
                </PopoverContent>
            </Popover>
            <Input
                id={id}
                type="tel"
                placeholder="99000000"
                value={value}
                onChange={handlePhoneChange}
                className="flex-1"
                required={required}
                maxLength={8}
                inputMode="numeric"
                pattern="[0-9]*"
            />
        </div>
    );
});

PhoneInputWithCountry.displayName = "PhoneInputWithCountry";

export default PhoneInputWithCountry;
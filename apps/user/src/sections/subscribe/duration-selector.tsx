"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Label } from "@workspace/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import type React from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  getOptionDurationUnit,
  getOptionDurationValue,
  getOptionOriginalPrice,
  getOptionPrice,
  type SubscribePriceOptionLike,
} from "./price-options";

interface DurationSelectorProps {
  quantity: number;
  unitTime?: string;
  discounts?: Array<{ quantity: number | string; discount: number | string }>;
  onChange: (value: number) => void;
  showOriginalPrice?: boolean;
  priceOptions?: SubscribePriceOptionLike[];
  selectedPriceOptionId?: string | number;
  onChangeOption?: (value: string) => void;
}

function toNumber(value?: number | string | null) {
  const parsed = typeof value === "string" ? Number(value) : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({
  quantity,
  unitTime = "Month",
  discounts = [],
  onChange,
  showOriginalPrice = true,
  priceOptions = [],
  selectedPriceOptionId,
  onChangeOption,
}) => {
  const { t } = useTranslation("subscribe");
  const handleChange = useCallback(
    (value: string) => {
      if (priceOptions.length > 0) {
        onChangeOption?.(value);
        return;
      }
      onChange(Number(value));
    },
    [onChange, onChangeOption, priceOptions.length]
  );

  const DurationOption: React.FC<{ value: string; label: string }> = ({
    value,
    label,
  }) => (
    <div className="relative">
      <RadioGroupItem className="peer sr-only" id={value} value={value} />
      <Label
        className="relative flex h-full flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
        htmlFor={value}
      >
        {label}
      </Label>
    </div>
  );

  const currentDiscount = discounts?.find(
    (item) => toNumber(item.quantity) === quantity
  )?.discount;
  const discountPercentage = currentDiscount
    ? 100 - toNumber(currentDiscount)
    : 0;
  const selectedOption = priceOptions.find(
    (item) => String(item.id) === String(selectedPriceOptionId)
  );
  const formatOptionLabel = (item: SubscribePriceOptionLike) => {
    const durationUnit = getOptionDurationUnit(item);
    if (durationUnit === "NoLimit") {
      return item.name || t("NoLimit", "No Limit");
    }
    const value = getOptionDurationValue(item);
    const unit = t(durationUnit, durationUnit);
    return item.name || `${value} / ${unit}`;
  };

  return (
    <>
      <div className="font-semibold">
        {t("purchaseDuration", "Purchase Duration")}
      </div>
      <RadioGroup
        className="flex flex-wrap gap-3"
        onValueChange={handleChange}
        value={
          priceOptions.length > 0
            ? String(selectedPriceOptionId || "")
            : String(quantity)
        }
      >
        {priceOptions.length > 0
          ? priceOptions.map((item) => (
              <DurationOption
                key={String(item.id)}
                label={formatOptionLabel(item)}
                value={String(item.id)}
              />
            ))
          : (
            <>
              {showOriginalPrice && unitTime !== "Minute" && (
                <DurationOption label={`1 / ${t(unitTime)}`} value="1" />
              )}
              {discounts?.map((item) => (
                <DurationOption
                  key={String(item.quantity)}
                  label={`${item.quantity} / ${t(unitTime)}`}
                  value={String(item.quantity)}
                />
              ))}
            </>
          )}
      </RadioGroup>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {t("discountInfo", "Discount Info")}:
        </span>
        {selectedOption && getOptionOriginalPrice(selectedOption) ? (
          <Badge className="h-6 text-sm" variant="destructive">
            -
            {(
              (Math.max(
                0,
                getOptionOriginalPrice(selectedOption) -
                  getOptionPrice(selectedOption)
              ) /
                Math.max(1, getOptionOriginalPrice(selectedOption))) *
              100
            ).toFixed(2)}
            % {t("discount", "Discount")}
          </Badge>
        ) : discountPercentage > 0 ? (
          <Badge className="h-6 text-sm" variant="destructive">
            -{discountPercentage.toFixed(2)}% {t("discount", "Discount")}
          </Badge>
        ) : (
          <span className="h-6 text-muted-foreground text-sm">--</span>
        )}
      </div>
    </>
  );
};

export default DurationSelector;

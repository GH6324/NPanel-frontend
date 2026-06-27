"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Switch } from "@workspace/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { Combobox } from "@workspace/ui/composed/combobox";
import { ArrayInput } from "@workspace/ui/composed/dynamic-inputs";
import {
  HTMLEditor,
  MarkdownEditor,
} from "@workspace/ui/composed/editor/index";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import {
  getGroupConfig,
  getNodeGroupList,
} from "@workspace/ui/services/admin/group";
import { getSubscribeCategoryList } from "@workspace/ui/services/admin/subscribe";
import { unitConversion } from "@workspace/ui/utils/unit-conversions";
import {
  CreditCard,
  PlusIcon,
  Server,
  Settings,
  Trash2Icon,
} from "lucide-react";
import { shake } from "radash";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { useGlobalStore } from "@/stores/global";
import { useNode } from "@/stores/node";

interface SubscribeFormProps<T> {
  onSubmit: (data: T) => Promise<boolean> | boolean;
  initialValues?: T;
  loading?: boolean;
  trigger: string;
  title: string;
}

const defaultValues = {
  inventory: -1,
  speed_limit: 0,
  device_limit: 0,
  traffic: 0,
  quota: 0,
  discount: [],
  language: "",
  node_tags: [],
  nodes: [],
  node_group_id: "",
  node_group_ids: [],
  unit_time: "Month",
  price_options: [],
  short_description: "",
  features: [],
  detail_format: "markdown",
  detail_content: "",
  legacy_description_input: "",
  deduction_ratio: 0,
  purchase_with_discount: false,
  reset_cycle: 0,
  renewal_reset: false,
  show_original_price: false,
  deduction_mode: "auto",
  traffic_limit: [],
  category_id: "",
};

function toNumber(value: unknown): number | undefined {
  if (value === "" || value === null || value === undefined) return;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

type SubscribeFeatureEditorItem = {
  icon: string;
  label: string;
  type: "default" | "success" | "destructive";
};

type SubscribeDetailFormat = "markdown" | "html" | "text";

function parseJSON(value?: unknown) {
  if (typeof value !== "string" || value.trim() === "") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeFeatureItems(value?: unknown): SubscribeFeatureEditorItem[] {
  const parsed = typeof value === "string" ? parseJSON(value) : value;
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const raw = item as Record<string, unknown>;
      const label = raw.label ?? raw.feature ?? raw.text;
      if (label === undefined || label === null || label === "") return null;
      const support = raw.support;
      const rawType = String(raw.type || "").toLowerCase();
      const type =
        rawType === "success" ||
        rawType === "destructive" ||
        rawType === "default"
          ? rawType
          : support === false
            ? "destructive"
            : support === true
              ? "success"
              : "default";
      return {
        icon: typeof raw.icon === "string" ? raw.icon : "",
        label: String(label),
        type,
      };
    })
    .filter(Boolean) as SubscribeFeatureEditorItem[];
}

function parseLegacyDescription(description?: unknown) {
  const parsed = parseJSON(description);
  if (Array.isArray(parsed)) {
    return {
      shortDescription: "",
      features: normalizeFeatureItems(parsed),
      detailContent: "",
      detailFormat: "markdown",
    };
  }
  if (!parsed || typeof parsed !== "object") {
    return {
      shortDescription:
        typeof description === "string" ? description.trim() : "",
      features: [] as SubscribeFeatureEditorItem[],
      detailContent: "",
      detailFormat: "markdown",
    };
  }
  const object = parsed as Record<string, unknown>;
  return {
    shortDescription: String(object.description || "").trim(),
    features: normalizeFeatureItems(object.features),
    detailContent: String(object.detail_content || object.content || "").trim(),
    detailFormat: String(object.detail_format || "markdown"),
  };
}

function normalizeDetailFormat(value?: unknown): SubscribeDetailFormat {
  const format = String(value || "").toLowerCase();
  if (format === "html") return "html";
  if (format === "text" || format === "plain") return "text";
  return "markdown";
}

function buildLegacyDescription(values: Record<string, any>) {
  return JSON.stringify({
    description: values.short_description || "",
    features: normalizeFeatureItems(values.features),
  });
}

function normalizeSubscribeValues<T extends Record<string, any>>(values?: T) {
  const processedValues: Record<string, any> = {
    ...defaultValues,
    ...(shake(values, (value) => value === null) as Record<string, any>),
  };

  const priceOptions = Array.isArray(processedValues.price_options)
    ? processedValues.price_options.map((item: Record<string, any>) => ({
        ...item,
        name: item.name ?? "",
        duration_unit:
          item.duration_unit || processedValues.unit_time || "Month",
        duration_value:
          item.duration_unit === "NoLimit"
            ? 0
            : toNumber(item.duration_value) || 1,
        price:
          toNumber(item.price) ?? toNumber(processedValues.unit_price) ?? 0,
        original_price: toNumber(item.original_price) ?? 0,
        inventory: toNumber(item.inventory) ?? -1,
        show: item.show ?? true,
        sell: item.sell ?? true,
        is_default: item.is_default ?? false,
        sort: toNumber(item.sort) ?? 0,
      }))
    : [];
  if (priceOptions.length === 0) {
    priceOptions.push({
      name: "",
      duration_unit: processedValues.unit_time || "Month",
      duration_value: processedValues.unit_time === "NoLimit" ? 0 : 1,
      price: toNumber(processedValues.unit_price) ?? 0,
      original_price: 0,
      inventory: -1,
      show: true,
      sell: true,
      is_default: true,
      sort: 100,
    });
  }
  if (!priceOptions.some((item) => item.is_default)) {
    priceOptions[0]!.is_default = true;
  }
  const legacyDescription = parseLegacyDescription(processedValues.description);
  const features =
    processedValues.features !== undefined &&
    processedValues.features !== null &&
    processedValues.features !== ""
      ? normalizeFeatureItems(processedValues.features)
      : legacyDescription.features;

  return {
    ...processedValues,
    unit_price: toNumber(processedValues.unit_price) ?? 0,
    replacement: toNumber(processedValues.replacement),
    inventory: toNumber(processedValues.inventory) ?? defaultValues.inventory,
    speed_limit:
      toNumber(processedValues.speed_limit) ?? defaultValues.speed_limit,
    device_limit:
      toNumber(processedValues.device_limit) ?? defaultValues.device_limit,
    traffic: toNumber(processedValues.traffic) ?? defaultValues.traffic,
    quota: toNumber(processedValues.quota) ?? defaultValues.quota,
    deduction_ratio:
      toNumber(processedValues.deduction_ratio) ??
      defaultValues.deduction_ratio,
    reset_cycle:
      toNumber(processedValues.reset_cycle) ?? defaultValues.reset_cycle,
    node_group_id:
      processedValues.node_group_id === undefined ||
      processedValues.node_group_id === null
        ? ""
        : String(processedValues.node_group_id),
    category_id:
      processedValues.category_id === undefined ||
      processedValues.category_id === null ||
      Number(processedValues.category_id) === 0
        ? ""
        : String(processedValues.category_id),
    nodes: Array.isArray(processedValues.nodes)
      ? processedValues.nodes.map((id) => String(id))
      : [],
    node_group_ids: Array.isArray(processedValues.node_group_ids)
      ? processedValues.node_group_ids.map((id) => String(id))
      : [],
    discount: Array.isArray(processedValues.discount)
      ? processedValues.discount.map((item: Record<string, any>) => ({
          ...item,
          quantity: toNumber(item.quantity) ?? 0,
          discount: toNumber(item.discount) ?? 0,
          price: toNumber(item.price) ?? 0,
        }))
      : [],
    price_options: priceOptions,
    traffic_limit: Array.isArray(processedValues.traffic_limit)
      ? processedValues.traffic_limit.map((item: Record<string, any>) => ({
          ...item,
          stat_value: toNumber(item.stat_value) ?? 0,
          traffic_usage: toNumber(item.traffic_usage) ?? 0,
          speed_limit: toNumber(item.speed_limit) ?? 0,
        }))
      : [],
    short_description:
      processedValues.short_description ??
      processedValues.shortDescription ??
      legacyDescription.shortDescription,
    features,
    detail_format: normalizeDetailFormat(
      processedValues.detail_format ??
        processedValues.detailFormat ??
        legacyDescription.detailFormat
    ),
    detail_content:
      processedValues.detail_content ??
      processedValues.detailContent ??
      legacyDescription.detailContent,
    legacy_description_input:
      typeof processedValues.description === "string"
        ? processedValues.description
        : "",
  };
}

function normalizePriceOptionsForSubmit(
  items: Record<string, any>[] | undefined,
  fallback: Record<string, any>
) {
  const source = Array.isArray(items) && items.length > 0 ? items : [];
  const normalized = source.map((item, index) => {
    const durationUnit = item.duration_unit || fallback.unit_time || "Month";
    return {
      ...item,
      name: "",
      duration_unit: durationUnit,
      duration_value:
        durationUnit === "NoLimit" ? 0 : toNumber(item.duration_value) || 1,
      price: toNumber(item.price) ?? 0,
      original_price: toNumber(item.original_price) ?? 0,
      inventory: -1,
      show: true,
      sell: true,
      is_default: item.is_default ?? index === 0,
      sort: toNumber(item.sort) ?? source.length - index,
    };
  });
  if (!normalized.some((item) => item.is_default) && normalized[0]) {
    normalized[0].is_default = true;
  }
  return normalized;
}

function buildCategoryOptions(categories: API.SubscribeCategoryInfo[] = []) {
  const childrenMap = new Map<string, API.SubscribeCategoryInfo[]>();
  const roots: API.SubscribeCategoryInfo[] = [];

  for (const category of categories) {
    const parentID = String(category.parent_id || "");
    if (!parentID || parentID === "0") {
      roots.push(category);
      continue;
    }
    const children = childrenMap.get(parentID) || [];
    children.push(category);
    childrenMap.set(parentID, children);
  }

  const options: { label: string; value: string }[] = [];
  const walk = (items: API.SubscribeCategoryInfo[], depth: number) => {
    for (const item of items) {
      options.push({
        label: `${"　".repeat(depth)}${item.name}`,
        value: String(item.id),
      });
      walk(childrenMap.get(String(item.id)) || [], depth + 1);
    }
  };

  walk(roots, 0);
  return options;
}

function getFirstValidationMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return;

  const message = (error as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (Array.isArray(error)) {
    for (const item of error) {
      const nestedMessage = getFirstValidationMessage(item);
      if (nestedMessage) return nestedMessage;
    }
    return;
  }

  for (const value of Object.values(error as Record<string, unknown>)) {
    const nestedMessage = getFirstValidationMessage(value);
    if (nestedMessage) return nestedMessage;
  }

  return;
}

type PriceOptionEditorItem = {
  id?: string | number;
  name: string;
  duration_unit: string;
  duration_value: number;
  price: number;
  original_price: number;
  inventory: number;
  show: boolean;
  sell: boolean;
  is_default: boolean;
  sort: number;
  [key: string]: unknown;
};

function getDiscountLabel(item: PriceOptionEditorItem) {
  if (!(item.original_price > 0)) return "-";
  const ratio = item.price / item.original_price;
  if (!Number.isFinite(ratio)) return "-";
  return `${Math.max(0, Math.round((1 - ratio) * 100))}%`;
}

function PriceOptionsEditor({
  currencySymbol,
  onChange,
  value = [],
}: {
  currencySymbol?: string;
  onChange: (value: PriceOptionEditorItem[]) => void;
  value?: Partial<PriceOptionEditorItem>[];
}) {
  const { t } = useTranslation("product");
  const durationUnitOptions = [
    { label: t("form.Minute"), value: "Minute" },
    { label: t("form.Hour"), value: "Hour" },
    { label: t("form.Day"), value: "Day" },
    { label: t("form.Week"), value: "Week" },
    { label: t("form.Month"), value: "Month" },
    { label: t("form.Year"), value: "Year" },
    { label: t("form.NoLimit"), value: "NoLimit" },
  ];

  const createDefaultOption = (index: number): PriceOptionEditorItem => ({
    name: "",
    duration_unit: "Month",
    duration_value: 1,
    price: 0,
    original_price: 0,
    inventory: -1,
    show: true,
    sell: true,
    is_default: index === 0,
    sort: (index + 1) * 100,
  });

  const normalizeItems = (items: Partial<PriceOptionEditorItem>[]) => {
    const normalized: PriceOptionEditorItem[] = items.map((item, index) => {
      const durationUnit = item.duration_unit || "Month";
      return {
        ...item,
        name: "",
        duration_unit: durationUnit,
        duration_value:
          durationUnit === "NoLimit" ? 0 : toNumber(item.duration_value) || 1,
        price: toNumber(item.price) ?? 0,
        original_price: toNumber(item.original_price) ?? 0,
        inventory: -1,
        show: true,
        sell: true,
        is_default: item.is_default ?? index === 0,
        sort: toNumber(item.sort) ?? (index + 1) * 100,
      };
    });

    if (!normalized.some((item) => item.is_default) && normalized[0]) {
      normalized[0].is_default = true;
    }
    return normalized;
  };

  const safeValue =
    value.length > 0 ? normalizeItems(value) : [createDefaultOption(0)];

  const emitChange = (items: Partial<PriceOptionEditorItem>[]) => {
    onChange(normalizeItems(items));
  };

  const updateItem = (index: number, patch: Partial<PriceOptionEditorItem>) => {
    const nextItems = safeValue.map((item, itemIndex) => {
      if (itemIndex !== index) {
        return patch.is_default ? { ...item, is_default: false } : item;
      }
      return { ...item, ...patch };
    });
    emitChange(nextItems);
  };

  const addOption = () => {
    emitChange([...safeValue, createDefaultOption(safeValue.length)]);
  };

  const removeOption = (index: number) => {
    const nextItems = safeValue.filter((_, itemIndex) => itemIndex !== index);
    emitChange(nextItems.length > 0 ? nextItems : [createDefaultOption(0)]);
  };

  return (
    <div className="space-y-2">
      <div className="hidden grid-cols-[minmax(220px,1.25fr)_minmax(160px,1fr)_minmax(160px,1fr)_80px_88px_44px] gap-3 px-1 text-muted-foreground text-xs lg:grid">
        <span>{t("form.duration")}</span>
        <span>{t("form.originalPrice")}</span>
        <span>{t("form.price")}</span>
        <span>{t("form.discountRate")}</span>
        <span>{t("form.recommended")}</span>
        <span />
      </div>
      <div className="space-y-2">
        {safeValue.map((item, index) => (
          <div
            className="grid gap-3 rounded-lg border bg-card p-3 lg:grid-cols-[minmax(220px,1.25fr)_minmax(160px,1fr)_minmax(160px,1fr)_80px_88px_44px] lg:items-end"
            key={`${item.id ?? "option"}-${index}`}
          >
            <div className="space-y-2">
              <Label className="lg:hidden">{t("form.duration")}</Label>
              <div className="grid grid-cols-[1fr_1.2fr] gap-2">
                <EnhancedInput
                  disabled={item.duration_unit === "NoLimit"}
                  min={1}
                  onValueChange={(durationValue) =>
                    updateItem(index, {
                      duration_value:
                        item.duration_unit === "NoLimit"
                          ? 0
                          : toNumber(durationValue) || 1,
                    })
                  }
                  step={1}
                  type="number"
                  value={
                    item.duration_unit === "NoLimit"
                      ? 0
                      : toNumber(item.duration_value) || 1
                  }
                />
                <Combobox<string, false>
                  onChange={(durationUnit) =>
                    updateItem(index, {
                      duration_unit: durationUnit,
                      duration_value:
                        durationUnit === "NoLimit"
                          ? 0
                          : toNumber(item.duration_value) || 1,
                    })
                  }
                  options={durationUnitOptions}
                  placeholder={t("form.selectUnitTime")}
                  value={item.duration_unit || "Month"}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="lg:hidden">{t("form.originalPrice")}</Label>
              <EnhancedInput
                formatInput={(inputValue) =>
                  unitConversion("centsToDollars", inputValue)
                }
                formatOutput={(inputValue) =>
                  unitConversion("dollarsToCents", inputValue)
                }
                min={0}
                onValueChange={(originalPrice) =>
                  updateItem(index, {
                    original_price: toNumber(originalPrice) ?? 0,
                  })
                }
                prefix={currencySymbol}
                step={0.01}
                type="number"
                value={item.original_price}
              />
            </div>
            <div className="space-y-2">
              <Label className="lg:hidden">{t("form.price")}</Label>
              <EnhancedInput
                formatInput={(inputValue) =>
                  unitConversion("centsToDollars", inputValue)
                }
                formatOutput={(inputValue) =>
                  unitConversion("dollarsToCents", inputValue)
                }
                min={0}
                onValueChange={(price) =>
                  updateItem(index, { price: toNumber(price) ?? 0 })
                }
                prefix={currencySymbol}
                step={0.01}
                type="number"
                value={item.price}
              />
            </div>
            <div className="space-y-2">
              <Label className="lg:hidden">{t("form.discountRate")}</Label>
              <div className="flex h-9 items-center rounded-md border bg-muted/40 px-3 text-muted-foreground text-sm">
                {getDiscountLabel(item)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="lg:hidden">{t("form.recommended")}</Label>
              <div className="flex h-9 items-center">
                <Switch
                  checked={!!item.is_default}
                  onCheckedChange={(checked) => {
                    if (!checked) return;
                    if (
                      safeValue.some(
                        (option, optionIndex) =>
                          optionIndex !== index && option.is_default
                      )
                    ) {
                      toast.info(t("form.recommendedOptionChanged"));
                    }
                    updateItem(index, { is_default: true });
                  }}
                />
              </div>
            </div>
            <div className="flex h-9 items-center justify-end">
              {safeValue.length > 1 && (
                <Button
                  aria-label={t("form.deletePriceOption")}
                  className="text-destructive"
                  onClick={() => removeOption(index)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button
        className="w-full"
        onClick={addOption}
        type="button"
        variant="outline"
      >
        <PlusIcon className="size-4" />
        {t("form.addPriceOption")}
      </Button>
    </div>
  );
}

function FeatureEditor({
  onChange,
  value = [],
}: {
  onChange: (value: SubscribeFeatureEditorItem[]) => void;
  value?: SubscribeFeatureEditorItem[];
}) {
  const { t } = useTranslation("product");
  const safeValue = Array.isArray(value) ? value : [];
  const typeOptions = [
    { label: t("form.featureDefault", "Default"), value: "default" },
    { label: t("form.featureSuccess", "Included"), value: "success" },
    {
      label: t("form.featureDestructive", "Not included"),
      value: "destructive",
    },
  ];

  const updateItem = (
    index: number,
    patch: Partial<SubscribeFeatureEditorItem>
  ) => {
    onChange(
      safeValue.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  };

  const addItem = () => {
    onChange([
      ...safeValue,
      {
        icon: "uil:shield-check",
        label: "",
        type: "default",
      },
    ]);
  };

  const removeItem = (index: number) => {
    onChange(safeValue.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {safeValue.map((item, index) => (
          <div
            className="grid gap-3 rounded-lg border bg-card p-3 lg:grid-cols-[minmax(140px,0.7fr)_minmax(240px,1.4fr)_minmax(160px,0.8fr)_44px] lg:items-end"
            key={`${item.label}-${index}`}
          >
            <div className="space-y-2">
              <Label>{t("form.featureIcon", "Icon")}</Label>
              <EnhancedInput
                onValueChange={(icon) => updateItem(index, { icon })}
                placeholder="uil:shield-check"
                value={item.icon}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("form.featureLabel", "Feature")}</Label>
              <EnhancedInput
                onValueChange={(label) => updateItem(index, { label })}
                placeholder={t("form.featureLabelPlaceholder", "Feature text")}
                value={item.label}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("form.featureType", "Status")}</Label>
              <Select
                onValueChange={(type) =>
                  updateItem(index, {
                    type: type as SubscribeFeatureEditorItem["type"],
                  })
                }
                value={item.type || "default"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex h-9 items-center justify-end">
              <Button
                aria-label={t("form.deleteFeature", "Delete feature")}
                className="text-destructive"
                onClick={() => removeItem(index)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        className="w-full"
        onClick={addItem}
        type="button"
        variant="outline"
      >
        <PlusIcon className="size-4" />
        {t("form.addFeature", "Add Feature")}
      </Button>
    </div>
  );
}

export default function SubscribeForm<T extends Record<string, any>>({
  onSubmit,
  initialValues,
  loading,
  trigger,
  title,
}: Readonly<SubscribeFormProps<T>>) {
  const { common } = useGlobalStore();
  const { currency } = common;

  const { i18n, t } = useTranslation("product");
  const [open, setOpen] = useState(false);
  const isZh = i18n.resolvedLanguage?.startsWith("zh");
  const categoryText = useMemo(
    () => ({
      none: t("category.none", {
        defaultValue: isZh ? "暂无分类" : "Uncategorized",
      }),
      title: t("category.title", {
        defaultValue: isZh ? "商品分类" : "Product Category",
      }),
    }),
    [isZh, t]
  );

  const formSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    short_description: z.string().optional(),
    features: z
      .array(
        z.object({
          icon: z.string().optional(),
          label: z.string(),
          type: z.enum(["default", "success", "destructive"]),
        })
      )
      .optional(),
    detail_format: z.enum(["markdown", "html", "text"]).optional(),
    detail_content: z.string().optional(),
    legacy_description_input: z.string().optional(),
    unit_price: z.number(),
    unit_time: z.string(),
    price_options: z
      .array(
        z.object({
          id: z.union([z.string(), z.number()]).optional(),
          name: z.string().optional(),
          duration_unit: z.string(),
          duration_value: z.number(),
          price: z.number(),
          original_price: z.number().optional(),
          inventory: z.number().optional(),
          show: z.boolean().optional(),
          sell: z.boolean().optional(),
          is_default: z.boolean().optional(),
          sort: z.number().optional(),
        })
      )
      .optional(),
    replacement: z.number().optional(),
    discount: z
      .array(
        z.object({
          quantity: z.number(),
          discount: z.number(),
        })
      )
      .optional(),
    inventory: z.number().optional(),
    speed_limit: z.number().optional(),
    device_limit: z.number().optional(),
    traffic: z.number().optional(),
    quota: z.number().optional(),
    language: z.string().optional(),
    node_tags: z.array(z.string()).optional(),
    nodes: z.array(z.string()).optional(),
    node_group_id: z.string().optional(),
    node_group_ids: z.optional(z.array(z.string()).default([])),
    category_id: z.string().optional(),
    deduction_ratio: z.number().optional(),
    allow_deduction: z.boolean().optional(),
    reset_cycle: z.number().optional(),
    renewal_reset: z.boolean().optional(),
    show_original_price: z.boolean().optional(),
    traffic_limit: z
      .array(
        z.object({
          stat_type: z.string(),
          stat_value: z.number().int(),
          traffic_usage: z.number(),
          speed_limit: z.number(),
        })
      )
      .optional(),
  });

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: normalizeSubscribeValues(initialValues),
  });

  useEffect(() => {
    const processedValues = normalizeSubscribeValues(initialValues);
    form?.reset(processedValues);
  }, [form, initialValues, open]);

  async function handleSubmit(data: { [x: string]: any }) {
    const priceOptions = normalizePriceOptionsForSubmit(
      data.price_options,
      data
    );
    const defaultOption =
      priceOptions.find((item) => item.is_default) || priceOptions[0];
    const { legacy_description_input: _legacyDescriptionInput, ...formData } =
      data;
    const submitData: Record<string, any> = {
      ...formData,
      category_id: data.category_id ? Number(data.category_id) : 0,
      description: buildLegacyDescription(data),
      features: JSON.stringify(normalizeFeatureItems(data.features)),
      detail_format: normalizeDetailFormat(data.detail_format),
      discount: [],
      price_options: priceOptions,
      show_original_price: false,
      unit_price: defaultOption?.price ?? data.unit_price,
      unit_time: defaultOption?.duration_unit ?? data.unit_time,
    };

    const bool = await onSubmit(submitData as unknown as T);
    if (bool) setOpen(false);
  }

  const {
    getAllAvailableTags,
    getNodesByTag,
    getNodesWithoutTags,
    getNodesWithoutGroups,
    nodes,
  } = useNode();

  const tagGroups = getAllAvailableTags();

  const applyLegacyDescriptionInput = (value: string) => {
    form.setValue("legacy_description_input", value, { shouldDirty: true });
    const parsed = parseJSON(value);
    if (!parsed) return;

    if (Array.isArray(parsed)) {
      form.setValue("features", normalizeFeatureItems(parsed), {
        shouldDirty: true,
      });
      return;
    }

    if (typeof parsed !== "object") return;

    const legacyDescription = parseLegacyDescription(value);
    form.setValue("short_description", legacyDescription.shortDescription, {
      shouldDirty: true,
    });
    form.setValue("features", legacyDescription.features, {
      shouldDirty: true,
    });
    form.setValue(
      "detail_format",
      normalizeDetailFormat(legacyDescription.detailFormat),
      {
        shouldDirty: true,
      }
    );
    form.setValue("detail_content", legacyDescription.detailContent, {
      shouldDirty: true,
    });
  };

  // Fetch node groups (exclude expired groups)
  const { data: nodeGroupsData } = useQuery({
    queryKey: ["nodeGroups"],
    queryFn: async () => {
      const { data } = await getNodeGroupList({ page: 1, size: 1000 });
      const allGroups = data.data?.list || [];
      // Filter out expired node groups
      return allGroups.filter((group) => !group.is_expired_group);
    },
  });

  const { data: subscribeCategories = [] } = useQuery({
    queryKey: ["subscribeCategories"],
    queryFn: async () => {
      const { data } = await getSubscribeCategoryList({});
      return data.data?.list || [];
    },
  });

  const categoryOptions = useMemo(
    () => [
      { label: categoryText.none, value: "" },
      ...buildCategoryOptions(subscribeCategories),
    ],
    [categoryText.none, subscribeCategories]
  );

  // Fetch group config to check if group feature is enabled
  const { data: groupConfigData } = useQuery({
    queryKey: ["groupConfig"],
    queryFn: async () => {
      const { data } = await getGroupConfig();
      return data.data;
    },
  });

  const isGroupEnabled = groupConfigData?.enabled;
  const getNodeGroupSpecialLabel = (nodeGroup?: API.NodeGroup) => {
    switch (nodeGroup?.type) {
      case "subscribe":
        return t("form.nodeGroupSubscribeOnly");
      case "app":
        return t("form.nodeGroupAppOnly");
      default:
        return "";
    }
  };
  const formatNodeGroupOptionLabel = (nodeGroup: API.NodeGroup) => {
    const specialLabel = getNodeGroupSpecialLabel(nodeGroup);
    return specialLabel
      ? `${nodeGroup.name} (${specialLabel})`
      : nodeGroup.name;
  };

  const node_group_id = form.watch("node_group_id");
  const node_group_ids = form.watch("node_group_ids");

  // Watch node_group_id and automatically include it in node_group_ids
  useEffect(() => {
    if (node_group_id) {
      const currentGroupIds = form.getValues("node_group_ids") || [];
      if (!currentGroupIds.includes(node_group_id)) {
        form.setValue("node_group_ids", [...currentGroupIds, node_group_id]);
      }
    }
  }, [node_group_id, form]);

  // If node_group_id is empty or 0, automatically set it to the first item in node_group_ids
  useEffect(() => {
    if (
      (!node_group_id || node_group_id === "0") &&
      node_group_ids &&
      node_group_ids.length > 0
    ) {
      form.setValue("node_group_id", node_group_ids[0]);
    }
  }, [node_group_ids, node_group_id, form]);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            form.reset();
            setOpen(true);
          }}
        >
          {trigger}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-full gap-0 sm:max-w-[96vw] lg:max-w-6xl xl:max-w-7xl">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form className="pt-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <Tabs className="w-full" defaultValue="basic">
                <TabsList className="mb-6 grid w-full grid-cols-5">
                  <TabsTrigger
                    className="flex items-center gap-2"
                    value="basic"
                  >
                    <Settings className="h-4 w-4" />
                    {t("form.basic")}
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex items-center gap-2"
                    value="content"
                  >
                    <Icon className="h-4 w-4" icon="uil:document-layout-left" />
                    {t("form.content", "Content")}
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex items-center gap-2"
                    value="pricing"
                  >
                    <CreditCard className="h-4 w-4" />
                    {t("form.pricing")}
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex items-center gap-2"
                    value="servers"
                  >
                    <Server className="h-4 w-4" />
                    {t("form.nodes")}
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex items-center gap-2"
                    value="traffic-limit"
                  >
                    <Icon className="h-4 w-4" icon="uil:tachometer-fast" />
                    {t("form.trafficLimit")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent className="space-y-4" value="basic">
                  <div className="grid gap-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.name")}</FormLabel>
                            <FormControl>
                              <EnhancedInput
                                {...field}
                                onValueChange={(value) => {
                                  form.setValue(field.name, value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("form.language")}
                              <span className="ml-1 text-[0.8rem] text-muted-foreground">
                                {t("form.languageDescription")}
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) =>
                                  form.setValue(
                                    field.name,
                                    value === "__default__" ? "" : value,
                                    { shouldDirty: true }
                                  )
                                }
                                value={field.value || "__default__"}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t("form.languagePlaceholder")}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__default__">
                                    {t(
                                      "form.languageDefault",
                                      "Default / no restriction"
                                    )}
                                  </SelectItem>
                                  <SelectItem value="en-US">en-US</SelectItem>
                                  <SelectItem value="zh-CN">zh-CN</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{categoryText.title}</FormLabel>
                            <FormControl>
                              <Combobox
                                onChange={(value) =>
                                  form.setValue(field.name, String(value || ""))
                                }
                                options={categoryOptions}
                                placeholder={categoryText.none}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="traffic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.traffic")}</FormLabel>
                            <FormControl>
                              <EnhancedInput
                                placeholder={t("form.noLimit")}
                                type="number"
                                {...field}
                                formatInput={(value) =>
                                  unitConversion("bytesToGb", value)
                                }
                                formatOutput={(value) =>
                                  unitConversion("gbToBytes", value)
                                }
                                onValueChange={(value) => {
                                  form.setValue(field.name, value);
                                }}
                                suffix="GB"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="speed_limit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.speedLimit")}</FormLabel>
                            <FormControl>
                              <EnhancedInput
                                placeholder={t("form.noLimit")}
                                type="number"
                                {...field}
                                formatInput={(value) =>
                                  unitConversion("bitsToMb", value)
                                }
                                formatOutput={(value) =>
                                  unitConversion("mbToBits", value)
                                }
                                onValueChange={(value) => {
                                  form.setValue(field.name, value);
                                }}
                                suffix="Mbps"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="device_limit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.deviceLimit")}</FormLabel>
                            <FormControl>
                              <EnhancedInput
                                placeholder={t("form.noLimit")}
                                step={1}
                                type="number"
                                {...field}
                                onValueChange={(value) => {
                                  form.setValue(field.name, value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="inventory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.inventory")}</FormLabel>
                            <FormControl>
                              <EnhancedInput
                                onValueChange={(value) => {
                                  form.setValue(field.name, value);
                                }}
                                placeholder={t("form.unlimitedInventory")}
                                step={1}
                                type="number"
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quota"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.quota")}</FormLabel>
                            <FormControl>
                              <EnhancedInput
                                placeholder={t("form.noLimit")}
                                step={1}
                                type="number"
                                {...field}
                                onValueChange={(value) => {
                                  form.setValue(field.name, value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent className="space-y-6" value="content">
                  <FormField
                    control={form.control}
                    name="legacy_description_input"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.legacyDescriptionJson", "Legacy JSON")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-28 font-mono text-xs"
                            onChange={(event) =>
                              applyLegacyDescriptionInput(event.target.value)
                            }
                            placeholder='{"description":"Fast and stable","features":[{"icon":"uil:shield-check","label":"Premium nodes","type":"success"}],"detail_format":"markdown","detail_content":"### Details"}'
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "form.legacyDescriptionJsonDescription",
                            "Paste the old description JSON here to import it into the fields below."
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.shortDescription", "Card Summary")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-20"
                            onChange={(event) =>
                              form.setValue(field.name, event.target.value)
                            }
                            placeholder={t(
                              "form.shortDescriptionPlaceholder",
                              "A short summary shown on package cards."
                            )}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.packageFeatures", "Package Features")}
                        </FormLabel>
                        <FormControl>
                          <FeatureEditor
                            onChange={(features) =>
                              form.setValue(field.name, features, {
                                shouldDirty: true,
                              })
                            }
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "form.packageFeaturesDescription",
                            "These rows render as the compact feature list on package cards."
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                    <FormField
                      control={form.control}
                      name="detail_format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("form.detailFormat", "Detail Format")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) =>
                                form.setValue(
                                  field.name,
                                  normalizeDetailFormat(value) as any
                                )
                              }
                              value={field.value || "markdown"}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="markdown">
                                  Markdown
                                </SelectItem>
                                <SelectItem value="text">
                                  {t("form.plainText", "Plain Text")}
                                </SelectItem>
                                <SelectItem value="html">HTML</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            {t(
                              "form.detailFormatDescription",
                              "Markdown is recommended. HTML is rendered with a safe allowlist on the user side."
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="detail_content"
                      render={({ field }) => {
                        const detailFormat = form.watch("detail_format");
                        return (
                          <FormItem>
                            <FormLabel>
                              {t("form.detailContent", "Detailed Description")}
                            </FormLabel>
                            <FormControl>
                              {detailFormat === "html" ? (
                                <HTMLEditor
                                  onChange={(value) =>
                                    form.setValue(field.name, value || "")
                                  }
                                  value={field.value || ""}
                                  wordWrap
                                />
                              ) : detailFormat === "text" ? (
                                <Textarea
                                  className="min-h-64"
                                  onChange={(event) =>
                                    form.setValue(
                                      field.name,
                                      event.target.value
                                    )
                                  }
                                  value={field.value || ""}
                                />
                              ) : (
                                <MarkdownEditor
                                  onChange={(value) =>
                                    form.setValue(field.name, value || "")
                                  }
                                  value={field.value || ""}
                                  wordWrap
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent className="space-y-4" value="pricing">
                  <div className="grid gap-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="replacement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.replacement")}</FormLabel>
                            <FormControl>
                              <EnhancedInput
                                type="number"
                                {...field}
                                formatInput={(value) =>
                                  unitConversion("centsToDollars", value)
                                }
                                formatOutput={(value) =>
                                  unitConversion("dollarsToCents", value)
                                }
                                min={0}
                                onValueChange={(value) => {
                                  form.setValue(field.name, value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reset_cycle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.resetCycle")}</FormLabel>
                            <FormControl>
                              <Combobox<number, false>
                                placeholder={t("form.selectResetCycle")}
                                {...field}
                                onChange={(value) => {
                                  if (typeof value === "number") {
                                    form.setValue(field.name, value);
                                  }
                                }}
                                options={[
                                  { label: t("form.noReset"), value: 0 },
                                  { label: t("form.resetOn1st"), value: 1 },
                                  { label: t("form.monthlyReset"), value: 2 },
                                  { label: t("form.annualReset"), value: 3 },
                                ]}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="price_options"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("form.priceOptions", "Price Options")}
                          </FormLabel>
                          <FormControl>
                            <PriceOptionsEditor
                              currencySymbol={currency.currency_symbol}
                              onChange={(newValues) => {
                                form.setValue(field.name, newValues, {
                                  shouldDirty: true,
                                });
                              }}
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "form.priceOptionsDescription",
                              "Create one product and add multiple sellable duration and price options."
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deduction_ratio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.deductionRatio")}</FormLabel>
                          <FormControl>
                            <EnhancedInput
                              type="number"
                              {...field}
                              max={100}
                              min={0}
                              onValueChange={(value) => {
                                form.setValue(field.name, value);
                              }}
                              placeholder="Auto"
                              suffix="%"
                            />
                          </FormControl>
                          <FormMessage />
                          <FormDescription>
                            {t("form.deductionRatioDescription")}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="renewal_reset"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>{t("form.renewalReset")}</FormLabel>
                              <FormDescription>
                                {t("form.renewalResetDescription")}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allow_deduction"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>
                                {t("form.purchaseWithDiscount")}
                              </FormLabel>
                              <FormDescription>
                                {t("form.purchaseWithDiscountDescription")}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={!!field.value}
                                onCheckedChange={(value) => {
                                  form.setValue(field.name, value);
                                }}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent className="space-y-4" value="servers">
                  <div className="space-y-6">
                    {/* Show node_tags field only when group feature is disabled */}
                    {!isGroupEnabled && (
                      <FormField
                        control={form.control}
                        name="node_tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.nodeGroup")}</FormLabel>
                            <FormControl>
                              <Accordion
                                className="w-full"
                                collapsible
                                type="single"
                              >
                                {tagGroups.map((tag) => {
                                  const value = field.value || [];
                                  const tagId = tag;
                                  const nodesWithTag = getNodesByTag(tag);

                                  return (
                                    <AccordionItem
                                      key={tag}
                                      value={String(tag)}
                                    >
                                      <AccordionTrigger>
                                        <div className="flex items-center gap-2">
                                          <Checkbox
                                            checked={value.includes(
                                              tagId as any
                                            )}
                                            onCheckedChange={(checked) =>
                                              checked
                                                ? form.setValue(field.name, [
                                                    ...value,
                                                    tagId,
                                                  ] as any)
                                                : form.setValue(
                                                    field.name,
                                                    value.filter(
                                                      (v: any) => v !== tagId
                                                    )
                                                  )
                                            }
                                          />
                                          <Label>
                                            {tag}
                                            <span className="ml-2 text-muted-foreground text-xs">
                                              ({nodesWithTag.length})
                                            </span>
                                          </Label>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <ul className="space-y-1">
                                          {getNodesByTag(tag).map((node) => (
                                            <li
                                              className="flex items-center justify-between gap-3"
                                              key={node.id}
                                            >
                                              <span className="flex-1">
                                                {node.name}
                                              </span>
                                              <span className="flex-1">
                                                {node.address}:{node.port}
                                              </span>
                                              <span className="flex-1 text-right">
                                                {node.protocol}
                                              </span>
                                            </li>
                                          ))}
                                        </ul>
                                      </AccordionContent>
                                    </AccordionItem>
                                  );
                                })}
                              </Accordion>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="nodes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.node")}</FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-2">
                              {/* When group feature is enabled, show nodes without groups */}
                              {/* When group feature is disabled, show nodes without tags */}
                              {(isGroupEnabled
                                ? getNodesWithoutGroups()
                                : getNodesWithoutTags()
                              ).map((item: API.Node) => {
                                const value = field.value || [];

                                return (
                                  <div
                                    className="flex items-center gap-2"
                                    key={item.id}
                                  >
                                    <Checkbox
                                      checked={value.includes(String(item.id))}
                                      onCheckedChange={(checked) =>
                                        checked
                                          ? form.setValue(field.name, [
                                              ...value,
                                              String(item.id),
                                            ])
                                          : form.setValue(
                                              field.name,
                                              value.filter(
                                                (value: string) =>
                                                  value !== String(item.id)
                                              )
                                            )
                                      }
                                    />
                                    <Label className="flex w-full items-center justify-between gap-3">
                                      <span className="flex-1">
                                        {item.name}
                                      </span>
                                      <span className="flex-1">
                                        {item.address}:{item.port}
                                      </span>
                                      <span className="flex-1 text-right">
                                        {item.protocol}
                                      </span>
                                    </Label>
                                  </div>
                                );
                              })}
                            </div>
                          </FormControl>
                          <FormDescription>
                            {isGroupEnabled
                              ? t(
                                  "form.nodesWithoutGroupsDescription",
                                  "Nodes without group assignment will be shown here (nodes that belong to groups are managed in the Node Groups section above)"
                                )
                              : t(
                                  "form.nodesDescription",
                                  "Select nodes for this subscription"
                                )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Show node_group_ids field only when group feature is enabled */}
                    {isGroupEnabled && (
                      <>
                        {/* When no default node group is set, show simple node group selection */}
                        {node_group_id ? (
                          <>
                            {/* Default Node Group Selection - shown when default is set */}
                            <FormField
                              control={form.control}
                              name="node_group_id"
                              render={({ field }) => {
                                // Find the selected node group
                                const selectedNodeGroup = nodeGroupsData?.find(
                                  (g) => String(g.id) === field.value
                                );
                                // Filter nodes that belong to this group
                                const nodesInGroup = selectedNodeGroup
                                  ? (nodes || []).filter((node) => {
                                      const nodeGroupIds =
                                        (node as any).node_group_ids || [];
                                      return nodeGroupIds.includes(
                                        selectedNodeGroup.id
                                      );
                                    })
                                  : [];

                                return (
                                  <FormItem>
                                    <FormLabel>
                                      {t(
                                        "form.defaultNodeGroup",
                                        "Default Node Group"
                                      )}
                                    </FormLabel>
                                    <Card className="p-4">
                                      <FormControl>
                                        <Combobox
                                          onChange={(value) => {
                                            form.setValue(
                                              field.name,
                                              value || ""
                                            );
                                          }}
                                          options={[
                                            {
                                              label: t(
                                                "form.noDefaultNodeGroup",
                                                "No Default Node Group"
                                              ),
                                              value: "",
                                            },
                                            ...(nodeGroupsData?.map((g) => ({
                                              label:
                                                formatNodeGroupOptionLabel(g),
                                              value: String(g.id),
                                            })) || []),
                                          ]}
                                          placeholder={t(
                                            "form.selectDefaultNodeGroup",
                                            "Select a default node group..."
                                          )}
                                          value={field.value}
                                        />
                                      </FormControl>
                                      <FormDescription className="mt-2">
                                        {t(
                                          "form.defaultNodeGroupDescription",
                                          "The default node group for this product."
                                        )}
                                      </FormDescription>
                                      {/* Show nodes in the selected default node group */}
                                      {nodesInGroup.length > 0 && (
                                        <>
                                          <div className="mt-3 mb-2 text-muted-foreground text-xs">
                                            {t(
                                              "form.nodesInGroup",
                                              "Nodes in this group:"
                                            )}
                                          </div>
                                          <div className="grid grid-cols-1 gap-2">
                                            {nodesInGroup.map((node) => (
                                              <div
                                                className="flex items-center justify-between rounded border bg-muted/30 p-2 text-sm"
                                                key={node.id}
                                              >
                                                <span className="flex-1 font-medium">
                                                  {node.name}
                                                </span>
                                                <span className="flex-1 text-muted-foreground">
                                                  {node.address}:{node.port}
                                                </span>
                                                <span className="flex-1 text-right text-muted-foreground">
                                                  {node.protocol}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </>
                                      )}
                                    </Card>
                                    <FormMessage />
                                  </FormItem>
                                );
                              }}
                            />

                            {/* Backup Node Groups Selection - filter out default node group */}
                            <FormField
                              control={form.control}
                              name="node_group_ids"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {t(
                                      "form.backupNodeGroups",
                                      "Backup Node Groups"
                                    )}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="space-y-4">
                                      {nodeGroupsData
                                        ?.filter(
                                          (g) => String(g.id) !== node_group_id
                                        )
                                        ?.map((g) => {
                                          // Filter nodes that belong to this group
                                          const nodesInGroup = (
                                            nodes || []
                                          ).filter((node) => {
                                            const nodeGroupIds =
                                              (node as any).node_group_ids ||
                                              [];
                                            return nodeGroupIds.includes(g.id);
                                          });

                                          return (
                                            <div
                                              className="rounded-lg border p-4"
                                              key={g.id}
                                            >
                                              <div className="mb-3 flex items-center space-x-2">
                                                <Checkbox
                                                  checked={field.value?.includes(
                                                    String(g.id)
                                                  )}
                                                  id={`subscribe-backup-node-group-${g.id}`}
                                                  onCheckedChange={(
                                                    checked
                                                  ) => {
                                                    const currentValue =
                                                      field.value || [];
                                                    if (checked) {
                                                      form.setValue(
                                                        field.name,
                                                        [
                                                          ...currentValue,
                                                          String(g.id),
                                                        ]
                                                      );
                                                    } else {
                                                      form.setValue(
                                                        field.name,
                                                        currentValue.filter(
                                                          (v: string) =>
                                                            v !== String(g.id)
                                                        )
                                                      );
                                                    }
                                                  }}
                                                />
                                                <Label
                                                  className="cursor-pointer font-medium"
                                                  htmlFor={`subscribe-backup-node-group-${g.id}`}
                                                >
                                                  <span>{g.name}</span>
                                                  {g.type === "subscribe" && (
                                                    <Badge
                                                      className="ml-2"
                                                      variant="secondary"
                                                    >
                                                      {t(
                                                        "form.nodeGroupSubscribeOnly"
                                                      )}
                                                    </Badge>
                                                  )}
                                                  {g.type === "app" && (
                                                    <Badge
                                                      className="ml-2"
                                                      variant="secondary"
                                                    >
                                                      {t(
                                                        "form.nodeGroupAppOnly"
                                                      )}
                                                    </Badge>
                                                  )}
                                                  <span className="ml-2 text-muted-foreground text-sm">
                                                    ({nodesInGroup.length}{" "}
                                                    {t("form.nodes", "nodes")})
                                                  </span>
                                                </Label>
                                              </div>

                                              {/* Show nodes in this group */}
                                              {nodesInGroup.length > 0 && (
                                                <div className="mt-3 ml-6">
                                                  <div className="mb-2 text-muted-foreground text-xs">
                                                    {t(
                                                      "form.nodesInGroup",
                                                      "Nodes in this group:"
                                                    )}
                                                  </div>
                                                  <div className="grid grid-cols-1 gap-2">
                                                    {nodesInGroup.map(
                                                      (node) => (
                                                        <div
                                                          className="flex items-center justify-between rounded border bg-muted/30 p-2 text-sm"
                                                          key={node.id}
                                                        >
                                                          <span className="flex-1 font-medium">
                                                            {node.name}
                                                          </span>
                                                          <span className="flex-1 text-muted-foreground">
                                                            {node.address}:
                                                            {node.port}
                                                          </span>
                                                          <span className="flex-1 text-right text-muted-foreground">
                                                            {node.protocol}
                                                          </span>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    {t(
                                      "form.backupNodeGroupsDescription",
                                      "Select additional backup node groups."
                                    )}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        ) : (
                          <FormField
                            control={form.control}
                            name="node_group_ids"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("form.nodeGroups", "Node Groups")}
                                </FormLabel>
                                <FormControl>
                                  <div className="space-y-4">
                                    {nodeGroupsData?.map((g) => {
                                      // Filter nodes that belong to this group
                                      const nodesInGroup = (nodes || []).filter(
                                        (node) => {
                                          const nodeGroupIds =
                                            (node as any).node_group_ids || [];
                                          return nodeGroupIds.includes(g.id);
                                        }
                                      );

                                      return (
                                        <div
                                          className="rounded-lg border p-4"
                                          key={g.id}
                                        >
                                          <div className="mb-3 flex items-center space-x-2">
                                            <Checkbox
                                              checked={field.value?.includes(
                                                String(g.id)
                                              )}
                                              id={`subscribe-node-group-${g.id}`}
                                              onCheckedChange={(checked) => {
                                                const currentValue =
                                                  field.value || [];
                                                const currentDefaultGroupId =
                                                  form.getValues(
                                                    "node_group_id"
                                                  );

                                                if (checked) {
                                                  const newValue = [
                                                    ...currentValue,
                                                    String(g.id),
                                                  ];
                                                  form.setValue(
                                                    field.name,
                                                    newValue
                                                  );

                                                  // If no default node group is set, set this one as default
                                                  if (!currentDefaultGroupId) {
                                                    form.setValue(
                                                      "node_group_id",
                                                      String(g.id)
                                                    );
                                                  }
                                                } else {
                                                  form.setValue(
                                                    field.name,
                                                    currentValue.filter(
                                                      (v: string) =>
                                                        v !== String(g.id)
                                                    )
                                                  );
                                                }
                                              }}
                                            />
                                            <Label
                                              className="cursor-pointer font-medium"
                                              htmlFor={`subscribe-node-group-${g.id}`}
                                            >
                                              <span>{g.name}</span>
                                              {g.type === "subscribe" && (
                                                <Badge
                                                  className="ml-2"
                                                  variant="secondary"
                                                >
                                                  {t(
                                                    "form.nodeGroupSubscribeOnly"
                                                  )}
                                                </Badge>
                                              )}
                                              {g.type === "app" && (
                                                <Badge
                                                  className="ml-2"
                                                  variant="secondary"
                                                >
                                                  {t("form.nodeGroupAppOnly")}
                                                </Badge>
                                              )}
                                              <span className="ml-2 text-muted-foreground text-sm">
                                                ({nodesInGroup.length}{" "}
                                                {t("form.nodes", "nodes")})
                                              </span>
                                            </Label>
                                          </div>

                                          {/* Show nodes in this group */}
                                          {nodesInGroup.length > 0 && (
                                            <div className="mt-3 ml-6">
                                              <div className="mb-2 text-muted-foreground text-xs">
                                                {t(
                                                  "form.nodesInGroup",
                                                  "Nodes in this group:"
                                                )}
                                              </div>
                                              <div className="grid grid-cols-1 gap-2">
                                                {nodesInGroup.map((node) => (
                                                  <div
                                                    className="flex items-center justify-between rounded border bg-muted/30 p-2 text-sm"
                                                    key={node.id}
                                                  >
                                                    <span className="flex-1 font-medium">
                                                      {node.name}
                                                    </span>
                                                    <span className="flex-1 text-muted-foreground">
                                                      {node.address}:{node.port}
                                                    </span>
                                                    <span className="flex-1 text-right text-muted-foreground">
                                                      {node.protocol}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  {t(
                                    "form.nodeGroupsFirstSelectionDescription",
                                    "Select node groups for this product. The first selected group will be set as the default node group."
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </>
                    )}
                  </div>
                </TabsContent>

                {/* Traffic Limit Tab */}
                <TabsContent className="space-y-4" value="traffic-limit">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="traffic_limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("form.trafficLimitRules", "Traffic Limit Rules")}
                          </FormLabel>
                          <FormControl>
                            <ArrayInput
                              fields={[
                                {
                                  name: "stat_type",
                                  type: "select",
                                  placeholder: t(
                                    "form.statType",
                                    "Statistics Type"
                                  ),
                                  value: "day",
                                  options: [
                                    {
                                      label: t("form.statTypeHour", "Hour"),
                                      value: "hour",
                                    },
                                    {
                                      label: t("form.statTypeDay", "Day"),
                                      value: "day",
                                    },
                                  ],
                                },
                                {
                                  name: "stat_value",
                                  type: "number",
                                  placeholder: t(
                                    "form.statValue",
                                    "Time Value"
                                  ),
                                  min: 1,
                                  onKeyDown: (
                                    e: React.KeyboardEvent<HTMLInputElement>
                                  ) => {
                                    if (e.key === "." || e.key === ",") {
                                      e.preventDefault();
                                    }
                                  },
                                  formatOutput: (value: string | number) => {
                                    const num = Number(value);
                                    return Number.isNaN(num)
                                      ? 0
                                      : Math.floor(num);
                                  },
                                },
                                {
                                  name: "traffic_usage",
                                  type: "number",
                                  placeholder: t(
                                    "form.trafficUsage",
                                    "Traffic Usage (GB)"
                                  ),
                                  min: 0,
                                  onKeyDown: (
                                    e: React.KeyboardEvent<HTMLInputElement>
                                  ) => {
                                    if (e.key === "." || e.key === ",") {
                                      e.preventDefault();
                                    }
                                  },
                                  formatOutput: (value: string | number) => {
                                    const num = Number(value);
                                    return Number.isNaN(num)
                                      ? 0
                                      : Math.floor(num);
                                  },
                                },
                                {
                                  name: "speed_limit",
                                  type: "number",
                                  placeholder: t(
                                    "form.speedLimitKb",
                                    "Speed Limit (kb)"
                                  ),
                                  min: 0,
                                  onKeyDown: (
                                    e: React.KeyboardEvent<HTMLInputElement>
                                  ) => {
                                    if (e.key === "." || e.key === ",") {
                                      e.preventDefault();
                                    }
                                  },
                                  formatOutput: (value: string | number) => {
                                    const num = Number(value);
                                    return Number.isNaN(num)
                                      ? 0
                                      : Math.floor(num);
                                  },
                                },
                              ]}
                              onChange={field.onChange}
                              value={
                                field.value && field.value.length > 0
                                  ? field.value
                                  : [
                                      {
                                        stat_type: "day",
                                        stat_value: 1,
                                        traffic_usage: 0,
                                        speed_limit: 0,
                                      },
                                    ]
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "form.trafficLimitDescription",
                              "Configure traffic-based speed limit rules. When traffic usage reaches the specified amount, the speed will be limited."
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            disabled={loading}
            onClick={() => {
              setOpen(false);
            }}
            variant="outline"
          >
            {t("form.cancel")}
          </Button>
          <Button
            disabled={loading}
            onClick={form.handleSubmit(handleSubmit, (errors) => {
              const keys = Object.keys(errors);
              for (const key of keys) {
                const formattedKey = key.replace(/_([a-z])/g, (_, letter) =>
                  letter.toUpperCase()
                );
                const error = (errors as Record<string, unknown>)[key];
                const errorMessage =
                  getFirstValidationMessage(error) || "Validation failed";
                toast.error(`${t(`form.${formattedKey}`)}: ${errorMessage}`);
                return false;
              }
            })}
          >
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}
            {t("form.confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

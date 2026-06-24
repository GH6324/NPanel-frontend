"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
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
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNode } from "@/stores/node";
import {
  type FieldConfig,
  formSchema,
  getLabel,
  getProtocolDefaultConfig,
  protocols as PROTOCOLS,
  useProtocolFields,
} from "./form-schema";

function DynamicField({
  field,
  control,
  form,
  protocolIndex,
  protocolData,
}: {
  field: FieldConfig;
  control: any;
  form: any;
  protocolIndex: number;
  protocolData: any;
}) {
  const fieldName = `protocols.${protocolIndex}.${field.name}` as const;

  if (field.condition && !field.condition(protocolData, {})) {
    return null;
  }

  const commonProps = {
    control,
    name: fieldName,
  };

  switch (field.type) {
    case "input":
      return (
        <FormField
          {...commonProps}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <EnhancedInput
                  {...fieldProps}
                  onValueChange={(v) => fieldProps.onChange(v)}
                  placeholder={field.placeholder}
                  value={
                    Array.isArray(fieldProps.value)
                      ? fieldProps.value.join(", ")
                      : (fieldProps.value ?? "")
                  }
                  suffix={
                    field.generate ? (
                      field.generate.functions &&
                      field.generate.functions.length > 0 ? (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" type="button" variant="ghost">
                              <Icon className="h-4 w-4" icon="mdi:key" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {field.generate.functions.map((genFunc, idx) => (
                              <DropdownMenuItem
                                key={idx}
                                onClick={async () => {
                                  const result = await genFunc.function();
                                  if (typeof result === "string") {
                                    fieldProps.onChange(result);
                                  } else if (field.generate!.updateFields) {
                                    Object.entries(
                                      field.generate!.updateFields
                                    ).forEach(([fieldName, resultKey]) => {
                                      const fullFieldName = `protocols.${protocolIndex}.${fieldName}`;
                                      form.setValue(
                                        fullFieldName,
                                        (result as any)[resultKey]
                                      );
                                    });
                                  } else if (result.privateKey) {
                                    fieldProps.onChange(result.privateKey);
                                  }
                                }}
                              >
                                {genFunc.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : field.generate.function ? (
                        <Button
                          onClick={async () => {
                            const result = await field.generate!.function!();
                            if (typeof result === "string") {
                              fieldProps.onChange(result);
                            } else if (field.generate!.updateFields) {
                              Object.entries(
                                field.generate!.updateFields
                              ).forEach(([fieldName, resultKey]) => {
                                const fullFieldName = `protocols.${protocolIndex}.${fieldName}`;
                                form.setValue(
                                  fullFieldName,
                                  (result as any)[resultKey]
                                );
                              });
                            } else if (result.privateKey) {
                              fieldProps.onChange(result.privateKey);
                            }
                          }}
                          size="sm"
                          type="button"
                          variant="ghost"
                        >
                          <Icon className="h-4 w-4" icon="mdi:key" />
                        </Button>
                      ) : null
                    ) : (
                      field.suffix
                    )
                  }
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "number":
      return (
        <FormField
          {...commonProps}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <EnhancedInput
                  {...fieldProps}
                  max={field.max}
                  min={field.min}
                  onValueChange={(v) => fieldProps.onChange(v)}
                  placeholder={field.placeholder}
                  step={field.step || 1}
                  suffix={field.suffix}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "select":
      if (!field.options || field.options.length <= 1) {
        return null;
      }

      return (
        <FormField
          {...commonProps}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(v) => fieldProps.onChange(v)}
                  value={fieldProps.value ?? field.defaultValue}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {getLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "switch":
      return (
        <FormField
          {...commonProps}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <div className="pt-2">
                  <Switch
                    checked={!!fieldProps.value}
                    onCheckedChange={(checked) => fieldProps.onChange(checked)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "textarea":
      return (
        <FormField
          {...commonProps}
          render={({ field: fieldProps }) => (
            <FormItem className="col-span-2">
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <textarea
                  {...fieldProps}
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => fieldProps.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  value={fieldProps.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return null;
  }
}

function renderFieldsByGroup(
  fields: FieldConfig[],
  group: string,
  control: any,
  form: any,
  protocolIndex: number,
  protocolData: any
) {
  const groupFields = fields.filter((field) => field.group === group);
  if (groupFields.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {groupFields.map((field) => (
        <DynamicField
          control={control}
          field={field}
          form={form}
          key={field.name}
          protocolData={protocolData}
          protocolIndex={protocolIndex}
        />
      ))}
    </div>
  );
}

function renderGroupCard(
  title: string,
  fields: FieldConfig[],
  group: string,
  control: any,
  form: any,
  protocolIndex: number,
  protocolData: any
) {
  const groupFields = fields.filter((field) => field.group === group);
  if (groupFields.length === 0) return null;

  const visibleFields = groupFields.filter(
    (field) => !field.condition || field.condition(protocolData, {})
  );

  if (visibleFields.length === 0) return null;

  return (
    <div className="relative">
      <fieldset className="rounded-lg border border-border">
        <legend className="ml-3 bg-background px-1 py-1 font-medium text-foreground text-sm">
          {title}
        </legend>
        <div className="p-4 pt-2">
          {renderFieldsByGroup(
            fields,
            group,
            control,
            form,
            protocolIndex,
            protocolData
          )}
        </div>
      </fieldset>
    </div>
  );
}

function isLikelyDomainAddress(address?: string) {
  const value = (address || "").trim();
  return (
    !!value &&
    value.includes(".") &&
    /[a-z]/i.test(value) &&
    !value.includes(":")
  );
}

function normalizeProtocolForSubmit(protocol: any, serverAddress?: string) {
  if (!protocol) return protocol;
  const nextProtocol = { ...protocol };
  if (nextProtocol.type === "mx") {
    if (!Number(nextProtocol.port)) nextProtocol.port = 443;
    if (!nextProtocol.transport) nextProtocol.transport = "tcp";
    if (!nextProtocol.security) nextProtocol.security = "tls";
    if (nextProtocol.transport === "mc1") {
      if (!nextProtocol.path) nextProtocol.path = "/mc1";
      if (!nextProtocol.host && serverAddress) {
        nextProtocol.host = serverAddress;
      }
      if (!nextProtocol.mc1_mode) nextProtocol.mc1_mode = "auto";
      if (typeof nextProtocol.mc1_cidr_segments === "string") {
        nextProtocol.mc1_cidr_segments = nextProtocol.mc1_cidr_segments
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean);
      }
    } else {
      nextProtocol.mc1_mode = null;
      nextProtocol.mc1_cidr_segments = [];
    }
    if (
      ["mundordp", "mundosql"].includes(nextProtocol.transport) &&
      !nextProtocol.mundo_username
    ) {
      nextProtocol.mundo_username = "MundoUser";
    }
    return nextProtocol;
  }
  if (nextProtocol.type === "omniflow") {
    const next = nextProtocol;
    if (!Number(next.port)) next.port = 443;
    if (!next.omniflow_carrier) next.omniflow_carrier = "h2";
    if (!next.omniflow_af_path_mode) next.omniflow_af_path_mode = "random";
    if (
      !(
        next.omniflow_path ||
        (next.omniflow_af_enabled && next.omniflow_af_path_mode === "random")
      )
    ) {
      next.omniflow_path = "/omniflow";
    }
    if (next.omniflow_fallback_enabled && next.omniflow_fallback_target_host) {
      next.omniflow_fallback_target_host = String(
        next.omniflow_fallback_target_host
      ).trim();
      next.omniflow_fallback_target_scheme =
        next.omniflow_fallback_target_scheme === "http" ? "http" : "https";
    } else {
      next.omniflow_fallback_enabled = false;
      next.omniflow_fallback_target_scheme = null;
      next.omniflow_fallback_target_host = null;
      next.omniflow_fallback_target_port = null;
      next.omniflow_fallback_host_header = null;
      next.omniflow_fallback_tls_sni = null;
    }
    return next;
  }
  if (nextProtocol.type !== "simnet") return nextProtocol;
  const next = nextProtocol;
  const defaultPositiveNumber = (key: string, value: number) => {
    if (!Number(next[key])) next[key] = value;
  };
  if (!Number(next.port)) next.port = 443;
  if (!next.simnet_carrier || next.simnet_carrier === "grpc")
    next.simnet_carrier = "h2";
  if (!next.simnet_af_path_mode) next.simnet_af_path_mode = "api";
  if (
    !(
      next.simnet_path ||
      (next.simnet_af_enabled && next.simnet_af_path_mode === "random")
    )
  ) {
    next.simnet_path = "/simnet/session";
  }
  if (next.simnet_fallback_enabled && next.simnet_fallback_target_host) {
    next.simnet_fallback_target_host = String(
      next.simnet_fallback_target_host
    ).trim();
    next.simnet_fallback_target_scheme =
      next.simnet_fallback_target_scheme === "http" ? "http" : "https";
  } else {
    next.simnet_fallback_enabled = false;
    next.simnet_fallback_target_scheme = null;
    next.simnet_fallback_target_host = null;
    next.simnet_fallback_target_port = null;
    next.simnet_fallback_host_header = null;
    next.simnet_fallback_tls_sni = null;
  }
  defaultPositiveNumber("simnet_inbound_max_streams_per_session", 128);
  defaultPositiveNumber("simnet_inbound_max_udp_streams_per_session", 64);
  defaultPositiveNumber("simnet_inbound_max_handler_tasks_per_session", 128);
  defaultPositiveNumber("simnet_stream_event_channel_capacity", 256);
  defaultPositiveNumber("simnet_stream_data_channel_capacity", 128);
  defaultPositiveNumber("simnet_target_dial_timeout_ms", 12_000);
  defaultPositiveNumber("simnet_target_max_concurrent_dials", 256);
  defaultPositiveNumber("simnet_send_window", 4_194_304);
  defaultPositiveNumber("simnet_recv_window", 4_194_304);
  defaultPositiveNumber("simnet_max_concurrent_streams", 100);
  defaultPositiveNumber("simnet_initial_window_size", 65_535);
  defaultPositiveNumber("simnet_max_frame_size", 16_384);
  defaultPositiveNumber("simnet_client_max_concurrent_streams", 32);
  defaultPositiveNumber("simnet_client_max_streams_per_session", 512);
  defaultPositiveNumber("simnet_client_session_idle_timeout_secs", 90);
  defaultPositiveNumber("simnet_client_max_udp_sessions", 64);
  next.simnet_egress_block_loopback = !!next.simnet_egress_block_loopback;
  next.simnet_egress_block_private = !!next.simnet_egress_block_private;
  next.simnet_egress_block_link_local = !!next.simnet_egress_block_link_local;
  next.simnet_egress_block_metadata = !!next.simnet_egress_block_metadata;
  if (
    (next.cert_mode === "http" || next.cert_mode === "dns") &&
    !next.sni &&
    isLikelyDomainAddress(serverAddress)
  ) {
    next.sni = serverAddress?.trim();
  }
  if (
    (next.cert_mode === "http" || next.cert_mode === "dns") &&
    (!next.security || next.security === "none")
  ) {
    next.security = "tls";
  }
  return next;
}

export default function ServerForm(props: {
  trigger: string;
  title: string;
  loading?: boolean;
  initialValues?: Partial<API.Server>;
  onSubmit: (values: Partial<API.Server>) => Promise<boolean> | boolean;
}) {
  const { trigger, title, loading, initialValues, onSubmit } = props;
  const { t } = useTranslation("servers");
  const [open, setOpen] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string>();

  const { isProtocolUsedInNodes } = useNode();
  const PROTOCOL_FIELDS = useProtocolFields();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      country: "",
      city: "",
      protocols: [] as any[],
      ...initialValues,
    },
  });
  const { control } = form;

  const protocolsValues = useWatch({ control, name: "protocols" });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: "",
        address: "",
        country: "",
        city: "",
        ...initialValues,
        protocols: PROTOCOLS.map((type) => {
          const existingProtocol = initialValues.protocols?.find(
            (p) => p.type === type
          );
          const defaultConfig = getProtocolDefaultConfig(type);
          return existingProtocol
            ? { ...defaultConfig, ...existingProtocol }
            : defaultConfig;
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  async function handleSubmit(values: Record<string, any>) {
    const normalizedProtocols = (values?.protocols || []).map((protocol: any) =>
      normalizeProtocolForSubmit(protocol, values.address)
    );
    const filteredProtocols = normalizedProtocols.filter((protocol: any) => {
      const port = Number(protocol?.port);
      return protocol && Number.isFinite(port) && port > 0 && port <= 65_535;
    });

    const result = {
      name: values.name,
      country: values.country,
      city: values.city,
      address: values.address,
      protocols: filteredProtocols,
    };

    const ok = await onSubmit(result);
    if (ok) {
      form.reset();
      setOpen(false);
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            if (!initialValues) {
              const full = PROTOCOLS.map((t) => getProtocolDefaultConfig(t));
              form.reset({
                name: "",
                address: "",
                country: "",
                city: "",
                protocols: full,
              });
            }
            setOpen(true);
          }}
        >
          {trigger}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[700px] max-w-full gap-0 md:max-w-3xl">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-env(safe-area-inset-top))]">
          <Form {...form}>
            <form className="grid grid-cols-1 gap-2 px-6 pt-4">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name", "Name")}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(v) => field.onChange(v)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("address", "Address")}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(v) => field.onChange(v)}
                          placeholder={t(
                            "address_placeholder",
                            "Server address"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("country", "Country")}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(v) => field.onChange(v)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("city", "City")}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(v) => field.onChange(v)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-3">
                <h3 className="font-semibold text-foreground text-sm">
                  {t("protocol_configurations", "Protocol Configurations")}
                </h3>
                <p className="mt-1 text-muted-foreground text-xs">
                  {t(
                    "protocol_configurations_desc",
                    "Enable and configure the required protocol types"
                  )}
                </p>
              </div>

              <Accordion
                className="w-full space-y-3"
                collapsible
                onValueChange={setAccordionValue}
                type="single"
                value={accordionValue}
              >
                {PROTOCOLS.map((type) => {
                  const i = Math.max(0, PROTOCOLS.indexOf(type));
                  const current = (protocolsValues[i] || {}) as Record<
                    string,
                    any
                  >;
                  const isEnabled = current?.enable;
                  const fields = PROTOCOL_FIELDS[type] || [];
                  return (
                    <AccordionItem
                      className="mb-2 rounded-lg border"
                      key={type}
                      value={type}
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-1">
                              <span className="font-medium capitalize">
                                {getLabel(type)}
                              </span>
                              {current.transport && (
                                <Badge className="text-xs" variant="secondary">
                                  {current.transport.toUpperCase()}
                                </Badge>
                              )}
                              {current.security &&
                                current.security !== "none" && (
                                  <Badge className="text-xs" variant="outline">
                                    {current.security.toUpperCase()}
                                  </Badge>
                                )}
                              {current.port && (
                                <Badge className="text-xs">
                                  {current.port}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={cn(
                                  "text-xs",
                                  isEnabled
                                    ? "text-green-500"
                                    : "text-muted-foreground"
                                )}
                              >
                                {isEnabled
                                  ? t("enabled", "Enabled")
                                  : t("disabled", "Disabled")}
                              </span>
                            </div>
                          </div>
                          <Switch
                            checked={!!isEnabled}
                            className="mr-2"
                            disabled={Boolean(
                              initialValues?.id &&
                                isProtocolUsedInNodes(
                                  initialValues?.id || 0,
                                  type
                                ) &&
                                isEnabled
                            )}
                            onCheckedChange={(checked) => {
                              form.setValue(`protocols.${i}.enable`, checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-0 pb-4">
                        <div className="-mx-4 space-y-4 rounded-b-lg border-t px-4 pt-4">
                          {renderGroupCard(
                            t("basic", "Basic Configuration"),
                            fields,
                            "basic",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("obfs", "Obfuscation"),
                            fields,
                            "obfs",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("transport", "Transport"),
                            fields,
                            "transport",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("security", "Security"),
                            fields,
                            "security",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("reality", "Reality"),
                            fields,
                            "reality",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("encryption", "Encryption"),
                            fields,
                            "encryption",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("omniflow", "OmniFlow"),
                            fields,
                            "omniflow",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("simnet", "SimNet"),
                            fields,
                            "simnet",
                            control,
                            form,
                            i,
                            current
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            {t("cancel", "Cancel")}
          </Button>
          <Button
            disabled={loading}
            onClick={form.handleSubmit(handleSubmit, (errors) => {
              const key = Object.keys(errors)[0] as keyof typeof errors;
              if (key) toast.error(String(errors[key]?.message));
              return false;
            })}
          >
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}
            {t("confirm", "Confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import Empty from "@workspace/ui/composed/empty";
import { Icon } from "@workspace/ui/composed/icon";
import { cn } from "@workspace/ui/lib/utils";
import { querySubscribeCatalog } from "@workspace/ui/services/user/subscribe";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import { buildSubscribeSections } from "./catalog";
import { SubscribeDetail } from "./detail";
import {
  getDefaultPriceOption,
  getOptionDurationUnit,
  getOptionDurationValue,
  getOptionPrice,
} from "./price-options";

function toNumber(value?: number | string | null) {
  const parsed = typeof value === "string" ? Number(value) : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

import Purchase from "./purchase";

export default function Subscribe() {
  const { t, i18n } = useTranslation("subscribe");
  const unitTimeMap: Record<string, string> = {
    Day: t("Day", "Day"),
    Hour: t("Hour", "Hour"),
    Minute: t("Minute", "Minute"),
    Month: t("Month", "Month"),
    NoLimit: t("NoLimit", "No Limit"),
    Week: t("Week", "Week"),
    Year: t("Year", "Year"),
  };
  const locale = i18n.language;
  const [subscribe, setSubscribe] = useState<API.Subscribe>();

  const { data } = useQuery({
    queryKey: ["querySubscribeCatalog", locale],
    queryFn: async () => {
      const { data } = await querySubscribeCatalog({ language: locale });
      return data || null;
    },
  });

  const sections = buildSubscribeSections(
    data,
    t("uncategorized", "Uncategorized")
  );

  return (
    <>
      <div className="space-y-4">
        {sections.map((section) => (
          <section className="space-y-3" key={section.id}>
            <h2 className="font-semibold text-xl">{section.name}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {section.subscriptions.map((item) => (
                <Card className="relative flex flex-col" key={item.id}>
                  <CardHeader className="font-medium text-xl">
                    {item.name}
                  </CardHeader>
                  <CardContent className="*:!text-sm flex flex-grow flex-col gap-3">
                    <ul className="flex flex-grow flex-col gap-3">
                      {(() => {
                        let parsedDescription: {
                          description: string;
                          features: Array<{
                            icon: string;
                            label: string;
                            type: "default" | "success" | "destructive";
                          }>;
                        };
                        try {
                          parsedDescription = JSON.parse(item.description);
                        } catch {
                          parsedDescription = { description: "", features: [] };
                        }

                        const { description, features } = parsedDescription;
                        return (
                          <>
                            {description && (
                              <li className="text-muted-foreground">
                                {description}
                              </li>
                            )}
                            {features?.map(
                              (
                                feature: {
                                  icon: string;
                                  label: string;
                                  type: "default" | "success" | "destructive";
                                },
                                index: number
                              ) => (
                                <li
                                  className={cn("flex items-center gap-1", {
                                    "text-muted-foreground line-through":
                                      feature.type === "destructive",
                                  })}
                                  key={index}
                                >
                                  {feature.icon && (
                                    <Icon
                                      className={cn("size-5 text-primary", {
                                        "text-green-500":
                                          feature.type === "success",
                                        "text-destructive":
                                          feature.type === "destructive",
                                      })}
                                      icon={feature.icon}
                                    />
                                  )}
                                  {feature.label}
                                </li>
                              )
                            )}
                          </>
                        );
                      })()}
                    </ul>
                    <SubscribeDetail
                      subscribe={{
                        ...item,
                        name: undefined,
                      }}
                    />
                  </CardContent>
                  <Separator />
                  <CardFooter className="flex flex-col gap-2">
                    {(() => {
                      const hasDiscount =
                        item.discount && item.discount.length > 0;
                      const shouldShowOriginal =
                        item.show_original_price !== false;
                      const defaultOption = getDefaultPriceOption(item);

                      const displayPrice =
                        defaultOption
                          ? getOptionPrice(defaultOption)
                          : shouldShowOriginal || !hasDiscount
                            ? item.unit_price
                            : Math.round(
                                toNumber(item.unit_price) *
                                  toNumber(item.discount?.[0]?.quantity ?? 1) *
                                  (toNumber(
                                    item.discount?.[0]?.discount ?? 100
                                  ) /
                                    100)
                              );

                      const displayQuantity =
                        defaultOption
                          ? getOptionDurationValue(defaultOption)
                          : shouldShowOriginal || !hasDiscount
                            ? 1
                            : toNumber(item.discount?.[0]?.quantity ?? 1);

                      const unitTime =
                        defaultOption
                          ? unitTimeMap[getOptionDurationUnit(defaultOption)] ||
                            t(
                              getOptionDurationUnit(defaultOption),
                              getOptionDurationUnit(defaultOption)
                            )
                          : unitTimeMap[item.unit_time!] ||
                            t(
                              item.unit_time || "Month",
                              item.unit_time || "Month"
                            );

                      return (
                        <h2 className="pb-8 font-semibold text-2xl sm:text-3xl">
                          <Display type="currency" value={displayPrice} />
                          <span className="font-medium text-base">
                            {displayQuantity === 1
                              ? `/${unitTime}`
                              : `/${displayQuantity} ${unitTime}`}
                          </span>
                        </h2>
                      );
                    })()}
                    <Button
                      className="absolute bottom-0 w-full rounded-t-none rounded-b-xl"
                      onClick={() => {
                        setSubscribe(item);
                      }}
                    >
                      {t("buy", "Buy")}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        ))}
        {sections.length === 0 && <Empty />}
      </div>
      <Purchase setSubscribe={setSubscribe} subscribe={subscribe} />
    </>
  );
}

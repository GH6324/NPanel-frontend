import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import type { SubscribeCategorySection } from "@/sections/subscribe/catalog";
import { SubscribeFeatureList } from "@/sections/subscribe/description";
import { SubscribeDetail } from "@/sections/subscribe/detail";
import {
  getDefaultPriceOption,
  getOptionDurationUnit,
  getOptionDurationValue,
  getOptionPrice,
} from "@/sections/subscribe/price-options";

function toNumber(value?: number | string | null) {
  const parsed = typeof value === "string" ? Number(value) : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

import { useGlobalStore } from "@/stores/global";

interface ProductShowcaseProps {
  sections: SubscribeCategorySection[];
}

export function Content({ sections }: ProductShowcaseProps) {
  const { t } = useTranslation("main");
  const { user } = useGlobalStore();

  const unitTimeMap: Record<string, string> = {
    Day: t("Day", "Day"),
    Hour: t("Hour", "Hour"),
    Minute: t("Minute", "Minute"),
    Month: t("Month", "Month"),
    NoLimit: t("NoLimit", "No Limit"),
    Week: t("Week", "Week"),
    Year: t("Year", "Year"),
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
    >
      <motion.h2
        className="mb-2 text-center font-bold text-3xl"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {t("product_showcase_title", "Choose Your Package")}
      </motion.h2>
      <motion.p
        className="mb-8 text-center text-lg text-muted-foreground"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {t(
          "product_showcase_description",
          "Let us help you select the package that best suits you and enjoy exploring it."
        )}
      </motion.p>
      <div className="space-y-10">
        {sections.map((section) => (
          <div className="space-y-4" key={section.id}>
            <h3 className="text-center font-semibold text-2xl">
              {section.name}
            </h3>
            <div className="mx-auto flex flex-wrap justify-center gap-8 overflow-x-auto overflow-y-hidden *:max-w-80 *:flex-auto">
              {section.subscriptions.map((item, index) => (
                <motion.div
                  className="w-1/2 lg:w-1/4"
                  initial={{ opacity: 0, y: 50 }}
                  key={item.id}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <Card className="flex flex-col gap-0 overflow-hidden rounded-lg py-0 shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                    <CardHeader className="bg-muted/50 p-4 font-medium text-xl">
                      {item.name}
                    </CardHeader>
                    <CardContent className="flex flex-grow flex-col gap-4 p-6 text-sm">
                      <SubscribeFeatureList
                        className="gap-3"
                        subscribe={item}
                      />
                      <SubscribeDetail
                        subscribe={{
                          ...item,
                          name: undefined,
                        }}
                      />
                    </CardContent>
                    <Separator />
                    <CardFooter className="relative flex flex-col gap-4 p-4">
                      {(() => {
                        const hasDiscount =
                          item.discount && item.discount.length > 0;
                        const shouldShowOriginal =
                          item.show_original_price !== false;
                        const defaultOption = getDefaultPriceOption(item);

                        const displayPrice = defaultOption
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

                        const displayQuantity = defaultOption
                          ? getOptionDurationValue(defaultOption)
                          : shouldShowOriginal || !hasDiscount
                            ? 1
                            : toNumber(item.discount?.[0]?.quantity ?? 1);

                        const unitTime = defaultOption
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
                          <motion.h2
                            animate={{ opacity: 1 }}
                            className="pb-4 font-semibold text-2xl sm:text-3xl"
                            initial={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <Display type="currency" value={displayPrice} />
                            <span className="font-medium text-base">
                              {displayQuantity === 1
                                ? `/${unitTime}`
                                : `/${displayQuantity} ${unitTime}`}
                            </span>
                          </motion.h2>
                        );
                      })()}
                      <motion.div>
                        <Button
                          asChild
                          className="absolute bottom-0 left-0 w-full rounded-t-none rounded-b-xl"
                        >
                          <Link
                            search={user ? undefined : { id: item.id }}
                            to={user ? "/subscribe" : "/purchasing"}
                          >
                            {t("subscribe", "Subscribe")}
                          </Link>
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

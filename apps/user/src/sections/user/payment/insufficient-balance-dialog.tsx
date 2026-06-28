"use client";

import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";

export interface InsufficientBalanceInfo {
  available?: number;
  message?: string;
  required?: number;
}

function getErrorData(error: unknown): {
  code?: number;
  message?: string;
  msg?: string;
  reason?: string;
} {
  const record = error as {
    data?: unknown;
    response?: { data?: unknown };
  };
  const data = record.response?.data ?? record.data;
  return typeof data === "object" && data !== null
    ? (data as {
        code?: number;
        message?: string;
        msg?: string;
        reason?: string;
      })
    : {};
}

function parseAmountPair(message: string) {
  const match = message.match(
    /(?:需要|required)\s*[:：]?\s*(\d+(?:\.\d+)?).*?(?:可用|available)\s*[:：]?\s*(\d+(?:\.\d+)?)/i
  );
  if (!match) return {};
  return {
    required: Number(match[1]),
    available: Number(match[2]),
  };
}

export function getCheckoutErrorMessage(error: unknown) {
  const data = getErrorData(error);
  return data.message ?? data.msg;
}

export function isCheckoutOrderStatusError(error: unknown) {
  const data = getErrorData(error);
  return (
    data.reason === "ORDER_STATUS_ERROR" ||
    /订单状态错误|order status error/i.test(
      `${data.message ?? ""} ${data.msg ?? ""}`
    )
  );
}

export function parseInsufficientBalanceError(
  error: unknown
): InsufficientBalanceInfo | null {
  const data = getErrorData(error);
  const message = data.message ?? data.msg ?? "";
  const reason = data.reason ?? "";
  const isInsufficientBalance =
    data.code === 20_005 ||
    /余额不足|insufficient balance|INSUFFICIENT_BALANCE/i.test(
      `${message} ${reason}`
    );

  if (!isInsufficientBalance) return null;

  return {
    ...parseAmountPair(message),
    message,
  };
}

export function InsufficientBalanceDialog({
  balance,
  info,
  onOpenChange,
  open,
}: Readonly<{
  balance?: number;
  info: InsufficientBalanceInfo | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}>) {
  const { t } = useTranslation("order");
  const availableBalance = info?.available ?? balance ?? 0;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("insufficientBalance.title", "Insufficient Balance")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "insufficientBalance.description",
              "Your balance is not enough to complete this payment. Please recharge and try again."
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 rounded-md border bg-muted/40 p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              {t("insufficientBalance.available", "Available Balance")}
            </span>
            <strong className="text-base">
              <Display type="currency" value={availableBalance} />
            </strong>
          </div>
          {typeof info?.required === "number" && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">
                {t("insufficientBalance.required", "Required Amount")}
              </span>
              <strong className="text-base">
                <Display type="currency" value={info.required} />
              </strong>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            {t("insufficientBalance.close", "Close")}
          </Button>
          <Button asChild>
            <Link
              onClick={() => onOpenChange(false)}
              search={{ recharge: "1" }}
              to="/wallet"
            >
              {t("insufficientBalance.recharge", "Go to Recharge")}
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

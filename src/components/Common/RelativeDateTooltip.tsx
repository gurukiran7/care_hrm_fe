import { format, isValid } from "date-fns";
import { useTranslation } from "react-i18next";
import dayjs from "../../Utils/dayjs";
import { TooltipComponent } from "../../components/ui/tooltip";

type RelativeDateTooltipProps = {
  date: Date | string;
  className?: string;
};

type DateLike = Parameters<typeof dayjs>[0];

export const relativeDate = (date: DateLike, withoutSuffix = false) => {
  const obj = dayjs(date);
  const isToday = obj.isSame(dayjs(), "day");

  const relative = obj.fromNow(withoutSuffix);

  const hasTime = !!(obj.hour() || obj.minute() || obj.second());
  const { t } = useTranslation();

  if (isToday && !hasTime) {
    return t("today");
  }

  return `${relative}`;
};

export default function RelativeDateTooltip({
  date,
  className,
}: RelativeDateTooltipProps) {
  const { t } = useTranslation();
  if (!date) return null;

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!isValid(dateObj)) {
    return (
      <TooltipComponent content={t("invalid_date")}>
        <span className={className}>{t("invalid_date")}</span>
      </TooltipComponent>
    );
  }

  const hasTime = !!(
    dateObj.getHours() ||
    dateObj.getMinutes() ||
    dateObj.getSeconds()
  );

  return (
    <TooltipComponent
      content={hasTime ? format(dateObj, "PPp zzz") : format(dateObj, "PP")}
    >
      <time dateTime={dateObj.toISOString()} className={className}>
        {relativeDate(dateObj)}
      </time>
    </TooltipComponent>
  );
}

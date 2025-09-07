import { Badge } from "../../../components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  status: "approved" | "rejected" | "cancellation_requested" | "pending";
}

export function RequestStatusBadge({ status }: Props) {
  const { t } = useTranslation();

  const classes =
    "font-medium flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap [&>svg]:w-3 [&>svg]:h-3";

  if (status === "approved") {
    return (
      <Badge variant="green" className={classes}>
        <CheckCircle2 className="w-3 h-3"/> {t("leave_request__approved", { defaultValue: "Approved" })}
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge variant="danger" className={classes}>
        <XCircle className="w-3 h-3"/> {t("leave_request__rejected", { defaultValue: "Rejected" })}
      </Badge>
    );
  }
  if (status === "cancellation_requested") {
    return (
      <Badge variant="yellow" className={classes}>
        <Clock className="w-3 h-3"/> {t("leave_request__cancellation_requested", { defaultValue: "Cancellation Requested" })}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className={classes}>
      {t("leave_request__pending", { defaultValue: "Pending" })}
    </Badge>
  );
}

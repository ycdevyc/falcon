export type TripStatus =
  | "open"
  | "offered"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export const tripStatusLabels: Record<TripStatus, string> = {
  open: "Trip requested",
  offered: "Drivers responding",
  confirmed: "Driver selected",
  in_progress: "Trip in progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const tripStatusOrder: TripStatus[] = [
  "open",
  "offered",
  "confirmed",
  "in_progress",
  "completed",
];

export function getTripProgress(status: TripStatus) {
  if (status === "cancelled") {
    return 0;
  }

  const index = tripStatusOrder.indexOf(status);

  if (index === -1) {
    return 0;
  }

  return Math.round(((index + 1) / tripStatusOrder.length) * 100);
}

export function canDriversSubmitProposal(status: string) {
  return status === "open" || status === "offered";
}

export function canCustomerChooseDriver(status: string) {
  return status === "open" || status === "offered";
}

export function canDriverStartTrip(status: string) {
  return status === "confirmed";
}

export function canDriverCompleteTrip(status: string) {
  return status === "in_progress";
}
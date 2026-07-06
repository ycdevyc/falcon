import {
  TripStatus,
  tripStatusOrder,
  tripStatusLabels,
} from "@/lib/falcon/trip-status";

type TripTimelineProps = {
  status: TripStatus;
};

export function TripTimeline({ status }: TripTimelineProps) {
  const currentIndex = tripStatusOrder.indexOf(status);

  return (
    <div className="space-y-3">
      {tripStatusOrder.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isDone
                  ? "bg-green-600 text-white"
                  : isCurrent
                  ? "bg-blue-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isDone ? "✓" : index + 1}
            </div>

            <p
              className={`text-sm ${
                isCurrent
                  ? "font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {tripStatusLabels[step]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
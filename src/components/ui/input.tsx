import { cn } from "@/utils/cn";


/**
 * Stops a number field from changing when the wheel rolls over it.
 *
 * Browsers treat a focused number input as a spinner, so scrolling the page
 * with the cursor over one silently edits the value — a trophy count or an
 * entry fee changes without anyone touching it. Blurring on wheel gives the
 * field back to the page.
 */
const preventWheelChange = (event: React.WheelEvent<HTMLInputElement>) => {
  event.currentTarget.blur();
};

function Input({
  className,
  type,
  onWheel,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      onWheel={type === "number" ? preventWheelChange : onWheel}
      className={cn(
        "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };

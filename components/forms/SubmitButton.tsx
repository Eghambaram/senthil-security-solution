import { Button } from "@/components/ui/Button";

type Props = {
  pending: boolean;
  children: string;
};

export function SubmitButton({ pending, children }: Props) {
  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      arrow={!pending}
      icon={
        pending ? (
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-navy-900/30 border-t-navy-900"
          />
        ) : undefined
      }
      className="h-auto min-h-12 w-full whitespace-normal py-3 text-center sm:w-auto"
    >
      {pending ? "Sending…" : children}
    </Button>
  );
}

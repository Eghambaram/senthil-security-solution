import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function Container({ as: Tag = "div", className, children }: Props) {
  return <Tag className={cn("container-site", className)}>{children}</Tag>;
}

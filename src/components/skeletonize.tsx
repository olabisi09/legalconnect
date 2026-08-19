import { cn } from "@/lib/utils";
import React from "react";
import { Skeleton } from "./ui/skeleton";

export function Skeletonize({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {
  console.log("entry point");
  if (loading) {
    return React.Children.map(children, (child) => {
      console.log("got to this point");
      if (!React.isValidElement(child)) return child;

      const kids = (child?.props as { children?: React.ReactNode }).children;

      if (
        (child.props as { "data-skeleton"?: string })["data-skeleton"] ===
        "ignore"
      ) {
        return child;
      }

      // leaf: plain text/number content -> turn it into a pulsing bar
      if (typeof kids === "string" || typeof kids === "number") {
        // return React.cloneElement(
        //   child as React.ReactElement<{ className?: string }>,
        //   {
        //     className: cn(
        //       (child.props as { className?: string }).className,
        //       "animate-pulse rounded-xs bg-muted",
        //     ),
        //   },
        // );
        return <Skeleton className="w-24 h-3"></Skeleton>;
      }

      // container: recurse into children, keep this element's own classes intact
      if (kids) {
        return React.cloneElement(
          child as React.ReactElement<{ children?: React.ReactNode }>,
          {
            children: <Skeletonize loading>{kids}</Skeletonize>,
          },
        );
      }

      // leaf with no children (e.d img, svg icon etc.)
      return React.cloneElement(
        child as React.ReactElement<{ className?: string }>,
        {
          className: cn(
            (child.props as { className?: string }).className,
            "animate-pulse rounded-xs bg-muted",
          ),
        },
      );
    });
  }
  return <>{children}</>;
}

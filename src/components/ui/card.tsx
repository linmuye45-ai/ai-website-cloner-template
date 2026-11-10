"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "soft" | "bordered";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: "none" | "lift" | "shadow";
}

export function Card({
  className,
  variant = "default",
  padding = "md",
  hover = "none",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-zj-white border border-zj-border",
    outline: "bg-zj-white border border-zj-border-strong",
    soft: "bg-zj-mist border border-zj-border",
    bordered: "bg-zj-white border border-zj-border-strong",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const hovers = {
    none: "",
    lift: "transition-transform duration-250 hover:-translate-y-[3px]",
    shadow: "transition-shadow duration-250 hover:shadow-glow hover:border-zj-cobalt/60",
  };

  return (
    <div
      {...props}
      className={cn(
        "rounded-[12px] overflow-hidden",
        variants[variant],
        paddings[padding],
        hovers[hover],
        className,
      )}
    >
      {children}
    </div>
  );
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      {...props}
      className={cn("flex flex-col space-y-2 pb-6", className)}
    />
  );
}

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      {...props}
      className={cn(
        "font-serif-editorial text-[18px] leading-[1.3] text-zj-ink tracking-tight font-normal",
        className,
      )}
    />
  );
}

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export function CardDescription({
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      {...props}
      className={cn("text-[14px] leading-[1.7] text-zj-slate", className)}
    />
  );
}

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div {...props} className={cn("pt-4", className)} />
  );
}

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;
export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      {...props}
      className={cn("mt-6 flex items-center gap-4 pt-6 border-t border-zj-border/40", className)}
    />
  );
}

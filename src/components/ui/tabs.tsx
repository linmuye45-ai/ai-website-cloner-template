"use client";

import React, { ReactNode, useState, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  onValueChange?: (value: string) => void;
  value?: string;
}

export interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  active?: boolean;
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const currentValue = value ?? internalValue;

  const handleValueChange = (nextValue: string) => {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const mappedChildren = React.Children.map(children, (child) => {
    if (isValidElement(child) && child.type === TabsList) {
      return cloneElement(child as React.ReactElement<TabsListProps>, {
        onValueChange: handleValueChange,
        value: currentValue,
      });
    }
    return child;
  });

  return <div className={cn("w-full", className)}>{mappedChildren}</div>;
}

export function TabsList({
  onValueChange,
  value,
  className,
  children: listChildren,
  ...props
}: TabsListProps & { children: ReactNode }) {
  const mappedTriggers = React.Children.map(listChildren, (child) => {
    if (isValidElement(child) && child.type === TabsTrigger) {
      const active = (child.props as TabsTriggerProps).value === value;
      return cloneElement(child as React.ReactElement<TabsTriggerProps>, {
        onValueChange,
        value,
        active,
      });
    }
    return child;
  });

  return (
    <div
      {...props}
      className={cn(
        "inline-flex items-center gap-px border-b border-zj-border",
        className,
      )}
    >
      {mappedTriggers}
    </div>
  );
}

export function TabsTrigger({
  value,
  onValueChange,
  active,
  className,
  children: triggerChildren,
  ...props
}: TabsTriggerProps & { children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onValueChange!(value!)}
      className={cn(
        "flex items-center justify-center px-5 py-3 text-[13px] font-medium transition-colors border-b-2",
        active
          ? "border-zj-cobalt text-zj-cobalt bg-zj-cobalt-soft/30"
          : "border-transparent text-zj-slate hover:text-zj-cobalt hover:bg-zj-mist/50",
        className,
      )}
      {...props}
    >
      {triggerChildren}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
  ...props
}: TabsContentProps & { children: ReactNode }) {
  return (
    <div
      {...props}
      className={cn("mt-6 space-y-4", className)}
      data-tab={value}
    >
      {children}
    </div>
  );
}

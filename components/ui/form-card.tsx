"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

const FormCard = React.forwardRef<HTMLDivElement, FormCardProps>(
  ({ title, description, children, footer, onSubmit, className }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "w-full max-w-[500px] mx-auto transition-all duration-300",
          "bg-gradient-to-b from-background to-background/80",
          "border border-border/50",
          "shadow-[0_0_15px_rgba(0,0,0,0.1)]",
          "hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]",
          "dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]",
          "dark:hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.25)]",
          "backdrop-blur-sm",
          className
        )}
      >
        <form onSubmit={onSubmit}>
          {(title || description) && (
            <CardHeader className="space-y-1">
              {title && (
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {title}
                </CardTitle>
              )}
              {description && (
                <CardDescription className="text-sm text-muted-foreground">
                  {description}
                </CardDescription>
              )}
            </CardHeader>
          )}
          <CardContent className="space-y-4">
            {children}
          </CardContent>
          {footer && <CardFooter>{footer}</CardFooter>}
        </form>
      </Card>
    );
  }
);
FormCard.displayName = "FormCard";

interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const FormFieldWrapper = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ name, label, description, type = "text", placeholder, required, error, value, onChange, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <FormLabel className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
        )}
        <FormControl>
          <Input
            type={type}
            name={name}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full",
              "transition-all duration-200",
              "focus:ring-2 focus:ring-primary/20",
              "hover:border-primary/50",
              error && "border-destructive focus:ring-destructive/20"
            )}
          />
        </FormControl>
        {description && (
          <FormDescription className="text-xs text-muted-foreground">
            {description}
          </FormDescription>
        )}
        {error && (
          <FormMessage className="text-xs text-destructive">
            {error}
          </FormMessage>
        )}
      </div>
    );
  }
);
FormFieldWrapper.displayName = "FormFieldWrapper";

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  className?: string;
}

const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ children, variant = "default", size = "default", isLoading, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={isLoading}
        className={cn(
          "w-full transition-all duration-200",
          "hover:shadow-lg hover:shadow-primary/10",
          "active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>loading...</span>
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);
FormButton.displayName = "FormButton";

export { FormCard, FormFieldWrapper, FormButton }; 
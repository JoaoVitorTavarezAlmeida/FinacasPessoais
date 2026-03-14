"use client";

import { useEffect, useRef } from "react";

import { useToast } from "@/components/providers/toast-provider";

type ActionToastProps = {
  message?: string;
  success: boolean;
};

export function ActionToast({ message, success }: ActionToastProps) {
  const { showToast } = useToast();
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!message || lastMessageRef.current === message) {
      return;
    }

    lastMessageRef.current = message;
    showToast(message, success ? "success" : "error");
  }, [message, showToast, success]);

  return null;
}

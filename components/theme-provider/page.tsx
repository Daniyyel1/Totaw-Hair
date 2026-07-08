"use client";
import React from "react";
import { Toaster } from "../ui/sonner";
import { useTheme } from "next-themes";

const ThemeProvider = () => {
  const { theme } = useTheme();

  return (
    <div>
      <Toaster
        position="top-center"
        richColors
        theme={theme as "light" | "dark" | "system"}
      />
    </div>
  );
};

export default ThemeProvider;

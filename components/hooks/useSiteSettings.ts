"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type DefaultSettings = Record<string, string>;

type UseSiteSettingsResult = {
  settings: Record<string, string>;
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
};

export function useSiteSettings(
  defaults: DefaultSettings
): UseSiteSettingsResult {
  const keys = useMemo(
    () => Object.keys(defaults),
    [defaults]
  );

  const keysSignature = keys
    .slice()
    .sort()
    .join("|");

  const [settings, setSettings] =
    useState<Record<string, string>>(
      defaults
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadSettings() {
    setLoading(true);
    setError("");

    if (keys.length === 0) {
      setSettings(defaults);
      setLoading(false);
      return;
    }

    const { data, error } =
      await supabase
        .from("site_settings")
        .select(
          "setting_key, setting_value"
        )
        .in(
          "setting_key",
          keys
        );

    if (error) {
      console.error(
        "Erro ao carregar site_settings:",
        error
      );

      setSettings(defaults);

      setError(
        "Não foi possível carregar os conteúdos do site."
      );

      setLoading(false);

      return;
    }

    const nextSettings = {
      ...defaults,
    };

    (data || []).forEach(
      (setting) => {
        const key =
          setting.setting_key;

        const value =
          setting.setting_value;

        if (
          key &&
          typeof value === "string" &&
          value.trim() !== ""
        ) {
          nextSettings[key] =
            value;
        }
      }
    );

    setSettings(
      nextSettings
    );

    setLoading(false);
  }

  useEffect(() => {
    loadSettings();

    // A assinatura muda apenas quando
    // o conjunto de chaves muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keysSignature]);

  return {
    settings,
    loading,
    error,
    reload: loadSettings,
  };
}
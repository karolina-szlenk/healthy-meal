import { useState, useEffect } from "react";
import type { PreferencesDTO, CreatePreferencesCommand, UpdatePreferencesCommand } from "@/types";

const usePreferences = () => {
  const [preferences, setPreferences] = useState<PreferencesDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/preferences");
        if (!response.ok) {
          throw new Error("Błąd pobierania preferencji");
        }
        const data = await response.json();
        setPreferences(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const submitPreferences = async (values: CreatePreferencesCommand | UpdatePreferencesCommand) => {
    try {
      const method = preferences ? "PUT" : "POST";
      const response = await fetch("/api/preferences", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Błąd aktualizacji/ustawiania preferencji");
      }
      const data = await response.json();
      setPreferences(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return { preferences, loading, error, submitPreferences };
};

export default usePreferences;

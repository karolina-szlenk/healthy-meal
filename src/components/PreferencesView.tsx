import React from "react";
import PreferencesForm, { type PreferencesFormValues } from "./PreferencesForm";
import LoadingSpinner from "./LoadingSpinner";
import ErrorDisplay from "./ErrorDisplay";
import usePreferences from "./hooks/usePreferences";

const PreferencesView: React.FC = () => {
  const { preferences, loading, error, submitPreferences } = usePreferences();

  const handleSubmit = (values: PreferencesFormValues) => {
    submitPreferences(values);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  const initialValues: PreferencesFormValues = preferences
    ? {
        diet_type: preferences.diet_type,
        calorie_target: preferences.calorie_target ?? 2000,
        allergies: preferences.allergies != null ? String(preferences.allergies) : "",
        excluded_ingredients: preferences.excluded_ingredients != null ? String(preferences.excluded_ingredients) : "",
      }
    : {
        diet_type: "VEGETARIAN",
        calorie_target: 2000,
        allergies: "",
        excluded_ingredients: "",
      };

  return (
    <div className="container mx-auto px-4 py-8">
      <PreferencesForm initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
};

export default PreferencesView;

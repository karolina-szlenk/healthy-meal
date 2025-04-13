import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export interface PreferencesFormValues {
  diet_type: "VEGETARIAN" | "KETOGENIC" | "PESCATARIAN";
  calorie_target: number;
  allergies?: string;
  excluded_ingredients?: string;
}

export interface PreferencesFormProps {
  initialValues: PreferencesFormValues;
  onSubmit: (values: PreferencesFormValues) => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ initialValues, onSubmit }) => {
  const [formValues, setFormValues] = useState<PreferencesFormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "calorie_target" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.diet_type || formValues.calorie_target <= 0) {
      setFormErrors("Wypełnij wymagane pola prawidłowo.");
      return;
    }
    setFormErrors(null);
    onSubmit(formValues);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Preferencje żywieniowe</h2>
      {formErrors && <div className="mb-4 text-red-500">{formErrors}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="diet_type" className="block text-sm font-medium text-gray-700">
            Typ diety
          </label>
          <select
            id="diet_type"
            name="diet_type"
            value={formValues.diet_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="VEGETARIAN">Wegetariańska</option>
            <option value="KETOGENIC">Ketogeniczna</option>
            <option value="PESCATARIAN">Pescatariańska</option>
          </select>
        </div>
        <div>
          <label htmlFor="calorie_target" className="block text-sm font-medium text-gray-700">
            Cel kaloryczny
          </label>
          <input
            id="calorie_target"
            name="calorie_target"
            type="number"
            value={formValues.calorie_target}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
            Alergie (opcjonalnie)
          </label>
          <textarea
            id="allergies"
            name="allergies"
            value={formValues.allergies || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="excluded_ingredients" className="block text-sm font-medium text-gray-700">
            Wykluczone składniki (opcjonalnie)
          </label>
          <textarea
            id="excluded_ingredients"
            name="excluded_ingredients"
            value={formValues.excluded_ingredients || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div className="mt-4">
          <Button type="submit" className="w-full">
            Zapisz zmiany
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PreferencesForm;

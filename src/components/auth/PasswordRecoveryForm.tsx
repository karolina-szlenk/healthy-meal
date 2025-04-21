"use client";

import React, { useState } from "react";
import Input from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";

const recoverySchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
});

type RecoveryFormData = z.infer<typeof recoverySchema>;

const PasswordRecoveryForm: React.FC = () => {
  const [errors, setErrors] = useState<Partial<Record<keyof RecoveryFormData | "form", string>>>({});
  const [formData, setFormData] = useState<RecoveryFormData>({
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (data: RecoveryFormData) => {
    const result = recoverySchema.safeParse(data);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before attempting API call
    if (!validateForm(formData)) {
      return;
    }

    try {
      // TODO: Implement password recovery functionality
      console.log("Form data valid, calling API:", formData);
    } catch (error) {
      console.error("Password recovery failed:", error);
      setErrors({ form: "Wystąpił błąd podczas wysyłania linku. Spróbuj ponownie później." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Wprowadź email"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      {errors.form && <p className="text-sm text-red-600 text-center">{errors.form}</p>}
      <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white">
        Wyślij link resetujący
      </Button>
    </form>
  );
};

export default PasswordRecoveryForm;

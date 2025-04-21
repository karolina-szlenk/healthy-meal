"use client";

import React, { useState } from "react";
import Input from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData | "form", string>>>({});
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (data: LoginFormData) => {
    const result = loginSchema.safeParse(data);
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
      // TODO: Implement login functionality
      console.log("Form data valid, calling API:", formData);
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ form: "Wystąpił błąd podczas logowania. Spróbuj ponownie później." });
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
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Hasło
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Wprowadź hasło"
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>
      {errors.form && <p className="text-sm text-red-600 text-center">{errors.form}</p>}
      <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white">
        Zaloguj się
      </Button>
    </form>
  );
};

export default LoginForm;

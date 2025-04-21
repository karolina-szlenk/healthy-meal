"use client";

import React, { useState } from "react";
import Input from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";

const registerSchema = z
  .object({
    username: z.string().min(3, "Nazwa użytkownika musi mieć minimum 3 znaki"),
    email: z.string().email("Nieprawidłowy format adresu email"),
    password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData | "form", string>>>({});
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (data: RegisterFormData) => {
    const result = registerSchema.safeParse(data);
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
      // TODO: Implement registration functionality
      console.log("Form data valid, calling API:", formData);
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ form: "Wystąpił błąd podczas rejestracji. Spróbuj ponownie później." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Nazwa użytkownika
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Wprowadź nazwę użytkownika"
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
      </div>
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
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
          Potwierdź hasło
        </label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Potwierdź hasło"
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>
      {errors.form && <p className="text-sm text-red-600 text-center">{errors.form}</p>}
      <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white">
        Zarejestruj się
      </Button>
    </form>
  );
};

export default RegisterForm;

"use client";

import React from "react";
import Input from "../ui/input";
import { Button } from "../ui/button";

const RegisterForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement registration functionality
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Nazwa użytkownika
        </label>
        <Input id="username" type="text" required placeholder="Wprowadź nazwę użytkownika" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input id="email" type="email" required placeholder="Wprowadź email" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Hasło
        </label>
        <Input id="password" type="password" required placeholder="Wprowadź hasło" />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
          Potwierdź hasło
        </label>
        <Input id="confirm-password" type="password" required placeholder="Potwierdź hasło" />
      </div>
      <Button type="submit" className="w-full">
        Zarejestruj się
      </Button>
    </form>
  );
};

export default RegisterForm;

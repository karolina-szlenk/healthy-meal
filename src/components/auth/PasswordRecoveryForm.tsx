"use client";

import React from "react";
import Input from "../ui/input";
import { Button } from "../ui/button";

const PasswordRecoveryForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement password recovery functionality
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input id="email" type="email" required placeholder="Wprowadź email" />
      </div>
      <Button type="submit" className="w-full">
        Wyślij link resetujący
      </Button>
    </form>
  );
};

export default PasswordRecoveryForm;

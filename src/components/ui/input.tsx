/* eslint-disable react/prop-types */

"use client";

import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }: InputProps, ref) => (
  <input
    ref={ref}
    className={`mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className ? className : ""}`}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;

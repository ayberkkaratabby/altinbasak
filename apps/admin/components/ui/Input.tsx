'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  floatingLabel?: boolean;
}

export function Input({ label, error, helperText, className, id, floatingLabel = true, value, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasValue(!!value || !!(inputRef.current?.value));
  }, [value]);

  const isFloating = floatingLabel && label;
  const isLabelActive = isFloating && (isFocused || hasValue);
  
  return (
    <div className="w-full relative">
      {isFloating ? (
        <>
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            className={cn(
              'w-full px-0 pt-6 pb-2 border-0 border-b-2 bg-transparent',
              'focus:outline-none transition-all duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-black/20 focus:border-black',
              className
            )}
            placeholder=" "
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              'absolute left-0 top-0 text-base font-light tracking-[-0.01em]',
              'transition-all duration-300 pointer-events-none',
              isLabelActive
                ? 'text-xs text-black/50 -translate-y-1'
                : 'text-lg text-black/40 translate-y-6',
              error && 'text-red-500',
              props.required && 'after:content-["*"] after:ml-1 after:text-red-500'
            )}
          >
            {label}
          </label>
        </>
      ) : (
        <>
          {label && (
            <label htmlFor={inputId} className="block text-sm font-medium text-black mb-2">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            className={cn(
              'w-full px-4 py-3 border-2 rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'bg-white shadow-sm',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200',
              className
            )}
            {...props}
          />
        </>
      )}
      {error && <p className="mt-2 text-sm text-red-500 font-light">{error}</p>}
      {helperText && !error && <p className="mt-2 text-sm text-black/40 font-light">{helperText}</p>}
    </div>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  floatingLabel?: boolean;
}

export function Textarea({ label, error, helperText, className, id, floatingLabel = true, value, ...props }: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    setHasValue(!!value || !!(textareaRef.current?.value));
  }, [value]);

  const isFloating = floatingLabel && label;
  const isLabelActive = isFloating && (isFocused || hasValue);
  
  return (
    <div className="w-full relative">
      {isFloating ? (
        <>
          <textarea
            ref={textareaRef}
            id={textareaId}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            className={cn(
              'w-full px-0 pt-6 pb-2 border-0 border-b-2 bg-transparent resize-y min-h-[120px]',
              'focus:outline-none transition-all duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-black/20 focus:border-black',
              className
            )}
            placeholder=" "
            {...props}
          />
          <label
            htmlFor={textareaId}
            className={cn(
              'absolute left-0 top-0 text-base font-light tracking-[-0.01em]',
              'transition-all duration-300 pointer-events-none',
              isLabelActive
                ? 'text-xs text-black/50 -translate-y-1'
                : 'text-lg text-black/40 translate-y-2',
              error && 'text-red-500',
              props.required && 'after:content-["*"] after:ml-1 after:text-red-500'
            )}
          >
            {label}
          </label>
        </>
      ) : (
        <>
          {label && (
            <label htmlFor={textareaId} className="block text-sm font-medium text-black mb-2">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <textarea
            ref={textareaRef}
            id={textareaId}
            value={value}
            className={cn(
              'w-full px-4 py-3 border-2 rounded-lg resize-y',
              'focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'bg-white shadow-sm',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200',
              className
            )}
            {...props}
          />
        </>
      )}
      {error && <p className="mt-2 text-sm text-red-500 font-light">{error}</p>}
      {helperText && !error && <p className="mt-2 text-sm text-black/40 font-light">{helperText}</p>}
    </div>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, helperText, options, className, id, ...props }: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-black mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full px-4 py-3 border-2 rounded-lg bg-white shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-600">{helperText}</p>}
    </div>
  );
}


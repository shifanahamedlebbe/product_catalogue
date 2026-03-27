import React from 'react';
import clsx from 'clsx';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface BaseProps {
  label?: string;
  placeholder?: string;
  error?: string | FieldError;
  className?: string;
  disabled?: boolean;
  options: Option[];
}

type StandaloneProps = BaseProps & {
  value?: string;
  onChange?: (value: string) => void;
};

type ReactHookFormProps = BaseProps & {
  register?: UseFormRegisterReturn;
  controller?: {
    value: string;
    onChange: (value: string) => void;
  };
};

export type SelectInputProps = StandaloneProps | ReactHookFormProps;

const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, placeholder, error, className, disabled, options, ...props }, ref) => {
    const isReactHookForm = 'controller' in props || 'register' in props;
    const standaloneProps = props as StandaloneProps;
    const ReactHookFormProps = props as ReactHookFormProps;

    return (
      <div className={clsx('space-y-1', className)}>
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <select
          ref={ref}
          disabled={disabled}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
          {...(isReactHookForm
            ? ReactHookFormProps.controller
              ? {
                  value: ReactHookFormProps.controller.value,
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                    ReactHookFormProps.controller!.onChange(e.target.value),
                }
              : {
                  ...(ReactHookFormProps.register ?? {}),
                }
            : {
                value: standaloneProps.value,
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  typeof standaloneProps.onChange === 'function' && standaloneProps.onChange(e.target.value),
              })}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{typeof error === 'string' ? error : error?.message}</p>}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';

export default React.memo(SelectInput);

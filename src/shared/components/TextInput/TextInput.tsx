import React from 'react';
import clsx from 'clsx';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface BaseProps {
  label?: string;
  placeholder?: string;
  error?: string | FieldError;
  className?: string;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
}

type StandaloneProps = BaseProps & {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
};

type ReactHookFormProps = BaseProps & {
  register?: UseFormRegisterReturn;
  controller?: {
    value: string;
    onChange: (value: string) => void;
  };
};

export type TextInputProps = StandaloneProps | ReactHookFormProps;

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, placeholder, error, className, disabled, ...props }, ref) => {
    const isReactHookForm = 'controller' in props || 'register' in props;
    const standaloneProps = props as StandaloneProps;
    const ReactHookFormProps = props as ReactHookFormProps;

    return (
      <div className={clsx('space-y-1', className)}>
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input
          ref={ref}
          type={(props as BaseProps).type || 'text'}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
          {...(isReactHookForm
            ? ReactHookFormProps.controller
              ? {
                  value: ReactHookFormProps.controller.value,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    ReactHookFormProps.controller!.onChange(e.target.value),
                }
              : {
                  ...(ReactHookFormProps.register ?? {}),
                }
            : {
                value: standaloneProps.value,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  typeof standaloneProps.onChange === 'function' && standaloneProps.onChange(e.target.value),
              })}
        />
        {error && <p className="text-xs text-red-600">{typeof error === 'string' ? error : error?.message}</p>}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default React.memo(TextInput);

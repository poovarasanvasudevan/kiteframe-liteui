import type * as React from 'react';
import { useId } from 'react';
import {
  FormProvider,
  useController,
  useFormContext,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';
import { FormRow, type FormRowProps } from './Content';

export interface FormProps<TValues extends FieldValues> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onInvalid'> {
  form: UseFormReturn<TValues>;
  onSubmit: SubmitHandler<TValues>;
  onInvalid?: SubmitErrorHandler<TValues>;
}

export function Form<TValues extends FieldValues>({ form, onSubmit, onInvalid, noValidate = true, children, ...props }: FormProps<TValues>) {
  return <FormProvider {...form}>
    <form {...props} noValidate={noValidate} onSubmit={form.handleSubmit(onSubmit, onInvalid)}>{children}</form>
  </FormProvider>;
}

export interface FormFieldRenderProps<TValues extends FieldValues, TName extends FieldPath<TValues>> {
  field: ControllerRenderProps<TValues, TName>;
  inputProps: {
    id: string;
    'aria-invalid': boolean | undefined;
    'aria-required': boolean | undefined;
    'aria-describedby': string | undefined;
  };
  error?: string;
  invalid: boolean;
}

export interface FormFieldProps<TValues extends FieldValues, TName extends FieldPath<TValues>> extends Omit<FormRowProps, 'children' | 'error' | 'htmlFor' | 'hintId' | 'errorId'> {
  name: TName;
  control?: Control<TValues>;
  id?: string;
  describedBy?: string;
  render: (props: FormFieldRenderProps<TValues, TName>) => React.ReactNode;
}

export function FormField<TValues extends FieldValues, TName extends FieldPath<TValues>>({ name, control, id, label, required, hint, describedBy, render, className }: FormFieldProps<TValues, TName>) {
  const context = useFormContext<TValues>();
  const resolvedControl = control ?? context?.control;
  if (!resolvedControl) throw new Error('FormField needs a control prop or must be rendered inside Form or FormProvider.');
  const { field, fieldState } = useController({ name, control: resolvedControl });
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const error = fieldState.error?.message;
  const inputProps = {
    id: inputId,
    'aria-invalid': error ? true : undefined,
    'aria-required': required || undefined,
    'aria-describedby': [describedBy, error ? errorId : hint ? hintId : null].filter(Boolean).join(' ') || undefined,
  };

  return <FormRow label={label} required={required} hint={hint} error={error} htmlFor={inputId} hintId={hintId} errorId={errorId} className={className}>
    {render({ field, inputProps, error, invalid: !!error })}
  </FormRow>;
}

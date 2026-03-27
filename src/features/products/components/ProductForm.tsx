import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Product } from '@features/products/model/types';

import TextInput from '@shared/components/TextInput/TextInput';
import SelectInput from '@shared/components/SelectInput/SelectInput';
import Button from '@shared/components/Button/Button';

const categories = ['Food', 'Beverage', 'Other'] as const;

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(categories, { errorMap: () => ({ message: 'Category is required' }) }),
  price: z.number({ invalid_type_error: 'Price must be a number' }).gte(0, 'Price must be greater than or equal to 0'),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;
export type ProductFormValues = FormValues;

interface ProductFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  initialData?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const defaultValues = useMemo(
    () => ({
      name: initialData?.name ?? '',
      category: initialData?.category ?? 'Food',
      price: initialData?.price ?? 0,
      isActive: initialData?.isActive ?? true,
    }),
    [initialData]
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextInput label="Name" placeholder="Product name" error={errors.name} register={register('name')} />
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <SelectInput
            label="Category"
            options={categories.map((option) => ({ value: option, label: option }))}
            error={errors.category}
            controller={field}
            placeholder="Select category"
          />
        )}
      />
      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Price"
            placeholder="0.00"
            error={errors.price}
            controller={{
              ...field,
              value: String(field.value),
              onChange: (value: string) => field.onChange(Number(value)),
            }}
            type="number"
          />
        )}
      />
      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
        )}
      />
      {initialData && <div className="text-xs text-gray-500">Updated at: {initialData.updatedAt}</div>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(ProductForm);

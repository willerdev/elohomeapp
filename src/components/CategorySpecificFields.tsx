import { CATEGORY_SPECS } from '../data/categorySpecs';
import type { CategorySpecField } from '../types';

interface CategorySpecificFieldsProps {
  category: string;
  specifications: Record<string, string | number>;
  onSpecificationChange: (name: string, value: string) => void;
}

export const CategorySpecificFields = ({
  category,
  specifications,
  onSpecificationChange,
}: CategorySpecificFieldsProps) => {
  const categorySpec = CATEGORY_SPECS.find(spec => spec.category === category);

  if (!categorySpec) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">
        {category} Specifications
      </h3>
      {categorySpec.fields.map((field: CategorySpecField) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={field.type}
            value={specifications[field.name] || ''}
            onChange={(e) => onSpecificationChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            required={field.required}
          />
        </div>
      ))}
    </div>
  );
};
import React from 'react';
import Select from 'react-select';

type Props = {
  column: string;
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

// Utility to format options for react-select
const toOption = (value: string) => ({
  value,
  label: String(value)
});

const FilterDropdown: React.FC<Props> = ({
  column,
  options,
  value,
  onChange,
  placeholder
}) => {
  const selectOptions = React.useMemo(
    () => options.map(toOption),
    [options]
  );

  const selectedValues = React.useMemo(
    () => value.map(toOption),
    [value]
  );

  const handleChange = (selected: any) => {
    const newValues = Array.isArray(selected)
      ? selected.map(option => option.value)
      : [];
    onChange(newValues);
  };

  return (
    <div className="filter-dropdown">
      <div className="filter-label">{column}</div>
      <Select
        isMulti
        options={selectOptions}
        value={selectedValues}
        onChange={handleChange}
        placeholder={placeholder || `Filter ${column}...`}
        className="react-select-container"
        classNamePrefix="react-select"
        isSearchable={true}
        isClearable={true}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: base => ({ ...base, zIndex: 9999 }),
          control: (base, state) => ({
            ...base,
            minHeight: '36px',
            borderColor: state.isFocused ? '#2684FF' : '#cccccc',
            boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : 'none',
            '&:hover': {
              borderColor: state.isFocused ? '#2684FF' : '#b3b3b3'
            }
          }),
          valueContainer: base => ({
            ...base,
            padding: '0 8px'
          }),
          input: base => ({
            ...base,
            margin: 0,
            padding: 0
          }),
          placeholder: base => ({
            ...base,
            color: '#999999',
            fontSize: '14px'
          }),
          multiValue: base => ({
            ...base,
            backgroundColor: '#e6f2ff',
            borderRadius: '2px'
          }),
          multiValueLabel: base => ({
            ...base,
            color: '#0066cc',
            padding: '2px 6px'
          }),
          multiValueRemove: base => ({
            ...base,
            color: '#0066cc',
            ':hover': {
              backgroundColor: '#cce0ff',
              color: '#004080'
            }
          })
        }}
      />
    </div>
  );
};

export default FilterDropdown;

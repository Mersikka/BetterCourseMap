import Select from 'react-select';
import './App.css'

const selectorStyles = {
  container: (base) => ({
    ...base,
    flex: 1,
    minWidth: '100%',
    width: 'max-content',
  }),

  control: (base, state) => ({
    ...base,
    backgroundColor: '#000',
    color: '#FFF',
    borderColor: state.isFocused ? '#aaa' : '#888',
    boxShadow: 'none',
    ':hover': { borderColor: '#aaa' },
    minheight: 40,
    minWidth: '100%',
    width: 'max-content',
  }),

  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: '#000',
    border: '1px solid #888',
    borderradius: 6,
    overflow: 'hidden',
    width: '100%',
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#222"                  // selected option background (dark)
      : state.isFocused
      ? "#111"                  // hover background
      : "#000",                 // default background
    color: "#fff",
    cursor: "pointer",
  }),
}

export const Selector = ({ options, value, onChange, ...props }) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      styles={selectorStyles}
      className='rs degree'
      classNamePrefix='rs'
      {...props}
    />
  );
}

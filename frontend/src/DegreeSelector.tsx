import { useState } from 'react';
import { Selector } from './Selector.tsx';
import './App.css';

// Hard coded, will be fetched from the Sisu API later
const degreeOptions = [
  { value: 'B.CS', label: "Bachelor's in Computer Science" },
  { value: 'B.Math', label: "Bachelor's in Mathematical Sciences" },
  { value: 'B.Sc', label: "Bachelor's in Science" },
  { value: 'B.Chem', label: "Bachelor's in Chemistry" }
]

const universityOptions = [
  { value: 'uh', label: "University of Helsinki" },
  { value: 'aalto', label: "Aalto University" }
]

export const DegreeSelector = () => {
  const [degree, setDegree] = useState(
    {value: 'B.CS', label: "Bachelor's in Computer Science"}
  );
  const [university, setUniversity] = useState(
    {value: 'uh', label: "University of Helsinki"}
  )
  
  return (
    <>
      <div className='degree-selector' >
        <Selector
          options={degreeOptions}
          value={degree}
          onChange={setDegree}
        />
        <span className='at-label'>at</span>
        <Selector
          options={universityOptions}
          value={university}
          onChange={setUniversity}
        />
      </div>
    </>
  )
}

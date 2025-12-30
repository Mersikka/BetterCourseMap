import { useState } from 'react';
import { API_URL } from './lib/api';
import './App.css';
import { RotatingCompass } from './RotatingCompass';

function App() {

  return (
    <>
      <header className='main-logo'>
        <RotatingCompass
          options={{
            bigTurnProbability: 0.22,
            smallDeltaRange: [-40, 40],
            bigDeltaRange: [-180, 180],
            smallDurationRange: [1, 2],
            bigDurationRange: [2, 3],
            pauseRangeMs: [50, 100],
            easing: 'cubic-bezier(.25,.1,.25,1)',
          }}
          hoverOptions={{
            bigTurnProbability: 0.5,
            smallDeltaRange: [-360, -340],
            bigDeltaRange: [340, 360],
            smallDurationRange: [0.3, 0.5],
            bigDurationRange: [0.3, 0.5],
            pauseRangeMs: [1, 2],
            easing: 'linear',
          }}
          iconClassName='compass'
          icon={
            <img
              src='/images/compass_transparent.png'
              alt=''
              className='compass'
            />
          }
        />
        <h1 className='logo-text'>BetterCourseMap</h1>
      </header>
    </>
  )
}

export default App

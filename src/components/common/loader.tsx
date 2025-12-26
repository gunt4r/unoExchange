'use client';
import { PropagateLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        zIndex: 100,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <PropagateLoader color="#5B914A" />
    </div>
  );
}

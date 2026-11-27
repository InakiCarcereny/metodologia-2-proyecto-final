import { ImageResponse } from 'next/og';

export const alt = 'DevHub — Red social exclusiva para desarrolladores';
export const size = {
  height: 630,
  width: 1200,
};
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#171b22',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        gap: 28,
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#0c0f17',
          borderRadius: 28,
          display: 'flex',
          height: 120,
          justifyContent: 'center',
          width: 120,
        }}
      >
        <svg
          aria-label="DevHub"
          height="72"
          role="img"
          viewBox="0 0 24 24"
          width="72"
        >
          <title>DevHub</title>
          <g
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
          >
            <circle cx="12" cy="12" r="8.2" />
            <path d="M12 3.8a12 12 0 0 0 0 16.4 12 12 0 0 0 0-16.4" />
            <path d="M3.6 12h16.8" />
          </g>
        </svg>
      </div>
      <div
        style={{
          color: '#ffffff',
          display: 'flex',
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        DevHub
      </div>
      <div
        style={{
          color: '#9aa1ad',
          display: 'flex',
          fontSize: 30,
          fontWeight: 500,
        }}
      >
        Red social exclusiva para desarrolladores
      </div>
    </div>,
    {
      ...size,
    },
  );
}

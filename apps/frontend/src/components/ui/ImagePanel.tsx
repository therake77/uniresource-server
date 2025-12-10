export function ImagePanel() {
  return (
    <div className="w-1/2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
      <div className="text-center text-white">
        <div className="mb-8">
          <svg
            className="w-64 h-64 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(255,255,255,0.2)"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">UniResource</h1>
        <p className="text-xl opacity-90">
          Tu plataforma de recursos universitarios
        </p>
      </div>
    </div>
  );
}

export default ImagePanel;
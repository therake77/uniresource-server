export function ImagePanel() {
  return (
    <div className="w-1/2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-8 relative overflow-hidden">
      <img
        src="/images/uniImage.png"
        alt="Universidad Nacional de Ingeniería"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

export default ImagePanel;
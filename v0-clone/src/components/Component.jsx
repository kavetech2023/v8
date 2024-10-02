
function Component() {
  return (
    <div className="bg-black flex flex-col h-screen">
      <div className="flex items-center justify-center w-full h-full">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm">
          <h1 className="text-2xl font-bold">TikTok Clone</h1>
          <p className="text-gray-600">
            Create and share your own videos with the world.
          </p>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default Component;

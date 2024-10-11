import React from "react";

const TailwindShowcase = () => {
  return (
    <div className="bg-gray-100 p-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">
          Tailwind CSS Test Components
        </h1>
        <p className="mt-2 text-gray-700">
          A showcase of various UI elements styled with Tailwind CSS
        </p>
      </header>

      {/* Button Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Primary Button
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Success Button
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Danger Button
          </button>
        </div>
      </section>

      {/* Card Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Card Title</h3>
            <p className="text-gray-600">
              This is a basic card with some content inside. Tailwind allows you
              to create beautiful cards easily.
            </p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Learn More
            </button>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Another Card</h3>
            <p className="text-gray-600">
              Here's another example card, showcasing how easy it is to build
              layouts with Tailwind.
            </p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Responsive Grid</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-blue-200 p-4">Grid Item 1</div>
          <div className="bg-blue-300 p-4">Grid Item 2</div>
          <div className="bg-blue-400 p-4">Grid Item 3</div>
          <div className="bg-blue-500 p-4">Grid Item 4</div>
        </div>
      </section>

      {/* Typography Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>
        <div>
          <p className="text-lg text-gray-800">
            Tailwind CSS provides excellent control over typography. You can
            easily adjust font sizes, weights, colors, and more.
          </p>
          <p className="mt-4 font-semibold text-gray-900">
            This is an example of bold text.
          </p>
          <p className="mt-2 italic text-gray-700">
            This is an example of italic text.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            This is an example of smaller text.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TailwindShowcase;

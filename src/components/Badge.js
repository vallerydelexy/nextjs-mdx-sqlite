export default function Badge({ text}) {
  return <div
    className="flex flex-row mt-1 mx-1 items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 hover:motion-preset-confetti hover:flex"
  >
    <div>
    <svg
      className="-ml-0.5 mr-1.5 h-2 w-2 text-indigo-400"
      fill="currentColor"
      viewBox="0 0 8 8"
    >
      <circle cx={4} cy={4} r={3} />
    </svg>
    </div>
    <span>{text}</span>
  </div>;
}

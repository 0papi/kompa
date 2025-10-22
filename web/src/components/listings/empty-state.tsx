export default function NoListings({subText}:{subText?:string}) {
  return (
    <div className="text-center w-full max-w-md">
      <svg
        className="mx-auto h-12 w-12 text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v3.776"
        />
      </svg>

      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        No listings found
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        {subText}
      </p>
    </div>
  );
}

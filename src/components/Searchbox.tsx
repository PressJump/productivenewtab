import React from 'react'

export default function Searchbox({
    searchQuery,
    setSearchQuery,
    handleKeyDown,
}: {
    searchQuery: string
    setSearchQuery: Function
    handleKeyDown: Function
}) {
    return (
        <div className="relative w-full">
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                    <svg
                        className="shrink-0 size-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>
                </div>
                <input
                    className="py-3 ps-10 pe-4 block w-full border-gray-200 rounded-lg border text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    type="text"
                    role="combobox"
                    aria-expanded="false"
                    placeholder="Search on Google or type a URL"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
            </div>
        </div>
    )
}

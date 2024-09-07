import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import ICAL from 'ical-expander'
import '../assets/styles.css'

const CalendarEvents = () => {
    const [events, setEvents] = useState<any[]>([])
    const [groupedEvents, setGroupedEvents] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchCalendarEvents = async () => {
            try {
                const url = 'URL'
                const response = await fetch(url)
                const icsData = await response.text()

                const icalExpander = new ICAL({
                    ics: icsData,
                    maxIterations: 1000,
                })
                const eventsData = icalExpander.between(
                    new Date(),
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    true
                )

                const mappedEvents = eventsData.events.map((event) => ({
                    summary: event.summary,
                    startDate: event.startDate.toJSDate(),
                    endDate: event.endDate.toJSDate(),
                }))

                const mappedOccurrences = eventsData.occurrences.map(
                    (occurrence) => ({
                        summary: occurrence.item.summary,
                        startDate: occurrence.startDate.toJSDate(),
                        endDate: occurrence.endDate.toJSDate(),
                    })
                )

                const parsedEvents = [
                    ...mappedEvents,
                    ...mappedOccurrences,
                ].sort((a, b) => a.startDate - b.startDate)
                setEvents(parsedEvents)
            } catch (error) {
                console.error('Error fetching calendar events:', error)
            }
        }

        fetchCalendarEvents()
    }, [])

    useEffect(() => {
        const groupByDay = (events: any[]) => {
            const startDate = new Date()
            const endDate = new Date(startDate)
            endDate.setDate(startDate.getDate() + 6)

            const days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date(startDate)
                date.setDate(startDate.getDate() + i)
                return date.toDateString()
            })

            const grouped = days.map((day) => ({
                date: day,
                events: events.filter(
                    (event) => new Date(event.startDate).toDateString() === day
                ),
            }))

            return grouped
        }

        setGroupedEvents(groupByDay(events))
    }, [events])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            const query = encodeURIComponent(searchQuery)
            window.location.href = `https://www.google.com/search?q=${query}`
        }
    }

    return (
        <div className="p-4 w-full h-screen justify-center items-center flex flex-col">
            <div className="">
                {groupedEvents.length === 0 ? (
                    <p>No events found.</p>
                ) : (
                    <div className="p-2">
                        <div className="flex flex-col bg-gray-50 p-2 rounded-md">
                            <div className="-m-1.5 overflow-x-auto">
                                <div className="p-1.5 inline-block align-middle">
                                    <div className="overflow-hidden"></div>
                                    <table className=" divide-y divide-gray-200 dark:divide-neutral-700">
                                        <thead>
                                            <tr>
                                                {groupedEvents.map(
                                                    (day, index) => (
                                                        <th
                                                            key={index}
                                                            className="px-2 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                        >
                                                            {new Date(
                                                                day.date
                                                            ).toLocaleDateString(
                                                                undefined,
                                                                {
                                                                    weekday:
                                                                        'long',
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                }
                                                            )}
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                            <tr>
                                                {groupedEvents.map(
                                                    (day, index) => (
                                                        <td
                                                            key={index}
                                                            className="px-2 py-4 whitespace-nowrap text-xs font-medium"
                                                        >
                                                            {day.events
                                                                .length ===
                                                            0 ? (
                                                                <p>No events</p>
                                                            ) : (
                                                                <ul>
                                                                    {day.events.map(
                                                                        (
                                                                            event,
                                                                            idx
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="bg-gray-100 p-2 rounded-md my-2 max-w-40 text-wrap"
                                                                            >
                                                                                <strong>
                                                                                    {event.summary ||
                                                                                        'No Title'}
                                                                                </strong>
                                                                                <br />
                                                                                {event.startDate.toLocaleTimeString()}{' '}
                                                                                -{' '}
                                                                                {event.endDate.toLocaleTimeString()}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            )}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="w-full p-2">
                    <div className="relative">
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
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('display-container')!)
root.render(<CalendarEvents />)

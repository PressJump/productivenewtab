import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import ICAL from 'ical-expander'
import '../assets/styles.css'

const CalendarEvents = () => {
    const [events, setEvents] = useState<any[]>([])
    const [groupedEvents, setGroupedEvents] = useState<any[]>([])

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

    return (
        <div className="p-4 w-full h-screen justify-center items-center flex flex-col">
            <div>
                {groupedEvents.length === 0 ? (
                    <p>No events found.</p>
                ) : (
                    <div className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 inline-block align-middle">
                                <div className="overflow-hidden"></div>
                                <table className=" divide-y divide-gray-200 dark:divide-neutral-700">
                                    <thead>
                                        <tr>
                                            {groupedEvents.map((day, index) => (
                                                <th
                                                    key={index}
                                                    className="px-2 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                >
                                                    {new Date(
                                                        day.date
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            weekday: 'long',
                                                            day: 'numeric',
                                                            month: 'long',
                                                        }
                                                    )}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                        <tr>
                                            {groupedEvents.map((day, index) => (
                                                <td
                                                    key={index}
                                                    className="px-2 py-4 whitespace-nowrap text-xs font-medium"
                                                >
                                                    {day.events.length === 0 ? (
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
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                <div className="relative overflow-hidden w-full">
                    <div className="w-full mx-auto ">
                        <div className="text-center">
                            <div className="sm:mt-12 mx-autorelative">
                                <form>
                                    <div className="w-full bg-white border rounded-lg shadow-lg shadow-gray-100">
                                        <label
                                            htmlFor="hs-search-article-1"
                                            className="block text-sm text-gray-700 font-medium"
                                        >
                                            <span className="sr-only">
                                                Search online{' '}
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            name="hs-search-article-1"
                                            id="hs-search-article-1"
                                            className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Search article"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('display-container')!)
root.render(<CalendarEvents />)

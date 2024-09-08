import React from 'react'
import { SlSettings } from 'react-icons/sl'

export default function CalendarTable({
    groupedEvents,
    handleSetCalendarURL,
}: {
    groupedEvents: any
    handleSetCalendarURL: Function
}) {
    return (
        <>
            <div className="flex flex-col border p-2 rounded-md relative">
                <button
                    onClick={() => handleSetCalendarURL()}
                    className="p-2 rounded-full hover:bg-gray-100 top-2 right-2 absolute"
                >
                    <SlSettings />
                </button>

                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 inline-block align-middle">
                        <div className="overflow-hidden"></div>
                        <table className="divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                                <tr>
                                    {groupedEvents.map((day, index) => (
                                        <th
                                            key={index}
                                            className="px-2 py-3 text-start text-xs font-normal text-black uppercase"
                                        >
                                            {new Date(
                                                day.date
                                            ).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                            })}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y ">
                                <tr>
                                    {groupedEvents.map((day, index) => (
                                        <td
                                            key={index}
                                            className="px-2 py-4 whitespace-nowrap text-xs"
                                        >
                                            {day.events.length === 0 ? (
                                                <p>No events</p>
                                            ) : (
                                                <ul>
                                                    {day.events.map(
                                                        (event, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="bg-gray-50 p-2 rounded-md my-2 max-w-40 text-wrap"
                                                            >
                                                                <p className="font-normal">
                                                                    {event.summary ||
                                                                        'No Title'}
                                                                </p>
                                                                <br />
                                                                <p className="font-light">
                                                                    {event.startDate.toLocaleTimeString()}{' '}
                                                                    -{' '}
                                                                    {event.endDate.toLocaleTimeString()}
                                                                </p>
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
        </>
    )
}

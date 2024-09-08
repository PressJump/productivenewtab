import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import ICAL from 'ical-expander'
import '../assets/styles.css'
import { SlSettings } from 'react-icons/sl'
import Searchbox from '../components/Searchbox'
import CalendarTable from 'components/CalendarTable'

const CalendarEvents = () => {
    const [events, setEvents] = useState<any[]>([])
    const [groupedEvents, setGroupedEvents] = useState<any[]>([])
    const [calendarURL, setCalendarURL] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchEngine, setSearchEngine] = useState('google')

    useEffect(() => {
        // Load the calendar URL from localStorage
        const storedURL = localStorage.getItem('calendarURL')
        if (storedURL) {
            setCalendarURL(storedURL)
        }
    }, [])

    const fetchCalendarEvents = async (url: string) => {
        try {
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

            const parsedEvents = [...mappedEvents, ...mappedOccurrences].sort(
                (a, b) => a.startDate - b.startDate
            )
            setEvents(parsedEvents)
        } catch (error) {
            console.error('Error fetching calendar events:', error)
        }
    }

    useEffect(() => {
        if (calendarURL) {
            fetchCalendarEvents(calendarURL)
        }
    }, [calendarURL])

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

    useEffect(() => {
        // Load the saved search engine from localStorage on component mount
        const savedSearchEngine = localStorage.getItem('searchEngine')
        if (savedSearchEngine) {
            setSearchEngine(savedSearchEngine)
        }
    }, [])

    const handleSearchEngineChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newSearchEngine = e.target.value
        setSearchEngine(newSearchEngine)
        // Save the selected search engine to localStorage
        localStorage.setItem('searchEngine', newSearchEngine)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            const query = encodeURIComponent(searchQuery)
            if (searchEngine === 'google') {
                window.location.href = `https://www.google.com/search?q=${query}`
            } else {
                window.location.href = `https://duckduckgo.com/?q=${query}`
            }
        }
    }

    const handleSetCalendarURL = () => {
        const newURL = window.prompt('Please enter your calendar URL:')
        if (newURL) {
            localStorage.setItem('calendarURL', newURL)
            setCalendarURL(newURL)
        }
    }

    return (
        <div className="p-4 w-full h-screen justify-center items-center flex flex-col">
            <div className="w-1/2">
                <div className="p-2">
                    <CalendarTable
                        groupedEvents={groupedEvents}
                        handleSetCalendarURL={handleSetCalendarURL}
                    />
                </div>

                <div className="w-full p-2 flex gap-2">
                    <select
                        className="py-3 z-30 ps-2 pe-4 block w-30 border-gray-200 bg-white rounded-lg border text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        value={searchEngine}
                        onChange={handleSearchEngineChange}
                    >
                        <option value="google">Google</option>
                        <option value="bing">DuckDuckGo</option>
                    </select>
                    <Searchbox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleKeyDown={handleKeyDown}
                    />
                </div>
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('display-container')!)
root.render(<CalendarEvents />)

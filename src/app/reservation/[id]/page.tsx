/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Navbar } from "@/app/components/Navbar"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

type providersType = {
    provider_id: number,
    provider_name: string,
    provider_phone: string,
    facility_id: string
}

type slotsType = {
    date: number,
    start: number
    end: number
    providers: Array<providersType>
}

type reservationType = {
    timeslot_start: number,
    timeslot_end: number,
    reservation_date: number,
    total_cost: number,
    facility_id: number,
    provider_id: number
    provider: providersType
    facility_type: string
    payment_done: boolean
    created_at: Date
}

function getDateToString(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export default function Reservation({ params }: { params: { id: string } }) {
    const serverUrl = 'http://localhost:8080/'
    const token = localStorage.getItem('ruralcompany')
    axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
    const router = useRouter()
    const [facilityCost, setFacilityCost] = useState(0)
    const [facilityType, setFacilityType] = useState('')
    const [slots, setSlots] = useState<slotsType[]>([])
    const [startDate, setStartDate] = useState(new Date());
    const [updating, setUpdating] = useState("Choose Slots")
    const [expandedSlot, setExpandedSlot] = useState<number | null>(null)
    const [chosenSlots, setChosenSlots] = useState<slotsType[]>([])
    const [reservations, setReservations] = useState<reservationType[]>([])
    const [showPopup, setShowPopup] = useState('hidden')
    const [canScroll, setCanScroll] = useState('')

    const handleStartDate = async (currDate: Date) => {
        const formattedDate = getDateToString(currDate) === getDateToString(new Date()) ? "" : getDateToString(currDate)
        setStartDate(currDate)
        setUpdating("Updating Slots")
        setChosenSlots([]) // Clear chosen slots when date is changed
        await axios.get(`${serverUrl}reservation/${params.id}?date=${formattedDate}`)
            .then((response) => { setSlots(response.data), setUpdating("Choose Slots") })
    }

    const handleSlotSelection = (slot: slotsType) => {
        setExpandedSlot(expandedSlot === slot.start ? null : slot.start)
        if (!chosenSlots.some(s => s.start === slot.start && s.date === slot.date)) {
            const filteredProviders = slot.providers.filter(p => !reservations.some(r => r.provider.provider_id === p.provider_id && r.reservation_date === slot.date && r.timeslot_start === slot.start))
            setChosenSlots([...chosenSlots, { ...slot, providers: filteredProviders }])
        }
    }

    const handleRemoveSlot = (start: number, date: number) => {
        setChosenSlots(chosenSlots.filter(slot => slot.start !== start || slot.date !== date))
        if (expandedSlot === start) {
            setExpandedSlot(null)
        }
    }

    const handleProviderClick = (slot: slotsType, provider: providersType) => {
        setReservations([...reservations,
            { reservation_date: slot.date, timeslot_start: slot.start, timeslot_end: slot.end,
                provider, provider_id: provider.provider_id, facility_id: parseInt(params.id),
                total_cost: facilityCost, facility_type: facilityType, payment_done: true, created_at: new Date()}])
        setChosenSlots(chosenSlots.map(s => {
            if (s.start === slot.start && s.date === slot.date) {
                return { ...s, providers: s.providers.filter(p => p.provider_id !== provider.provider_id) }
            }
            return s
        }))
    }

    const handleRandomProviderSelection = (slot: slotsType) => {
        if (slot.providers.length > 0) {
            const randomProvider = slot.providers[Math.floor(Math.random() * slot.providers.length)]
            handleProviderClick(slot, randomProvider)
        }
    }

    const handleRemoveReservation = (reservation: reservationType) => {
        setReservations(reservations.filter(r => r !== reservation))
        setChosenSlots(chosenSlots.map(slot => {
            if (slot.start === reservation.timeslot_start && slot.date === reservation.reservation_date) {
                return { ...slot, providers: [...slot.providers, reservation.provider] }
            }
            return slot
        }))
    }

    const handlePopupForReservations = () => {
        window.scrollTo(0, 0)
        setCanScroll('overflow-hidden')
        setShowPopup('block')
    }

    const handleMakingReservations = async (reservations: reservationType[]) => {
        const ruralCompanyCartItems = {
            items: reservations,
            exipry: new Date(Date.now() + 10 * 60 * 1000)
        }
        localStorage.setItem('ruralcompany_cart', JSON.stringify(ruralCompanyCartItems))
        router.push('/cart')
    }

    useEffect(() => {
        axios.get(`${serverUrl}reservation/${params.id}`).then((response) => { setSlots(response.data) })
        // console.log(`${serverUrl}facility/${params.id}`)
        axios.get(`${serverUrl}facility/${params.id}`).then((response) => {setFacilityCost(response.data.facility_cost); setFacilityType(response.data.facility_name)})
    }, [])

    return (
        <div className={canScroll}>
            <Navbar />
            <div className="flex flex-col gap-4 pt-10 items-center h-[calc(100vh-64px)]">
                <div className="text-xl">
                    {updating}:&nbsp;&nbsp;
                    {updating === "Updating Slots" ? "" :
                        <DatePicker minDate={new Date()} selected={startDate}
                            onChange={(date) => date && handleStartDate(date)} dateFormat={"dd-MM-yyyy"}
                            className="border-2 border-black text-center text-base rounded-md shadow-lg shadow-blue-300" />
                    }
                </div>
                <div className="grid lg:grid-cols-4 gap-4 sm:grid-cols-2">
                    {slots.length === 0 ? "Loading Slots..." :
                        slots.map((element) => {
                            return (
                                <div key={element.start + element.date} onClick={() => handleSlotSelection(element)} className={`border-2 border-black rounded-lg text-center
                                    shadow-lg shadow-green-300 p-2 w-60 cursor-pointer hover:bg-slate-100 hover:text-black ${chosenSlots.some(s => s.start === element.start && s.date === element.date) ? 'bg-green-400 text-white' : ''}`}>
                                    <div className="text-lg">{element.start}00hrs-{element.end}00hrs</div>
                                    <div>Date: {element.date}</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="text-xl">
                    {chosenSlots.length === 0 ? "" :
                    `Chosen Slots for ${getDateToString(startDate)}`
                    }
                </div>
                <div className="grid lg:grid-cols-4 gap-4 sm:grid-cols-2 items-center justify-center">
                    {chosenSlots.map(slot => (
                        <div key={slot.start + slot.date} className="flex flex-col border-2 shadow-lg shadow-blue-300 border-black rounded-lg text-center p-2">
                            <div className="font-bold text-xl">{slot.start}hrs-{slot.end}hrs</div>
                            <div className="text-lg">Date: {slot.date ? slot.date : getDateToString(new Date())}</div>
                            <div className="border-2 border-black rounded-lg">
                                {slot.providers.map((provider) => (
                                    <div key={provider.provider_id} onClick={() => handleProviderClick(slot, provider)} className="hover:text-blue-400 hover:bg-slate-100 hover:cursor-pointer">
                                        {provider.provider_name}
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleRemoveSlot(slot.start, slot.date)} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Remove Slot</button>
                            <button onClick={() => handleRandomProviderSelection(slot)} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Choose Random Provider</button>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center text-xl">
                    {reservations.length === 0 ? "" :
                    "Reservations: "
                    }
                    {reservations.length === 0 ? <div></div> :
                        <div>
                            <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={handlePopupForReservations}>
                                Confirm Booking
                            </button>
                        </div>
                    } 
                </div>
                <div className="grid lg:grid-cols-4 gap-4 sm:grid-cols-2 items-center justify-center pb-4">
                    {reservations.map((reservation, index) => (
                        <div key={index} className="border-2 border-black shadow-lg shadow-blue-300 rounded-lg text-center p-2">
                            <div className="text-lg font-bold">{reservation.timeslot_start}hrs-{reservation.timeslot_end}hrs</div>
                            <div>Date: {reservation.reservation_date}</div>
                            <div>Provider: <span className="text-blue-600">{reservation.provider.provider_name}</span></div>
                            <div className="text-lg font-bold">Cost: Rs {reservation.total_cost}</div>
                            <button onClick={() => handleRemoveReservation(reservation)} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Remove Reservation</button>
                        </div>
                    ))}
                </div>
                <div>
                    <div className={showPopup}>
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1>Confirmation Summary</h1>
                                </div>
                                <div>
                                    <p className="pb-2 pt-2">Are you sure you want to make the following reservations?</p>
                                    <ul className="grid lg:grid-cols-4 gap-4 sm:grid-cols-2 items-center justify-center">
                                    {reservations.map((reservation, index) => (
                                        <div key={index} className="border-2 border-black rounded-lg text-center p-2">
                                            <div className="text-lg font-bold">{reservation.timeslot_start}hrs-{reservation.timeslot_end}hrs</div>
                                            <div>Date: {reservation.reservation_date}</div>
                                            <div>Provider: <span className="text-blue-600">{reservation.provider.provider_name}</span></div>
                                            <div className="text-lg font-bold">Cost: Rs {reservation.total_cost}</div>
                                        </div>
                                    ))}
                                    </ul>
                                </div>
                                <div className="p-4">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white m-2 p-2 rounded-lg" onClick={() => {handleMakingReservations(reservations); setShowPopup('hidden')}}>Confirm</button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white m-2 p-2 rounded-lg" onClick={() => {setShowPopup('hidden'), setCanScroll('')}}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

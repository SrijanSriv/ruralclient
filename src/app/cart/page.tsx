'use client'
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import LoginSection from "../components/LoginSection";
import axios from 'axios';
import { useRouter } from "next/navigation";

type providersType = {
    provider_id: number,
    provider_name: string,
    provider_phone: string,
    facility_id: string
}

type reservationType = {
    timeslot_start: number,
    timeslot_end: number,
    reservation_date: number,
    total_cost: number,
    facility_id: number,
    provider_id: number
    provider: providersType,
    facility_type: string
    payment_done: boolean
    created_at: Date
}

export default function Cart() {
    const serverUrl = 'http://localhost:8080/'
    const [storedCart, setStoredCard] = useState({ items: [], expiry: "" });
    const [token, setToken] = useState("");
    const router = useRouter();

    const handleMakingReservations = async (reservations: reservationType[]) => {
        const reservationObjectArray = reservations.map(({ provider, facility_type, ...reservationData }: reservationType) => {
            reservationData.payment_done = true
            return reservationData
        })
        await axios.post(`${serverUrl}reservation`, reservationObjectArray)
        localStorage.removeItem('ruralcompany_cart')
        router.push('/myreservation')
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedItems = localStorage.getItem('ruralcompany_cart');
            const token = localStorage.getItem('ruralcompany')
            console.log(storedItems)
            if (storedItems) {
                setStoredCard(JSON.parse(storedItems));
            }
            if (token) {
                setToken(token);
                axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
            }
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className="flex">

                <div className="w-[50vw] h-[calc(100vh-64px)] flex justify-center items-center">
                    {token ?
                        <div className="flex flex-col gap-4 text-center p-4">
                            Welcome, back!
                        </div> :
                        <div>
                            <LoginSection destination="cart" />
                        </div>}
                </div>
                <div className="w-[50vw] h-[calc(100vh-64px)] flex justify-center items-center">
                    <div className="grid lg:grid-cols-3 gap-4 sm:grid-cols-1 pt-4 pr-4">
                        {storedCart?.items ? <div>{storedCart.items?.map((reservation: reservationType, index) => (
                            <div key={index} className="border-2 border-black rounded-lg text-center p-2">
                                <div className="text-lg font-bold">{reservation.timeslot_start}hrs-{reservation.timeslot_end}hrs</div>
                                <div>Date: {reservation.reservation_date}</div>
                                <div>Facility: {reservation.facility_type}</div>
                                <div>Provider: <span className="text-blue-600">{reservation.provider.provider_name}</span></div>
                                <div className="text-lg font-bold">Cost: Rs {reservation.total_cost}</div>
                            </div>
                        ))}
                            <button onClick={() => handleMakingReservations(storedCart.items)} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" >Click Me to Finish Payment</button>
                        </div>
                            : <div>
                                No items! Keep booking
                            </div>}
                    </div>
                </div>

            </div>
        </div>

    )
}
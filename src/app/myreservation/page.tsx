'use client'
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import LoginSection from "../components/LoginSection";
import axios from "axios";

type reservationType = {
    timeslot_start: number,
    timeslot_end: number,
    reservation_date: number,
    total_cost: number,
    facility_id: number,
    provider_id: number
    facility_type: string
    payment_done: boolean
    created_at: Date
}

export default function MyReservation() {
    const access_token = localStorage.getItem('ruralcompany');
    const serverUrl = 'http://localhost:8080/'
    axios.defaults.headers.common = {'Authorization': `bearer ${access_token}`}
    const [token, setToken] = useState("");
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('ruralcompany');
            if (token) {
                setToken(token);
            }
        }
        axios.get(`${serverUrl}user/reservation`).then((response) => {
            setReservations(response.data);
        })
    }, []);

    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                {token ?
                <div>
                    My Reservations
                    <div>
                        {reservations.map((reservation: reservationType, index) => (
                            <div key={index} className="border-2 border-black rounded-lg text-center p-2">
                                <div className="text-lg font-bold">{reservation.timeslot_start}hrs-{reservation.timeslot_end}hrs</div>
                                <div>Date: {reservation.reservation_date}</div>
                                <div>Facility: {reservation.facility_type}</div>
                                <div className="text-lg font-bold">Cost: Rs {reservation.total_cost}</div>
                            </div>
                        ))}
                    </div>
                </div> : <div>
                    Please login to view your reservations
                    <LoginSection destination="myreservation" />
                </div>}
            </div>
        </div>
    )
}
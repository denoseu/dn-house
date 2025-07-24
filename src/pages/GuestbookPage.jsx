import React, { useEffect, useState } from "react";
import { fetchGuestbook } from "../api/guestbook";
import Navbar from "../components/Navbar";

const GuestbookPage = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadGuestbook() {
            setLoading(true);
            setError("");
            try {
                const data = await fetchGuestbook();
                // log
                console.log("Guestbook entries fetched:", data.entries);
                setEntries(Array.isArray(data.entries) ? data.entries : []);
            } catch (err) {
                setError("Failed to load guestbook. Please try again!");
            }
            setLoading(false);
        }
        loadGuestbook();
    }, []);

    return (
        <>
            <title>Guestbook</title>
            <Navbar />
            <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 p-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-louis text-center text-black mb-6 mt-4 drop-shadow-lg">
                        Our Cute Guestbook!
                    </h1>
                    <p className="text-center text-lg text-gray-700 font-louis mb-8">
                        See what our lovely guests wrote for us 💌
                    </p>
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-10 h-10 border-4 border-pink-300 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-4 text-pink-500 font-louis text-xl">Loading...</span>
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-500 font-louis font-bold mb-6">{error}</div>
                    )}
                    {!loading && !error && entries.length === 0 && (
                        <div className="text-center text-gray-500 font-louis text-lg mt-12">
                            No entries yet. Be the first to write a letter!
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
                        {entries.map((entry, idx) => (
                            <div
                                key={entry._id || idx}
                                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-4 border-pink-200 hover:border-yellow-300 transition-all duration-200 w-full max-w-xs relative"
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl">
                                    {["🐱", "🌸", "🍰", "🦄", "💌"][idx % 5]}
                                </div>
                                <div className="font-bold text-pink-700 text-lg mb-2 text-center font-louis">
                                    {entry.subject || "No Subject"}
                                </div>
                                <div className="text-gray-800 mb-3 text-center font-louis text-base">
                                    {entry.message}
                                </div>
                                <div className="text-xs text-blue-500 font-louis mt-2 text-center w-full">
                                    — {entry.from || "Anonymous"}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <span className="bg-yellow-100 px-2 py-1 rounded-full text-xs text-yellow-700 font-louis">💖</span>
                                    <span className="bg-pink-100 px-2 py-1 rounded-full text-xs text-pink-700 font-louis">✨</span>
                                    <span className="bg-blue-100 px-2 py-1 rounded-full text-xs text-blue-700 font-louis">🌈</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default GuestbookPage;
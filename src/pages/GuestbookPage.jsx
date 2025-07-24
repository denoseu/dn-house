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
            <div className="min-h-[calc(100vh-80px)] bg-white p-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-louis text-center text-black mb-6 mt-4 font-bold">
                        The Guestbook
                    </h1>
                    <p className="text-center text-lg md:text-xl text-gray-700 font-louis mb-20">
                        See what our lovely guests wrote for us!
                    </p>
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-4 text-gray-700 font-louis text-xl">Loading...</span>
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-500 font-louis font-bold mb-6">{error}</div>
                    )}
                    {!loading && !error && entries.length === 0 && (
                        <div className="text-center text-gray-400 font-louis text-lg mt-12">
                            No entries yet. Be the first to write a letter!
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 justify-items-center">
                        {entries.map((entry, idx) => (
                            <div
                                key={entry._id || idx}
                                className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center border-4 border-gray-200 hover:border-black transition-all duration-200 w-full max-w-xs relative"
                            >
                                <img
                                    src="images/head-icon.png"
                                    alt="Guestbook Icon"
                                    className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 object-contain bg-gray-200 rounded-full border-2 border-gray-300 shadow"
                                    style={{ background: "#e5e7eb" }}
                                />
                                <div className="font-bold text-black text-lg mb-2 text-center font-louis mt-8">
                                    {entry.subject || "No Subject"}
                                </div>
                                <div className="text-gray-800 mb-3 text-center font-louis text-base">
                                    &quot;{entry.message}&quot;
                                </div>
                                <div className="text-xs text-gray-500 font-louis mt-2 text-center w-full">
                                    — {entry.from || "Anonymous"}
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
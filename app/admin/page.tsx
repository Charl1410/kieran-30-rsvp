"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Guest = {
  id: number;
  name: string;
  email: string;
  rsvp_status: string;
  plus_one_name: string;
  dietary_notes: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState("");

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthed(true);
    } else {
      alert("Wrong password");
    }
  };

  useEffect(() => {
    if (!isAuthed) return;

    const fetchGuests = async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setGuests(data || []);
      }
    };

    fetchGuests();
  }, [isAuthed]);

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8 text-black">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-black">
          <h1 className="text-3xl font-bold mb-4">Admin Login</h1>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4 text-black"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white rounded-lg p-3"
          >
            Log in
          </button>
        </div>
      </main>
    );
  }

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(search.toLowerCase())
  );

  const yesCount = guests.filter((g) => g.rsvp_status === "yes").length;
  const noCount = guests.filter((g) => g.rsvp_status === "no").length;
  const maybeCount = guests.filter((g) => g.rsvp_status === "maybe").length;

  const attendingGuests = guests.filter((g) => g.rsvp_status === "yes");
  const plusOneCount = attendingGuests.filter((g) =>
    Boolean(g.plus_one_name?.trim())
  ).length;
  const totalGuestCount = attendingGuests.length + plusOneCount;

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <h1 className="text-4xl font-bold mb-2">RSVP Dashboard</h1>

      <p className="text-gray-700 mb-8">
        Manage birthday party responses.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow text-black">
          <p className="text-gray-600 text-sm">RSVPs</p>
          <p className="text-3xl font-bold">{guests.length}</p>
          <p className="text-xs text-gray-500 mt-1">Form responses</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow text-black">
          <p className="text-gray-600 text-sm">Yes</p>
          <p className="text-3xl font-bold">{yesCount}</p>
          <p className="text-xs text-gray-500 mt-1">Attending</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow text-black">
          <p className="text-gray-600 text-sm">No</p>
          <p className="text-3xl font-bold">{noCount}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow text-black">
          <p className="text-gray-600 text-sm">Maybe</p>
          <p className="text-3xl font-bold">{maybeCount}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow text-black">
          <p className="text-gray-600 text-sm">Plus ones</p>
          <p className="text-3xl font-bold">{plusOneCount}</p>
          <p className="text-xs text-gray-500 mt-1">With attending guests</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow text-black ring-2 ring-black/10">
          <p className="text-gray-600 text-sm">Total guests</p>
          <p className="text-3xl font-bold">{totalGuestCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            {yesCount} attending + {plusOneCount} plus ones
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search guests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-4 rounded-xl border bg-white text-black placeholder:text-gray-500"
      />

      <div className="grid gap-4">
        {filteredGuests.map((guest) => (
          <div key={guest.id} className="bg-white p-6 rounded-xl shadow text-black">
            <div className="flex justify-between gap-4">
              <h2 className="text-2xl font-semibold">{guest.name}</h2>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-black">
                {guest.rsvp_status}
              </span>
            </div>

            {guest.email && <p className="mt-2 text-gray-800">Email: {guest.email}</p>}
            {guest.plus_one_name?.trim() && (
              <p className="mt-2 text-gray-800">Plus one: {guest.plus_one_name}</p>
            )}
            {guest.dietary_notes && <p className="mt-2 text-gray-800">Dietary notes: {guest.dietary_notes}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
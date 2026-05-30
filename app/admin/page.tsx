"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Guest = {
  id: number;
  name: string;
  rsvp_status: string;
  plus_one_name: string;
  dietary_notes: string;
};

const statusPillClass: Record<string, string> = {
  yes: "bg-emerald-100 text-emerald-800",
  maybe: "bg-amber-100 text-amber-900",
  no: "bg-red-100 text-red-800",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const handleDelete = async (guest: Guest) => {
    const confirmed = window.confirm(
      `Delete RSVP for "${guest.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(guest.id);

    const { error } = await supabase.from("guests").delete().eq("id", guest.id);

    if (error) {
      console.error(error);
      alert("Could not delete this RSVP. Please try again.");
    } else {
      setGuests((current) => current.filter((g) => g.id !== guest.id));
    }

    setDeletingId(null);
  };

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

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full min-w-[520px] text-left text-sm text-black">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Plus one</th>
              <th className="px-4 py-3 font-medium">Dietary</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No guests match your search.
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr
                  key={guest.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-2.5 font-semibold whitespace-nowrap">
                    {guest.name}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        statusPillClass[guest.rsvp_status] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {guest.rsvp_status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-700">
                    {guest.plus_one_name?.trim() || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-gray-700 max-w-xs truncate" title={guest.dietary_notes || undefined}>
                    {guest.dietary_notes || "—"}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDelete(guest)}
                      disabled={deletingId === guest.id}
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === guest.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RSVPForm() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("yes");
  const [plusOneName, setPlusOneName] = useState("");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const { error } = await supabase.from("guests").insert([
      {
        name,
        rsvp_status: status,
        plus_one_name: plusOneName,
        dietary_notes: dietaryNotes,
        invite_code: crypto.randomUUID(),
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } else {
      setMessage("Thank you — your RSVP has been received.");
      setName("");
      setStatus("yes");
      setPlusOneName("");
      setDietaryNotes("");
    }
  };

  return (
    <div className="w-full max-w-lg text-center">
      <div className="invite-double-border">
        <div className="invite-double-border-inner relative overflow-hidden px-8 py-10 sm:px-10 sm:py-12">
          <p
            className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 font-[family-name:var(--font-cinzel)] text-[7.5rem] font-bold leading-none text-[#8b6914]/20 select-none sm:text-[9rem]"
            aria-hidden
          >
            30
          </p>

          <div className="relative z-10">
            <p className="h-20 font-[family-name:var(--font-great-vibes)] text-6xl leading-none gold-gradient-text sm:text-7xl">
              thirty
            </p>

            <h1 className="mt-2 font-[family-name:var(--font-cinzel)] text-xl font-semibold tracking-[0.35em] text-gold sm:text-2xl">
              KIERAN&apos;S BIRTHDAY
            </h1>

            <p className="m-10 text-[1rem] font-light tracking-[0.28em] text-white/90 uppercase">
              You are invited to celebrate
            </p>


            <div className="flex items-stretch justify-center gap-0 text-[0.65rem] tracking-[0.22em] text-white/95 uppercase">
              <div className="flex flex-1 items-center justify-center border-r border-gold/40 px-2 py-3">
                Saturday
              </div>
              <div className="flex flex-1 flex-col items-center justify-center border-r border-gold/40 px-2 py-3 leading-relaxed">
                <span>July </span>
                <span className="font-bold text-[1.5rem]">18</span>
                <span>2026</span>
              </div>
              <div className="flex flex-1 items-center justify-center px-2 py-3">
                6 &apos;o clock
              </div>
            </div>


            <p className="mt-8 text-[1 rem] tracking-[0.28em] text-white/80 uppercase">
              Please RSVP below
            </p>
            <p className="text-xs mt-2 mb-8 text-white/80"> Please leave fields blank if not applicable</p>

            <div className="space-y-1 text-left">
              <input
                className="rsvp-field"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                className="rsvp-field cursor-pointer appearance-none bg-transparent"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="yes">Attending</option>
                <option value="no">Unable to attend</option>
                <option value="maybe">Not sure yet</option>
              </select>

              <input
                className="rsvp-field"
                placeholder="Plus one name"
                value={plusOneName}
                onChange={(e) => setPlusOneName(e.target.value)}
              />

              <textarea
                className="rsvp-field rsvp-textarea"
                placeholder="Dietary requirements"
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-8 w-full rounded-xl gold-gradient px-6 py-3.5 font-[family-name:var(--font-cinzel)] text-sm font-semibold tracking-[0.25em] text-navy uppercase transition hover:brightness-110 active:scale-[0.99]"
            >
              Submit RSVP
            </button>

            {message && (
              <p
                className={`mt-5 text-xs tracking-[0.15em] uppercase ${
                  message.includes("wrong")
                    ? "text-red-300/90"
                    : "text-gold-light"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

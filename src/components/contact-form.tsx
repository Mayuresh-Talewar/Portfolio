"use client";

import { useState, type FormEvent } from "react";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

type Status = "idle" | "sending" | "sent" | "error";
type Field = "name" | "email" | "message";

const FIELDS: { name: Field; label: string; type?: string; autoComplete: string; minLength?: number }[] = [
  { name: "name", label: "Name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "message", label: "Message", autoComplete: "off", minLength: 10 },
];

/** EmailJS REST (no SDK). Falls back to mailto when env keys are missing. */
export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return (
      <p>
        Email me at <a className="font-semibold underline" href={`mailto:${email}`}>{email}</a>
      </p>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const next: Partial<Record<Field, string>> = {};
    for (const f of FIELDS) {
      const el = form.elements.namedItem(f.name) as HTMLInputElement | HTMLTextAreaElement;
      // Don't write el.value back: a script-set value disables the browser's minLength (tooShort) check.
      const min = f.minLength ?? 1;
      if (!el.checkValidity()) next[f.name] = el.validationMessage;
      else if (el.value.trim().length < min)
        next[f.name] = min > 1 ? `Please enter at least ${min} characters.` : "Please fill out this field.";
    }
    setErrors(next);
    const firstInvalid = FIELDS.find((f) => next[f.name]);
    if (firstInvalid) return (form.elements.namedItem(firstInvalid.name) as HTMLElement).focus();

    // Honeypot: bots fill the hidden field; pretend success and send nothing.
    if (data.get("company")) return setStatus("sent");

    setStatus("sending");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          // Param names match the existing EmailJS template from the old site.
          template_params: {
            firstname: data.get("name"),
            lastname: "",
            phone: "",
            email: data.get("email"),
            message: data.get("message"),
          },
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      {FIELDS.map((f) => {
        const err = errors[f.name];
        const common = {
          id: `contact-${f.name}`,
          name: f.name,
          required: true,
          autoComplete: f.autoComplete,
          minLength: f.minLength,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `contact-${f.name}-error` : undefined,
          className: "w-full border border-current/40 bg-transparent p-2",
        };
        return (
          <div key={f.name} className="flex flex-col gap-1">
            <label htmlFor={common.id} className="font-semibold">
              {f.label}
            </label>
            {f.name === "message" ? <textarea rows={5} {...common} /> : <input type={f.type ?? "text"} {...common} />}
            {err && (
              <p id={`contact-${f.name}-error`} className="text-sm text-red-700">
                {err}
              </p>
            )}
          </div>
        );
      })}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        type="submit"
        data-guide-target
        disabled={status === "sending"}
        className="self-start border-2 border-current px-5 py-2 font-bold disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
      <p role="status" aria-live="polite">
        {status === "sent" && "Message sent. Thanks, I'll reply soon."}
        {status === "error" && (
          <>
            Couldn&apos;t send. Email me directly at{" "}
            <a className="underline" href={`mailto:${email}`}>
              {email}
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}

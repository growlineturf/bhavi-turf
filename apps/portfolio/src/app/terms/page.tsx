"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTurf } from "@/lib/turfStore";
import { ShieldCheck, AlertTriangle, CreditCard, XCircle, Phone, Lock, FileText, Scale } from "lucide-react";

function Section({ icon: Icon, title, children }: {
  icon: React.ElementType; title: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-2.5 text-lg font-black text-white border-b border-zinc-800 pb-3">
        <Icon className="h-5 w-5 text-blue-400 shrink-0" />
        {title}
      </h2>
      <div className="text-sm text-zinc-400 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function TermsPage() {
  const { config } = useTurf();
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-14 space-y-10">

        {/* Header */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Legal</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Terms & Conditions</h1>
          <p className="text-sm text-zinc-400">
            Effective Date: <span className="text-white font-semibold">{today}</span> &nbsp;|&nbsp;
            Operated by: <span className="text-white font-semibold">{config.turfName}</span>,&nbsp;
            {config.city}
          </p>
          <div className="bg-blue-900/20 border border-blue-700/40 rounded-2xl p-4 text-sm text-blue-300">
            By booking a slot or providing your personal details on this website, you confirm that you have read,
            understood, and agreed to these Terms & Conditions and our Privacy Policy.
          </div>
        </div>

        {/* 1 */}
        <Section icon={FileText} title="1. About Us">
          <p>
            <strong className="text-white">{config.turfName}</strong> is an indoor cricket turf facility located at
            {" "}{config.city}. We operate an online slot-booking platform through this website to allow customers to
            reserve turf time, make advance payments, and receive booking confirmations via WhatsApp.
          </p>
          <p>
            For any queries, contact us on WhatsApp at{" "}
            <a href={`https://wa.me/${config.whatsappNumber}`} className="text-blue-400 hover:underline">
              +91 {config.gpayNumber}
            </a>.
          </p>
        </Section>

        {/* 2 */}
        <Section icon={Lock} title="2. Information We Collect & Why">
          <p>When you make a booking, we collect the following personal information:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-white">Full Name</strong> — to identify and address you for your booking</li>
            <li><strong className="text-white">Mobile Phone Number</strong> — to send your booking confirmation via WhatsApp and to contact you in case of slot changes or cancellations</li>
            <li><strong className="text-white">Booking Details</strong> — date, time slot, sport type, and amount paid — to process your reservation</li>
          </ul>
          <p className="mt-2">
            We do <strong className="text-white">not</strong> collect passwords, email addresses, Aadhaar, PAN,
            bank account numbers, or any sensitive financial information. All UPI/GPay payments are handled
            directly through Google Pay's secure infrastructure.
          </p>
          <p>
            This data is collected under the authority of the{" "}
            <strong className="text-white">Information Technology Act, 2000</strong> (India) and its amendment act of 2008.
            By submitting your details, you provide free, explicit, and informed consent for their collection and use
            as described herein.
          </p>
        </Section>

        {/* 3 */}
        <Section icon={ShieldCheck} title="3. How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To confirm, manage, and communicate your turf booking via WhatsApp</li>
            <li>To process and verify your advance payment</li>
            <li>To maintain internal booking records for administrative purposes</li>
            <li>To contact you in case of schedule changes, cancellations, or operational announcements</li>
          </ul>
          <p className="mt-2 font-semibold text-white">We will never:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Sell, rent, or trade your personal data to any third party</li>
            <li>Use your phone number to send unsolicited promotional messages (spam)</li>
            <li>Share your information with advertisers or data brokers</li>
          </ul>
        </Section>

        {/* 4 */}
        <Section icon={CreditCard} title="4. Booking & Payment Terms">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Advance Payment:</strong> An advance of{" "}
              <strong className="text-blue-400">₹{config.advanceAmount}</strong> is required to confirm your booking.
              This amount must be paid via GPay/UPI to the number shown during checkout.
            </li>
            <li>
              <strong className="text-white">Confirmation:</strong> Your booking is confirmed only after you send the
              payment screenshot to our WhatsApp and receive a confirmation message from us.
            </li>
            <li>
              <strong className="text-white">Remaining Amount:</strong> The balance amount must be paid in full at the
              venue before your session begins.
            </li>
            <li>
              <strong className="text-white">Slot Expiry:</strong> Unpaid or unconfirmed bookings expire automatically
              after a set time period and the slot becomes available for others.
            </li>
            <li>
              <strong className="text-white">5 Over (30 Balls) Sessions:</strong> The ₹100 fixed session fee must be
              paid in full via GPay before arrival. No balance is due at the venue.
            </li>
          </ul>
        </Section>

        {/* 5 */}
        <Section icon={XCircle} title="5. Cancellation & Refund Policy">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Cancellation by Customer:</strong> If you wish to cancel a confirmed booking,
              contact us on WhatsApp at least <strong className="text-white">24 hours before</strong> your slot.
              Cancellations made with sufficient notice may be eligible for a slot reschedule at management's discretion.
            </li>
            <li>
              <strong className="text-white">Advance Refunds:</strong> Advance payments are generally{" "}
              <strong className="text-red-400">non-refundable</strong> unless the cancellation is initiated by{" "}
              {config.turfName} (e.g., facility maintenance, unforeseen closure).
            </li>
            <li>
              <strong className="text-white">Cancellation by Turf:</strong> In the rare event we must cancel your slot
              due to operational reasons, we will notify you via WhatsApp and offer a full refund or reschedule.
            </li>
            <li>
              <strong className="text-white">No-Shows:</strong> Customers who do not show up for their booked slot
              without prior notice forfeit their advance payment.
            </li>
          </ul>
        </Section>

        {/* 6 */}
        <Section icon={AlertTriangle} title="6. Code of Conduct & Facility Rules">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Players must follow all ground rules displayed at the facility</li>
            <li>Spikes, outside food, smoking, and alcohol are strictly prohibited inside the turf</li>
            <li>Any damage caused to turf equipment, nets, or pitch by a customer will be billed to the responsible party</li>
            <li>Management reserves the right to refuse entry or terminate a session for misconduct</li>
            <li>Children under 10 must be accompanied by an adult at all times</li>
            <li>{config.turfName} is not responsible for personal injuries arising from gameplay — play at your own risk</li>
          </ul>
        </Section>

        {/* 7 */}
        <Section icon={Lock} title="7. Data Retention & Deletion">
          <p>
            We retain your booking data (name, phone, slot details) for a period of up to{" "}
            <strong className="text-white">12 months</strong> from the date of booking for record-keeping and
            dispute resolution purposes.
          </p>
          <p>
            You may request deletion of your personal data at any time by contacting us on WhatsApp at{" "}
            <a href={`https://wa.me/${config.whatsappNumber}`} className="text-blue-400 hover:underline">
              +91 {config.gpayNumber}
            </a>. We will process your request within 7 business days.
          </p>
        </Section>

        {/* 8 */}
        <Section icon={Phone} title="8. Third-Party Services">
          <p>This website uses the following third-party services, each governed by their own privacy policies:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-white">Google Pay (GPay / UPI)</strong> — for processing advance payments</li>
            <li><strong className="text-white">WhatsApp (Meta)</strong> — for sending booking confirmations</li>
            <li><strong className="text-white">Neon (PostgreSQL)</strong> — for secure cloud database storage of booking records</li>
          </ul>
          <p className="mt-1">
            {config.turfName} is not responsible for the privacy practices of these third-party platforms.
          </p>
        </Section>

        {/* 9 */}
        <Section icon={Scale} title="9. Governing Law & Jurisdiction">
          <p>
            These Terms & Conditions are governed by the laws of <strong className="text-white">India</strong>,
            including but not limited to the{" "}
            <strong className="text-white">Information Technology Act, 2000</strong>,
            the <strong className="text-white">Consumer Protection Act, 2019</strong>, and applicable
            regulations of the <strong className="text-white">State of Tamil Nadu</strong>.
          </p>
          <p>
            Any disputes arising from these terms or the use of this website shall be subject to the exclusive
            jurisdiction of courts in <strong className="text-white">Neyveli, Tamil Nadu, India</strong>.
          </p>
        </Section>

        {/* 10 */}
        <Section icon={FileText} title="10. Changes to These Terms">
          <p>
            {config.turfName} reserves the right to update or modify these Terms & Conditions at any time.
            Changes will be effective immediately upon posting to this page. Continued use of our booking platform
            after any changes constitutes your acceptance of the updated terms.
          </p>
          <p>
            We recommend reviewing this page periodically. The effective date at the top of this page reflects
            the most recent update.
          </p>
        </Section>

        {/* Contact */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-black text-white">Questions or Concerns?</h3>
          <p className="text-sm text-zinc-400">
            If you have any questions about these Terms & Conditions, or wish to exercise your data rights,
            please reach out to us directly:
          </p>
          <div className="space-y-1.5 text-sm">
            <p className="text-white font-bold">{config.turfName}</p>
            <p className="text-zinc-400">📍 Main Road, {config.city}</p>
            <a href={`https://wa.me/${config.whatsappNumber}`}
              className="flex items-center gap-2 text-blue-400 hover:underline">
              📱 WhatsApp: +91 {config.gpayNumber}
            </a>
          </div>
        </div>

        <p className="text-xs text-zinc-600 text-center">
          © {new Date().getFullYear()} {config.turfName}. All rights reserved. &nbsp;|&nbsp;
          <Link href="/" className="hover:text-zinc-400 transition">Back to Home</Link>
        </p>

      </div>
      <Footer />
    </div>
  );
}

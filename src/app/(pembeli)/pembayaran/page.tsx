"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PaymentPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(900); 
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  // Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          router.push("/payment-timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload proof of payment.");
      return;
    }
    console.log("Submitted image:", image);
    router.push("/payment-success");
  };

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center p-4 sm:p-6">
      <div className="container mx-auto max-w-5xl flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Countdown Timer */}
        <section className="w-full md:w-1/2 bg-white rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            Complete Your Payment
          </h2>
          <div className="text-4xl sm:text-5xl font-mono text-blue-700 font-semibold tracking-widest">
            {formatTime(timeLeft)}
          </div>
          <p className="text-gray-600 mt-4 text-sm sm:text-base text-center max-w-xs leading-relaxed">
            Transfer the payment within the time limit to secure your order.
          </p>
        </section>

        {/* Payment Details, Upload, Submit */}
        <section className="w-full md:w-1/2 bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            Payment Information
          </h2>

          {/* Bank Details */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Bank Transfer Details
            </h3>
            <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>Bank:</strong> Bank Central Asia (BCA)
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>Account Number:</strong> 1234-5678-9012-3456
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>Account Holder:</strong> Reusemart Indonesia
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>Amount:</strong> Rp 1,500,000
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Upload Proof of Payment
            </h3>
            <label className="block">
              <span className="sr-only">Choose file</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2.5 file:px-4 sm:file:px-6
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-100 file:text-blue-800
                  hover:file:bg-blue-200 transition-colors duration-300"
              />
            </label>
            {preview && (
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Payment proof preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover border border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-medium
              hover:bg-blue-800 transition-colors duration-300 text-sm sm:text-base"
          >
            Submit Payment Proof
          </button>
        </section>
      </div>
    </div>
  );
};

export default PaymentPage;

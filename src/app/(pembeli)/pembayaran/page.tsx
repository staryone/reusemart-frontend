"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PaymentPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(60); 
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
    <div className="w-full p-4 bg-gray-100 min-h-screen pt-16 mt-10 px-10 flex justify-center">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row lg:space-x-6">
        {/* Countdown Timer */}
        <section className="w-full lg:w-1/2 bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Your Payment
          </h2>
          <div className="text-4xl font-mono text-gray-900 font-semibold">
            {formatTime(timeLeft)}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center max-w-xs">
            Transfer the payment within the time limit to secure your order.
          </p>
        </section>

        {/* Payment Details, Upload, Submit */}
        <section className="w-full lg:w-1/2 bg-white p-4 rounded-lg shadow mt-6 lg:mt-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Information
          </h2>

          {/* Bank Details */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Bank Transfer Details
            </h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Bank:</strong> Bank Central Asia (BCA)
              </p>
              <p className="text-sm text-gray-600">
                <strong>Account Number:</strong> 1234-5678-9012-3456
              </p>
              <p className="text-sm text-gray-600">
                <strong>Account Holder:</strong> Reusemart Indonesia
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong> Rp 1,500,000
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Upload Proof of Payment
            </h3>
            <label className="block">
              <span className="sr-only">Choose file</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-[#72C678] file:text-white
                  hover:file:bg-[#5da060] transition-colors duration-300"
              />
            </label>
            {preview && (
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Payment proof preview"
                  width={80}
                  height={80}
                  className="rounded-lg object-cover border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#72C678] text-white py-3 rounded-lg font-semibold hover:bg-[#5da060] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit Payment Proof
          </button>
        </section>
      </div>
    </div>
  );
};

export default PaymentPage;

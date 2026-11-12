'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Camera, Upload, Check, AlertCircle, ShieldCheck, X, User, Loader2 } from 'lucide-react';

export default function ProfilePhotoModal({ isOpen, onClose, onPhotoUpdated }) {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 5MB.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (uploading || !selectedFile || !user) return;
    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Upload to Clerk user profile
      await user.setProfileImage({ file: selectedFile });
      
      // Reload user data to get fresh CDN image URL
      await user.reload();
      const updatedUrl = user.imageUrl;

      // 2. Persist to Supabase profiles table
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: updatedUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update avatar in database.');
      }

      setSuccessMsg('Your personal portrait was uploaded successfully!');
      if (onPhotoUpdated) onPhotoUpdated(updatedUrl);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('[RentBridge Photo Upload Error]:', err);
      setErrorMsg(err.message || 'Failed to upload photo. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E8DFC8] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8F8372] hover:text-[#151816] hover:bg-[#F5EFEB] transition-all cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2ED] text-[#2D5A43] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Identity Trust & Verification</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#151816]">
            Upload Personal Photo
          </h3>
          <p className="text-xs text-[#8F8372]">
            Help prospective tenants and custodians recognize you during viewing handshakes.
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-[#EBF2ED] border border-[#2D5A43] text-[#1E3F2F] text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-[#2D5A43] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Portrait Preview Box */}
        <div className="flex flex-col items-center justify-center space-y-3 py-2">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full ring-4 ring-[#2D5A43]/20 overflow-hidden bg-[#F5EFEB] flex items-center justify-center shadow-inner">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Personal Portrait"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-[#8F8372]" />
              )}
            </div>
            
            <label
              htmlFor="personal-photo-input"
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[#2D5A43] text-white hover:bg-[#1E3F2F] shadow-md transition-all cursor-pointer">
              <Camera className="w-4 h-4" />
            </label>
          </div>

          <input
            id="personal-photo-input"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-[11px] text-[#8F8372] text-center max-w-xs">
            JPG, PNG or WebP under 5MB. Click the camera icon or button below to choose a picture.
          </p>
        </div>

        {/* Strict Nigerian Anti-Agent Guidelines */}
        <div className="p-3.5 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] space-y-1.5 text-xs text-[#4B524D]">
          <p className="font-bold text-[#151816] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
            <span>Photo Verification Standards:</span>
          </p>
          <ul className="text-[11px] space-y-1 list-disc pl-4 text-[#8F8372]">
            <li>Must be a clear headshot or portrait of your real face.</li>
            <li>Agency logos, cartoons, flyers, or building photos are strictly rejected.</li>
            <li>Your photo helps security confirm your viewing appointment at compound gates.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <label
            htmlFor="personal-photo-input"
            className="flex-1 py-3 px-4 rounded-xl border border-[#E8DFC8] bg-white hover:bg-[#F5EFEB] text-xs font-bold text-[#151816] flex items-center justify-center gap-2 transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-[#2D5A43]" />
            <span>Select Photo</span>
          </label>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              !selectedFile || uploading
                ? 'bg-[#E8DFC8] text-[#8F8372] cursor-not-allowed'
                : 'bg-[#2D5A43] hover:bg-[#1E3F2F] text-white'
            }`}>
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#8AE0B3]" />
                <span>Transmitting to Database...</span>
              </>
            ) : (
              <span>Save & Verify</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


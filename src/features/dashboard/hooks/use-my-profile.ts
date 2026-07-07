"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const defaultProfile: MyProfile = {
  name: "Leo Denzin",
  userId: "10000008",
  gender: "Male",
  school: "ABC School",
  city: "Phoenix",
  dateOfBirth: "11/27/2000",
  email: "designer@dignitestudios.com",
  division: "U18",
  grade: "4",
  avatarUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  currentRating: 1650,
  enrolledTournaments: 6,
  historyScore: "7/10",
  parent: {
    name: "Derek Boyles",
    email: "Derek Boyles@gmail.com",
    phone: "0321-2589-011",
  },
};

export function useMyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MyProfile>({
    ...defaultProfile,
    avatarUrl: user?.image || defaultProfile.avatarUrl,
  });
  const [isEditOpen, setIsEditOpen] = useState(false);

  function openEditProfile() {
    setIsEditOpen(true);
  }

  function closeEditProfile() {
    setIsEditOpen(false);
  }

  function saveProfile(values: EditProfileFields) {
    setProfile((prev) => ({
      ...prev,
      name: values.fullName,
      email: values.email,
      division: values.division,
      grade: values.grade,
      parent: {
        name: values.parentFullName,
        email: values.parentEmail,
        phone: values.parentPhone,
      },
    }));
  }

  return {
    profile,
    isEditOpen,
    openEditProfile,
    closeEditProfile,
    saveProfile,
  };
}

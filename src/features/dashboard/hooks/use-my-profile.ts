"use client";

import { useState } from "react";
import { useAuthUserQuery, useUpdateProfileMutation } from "@/features/auth/api/auth.queries";
import { getPresignedUrl } from "@/features/auth/api/auth.service";
import { showApiSuccessToast, showApiErrorToast } from "@/lib/api-toast";

export function useMyProfile() {
  const { data, isPending } = useAuthUserQuery();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const user = data?.data?.user;
  const playerProfile = data?.data?.playerProfile;
  const upcomingCount = data?.data?.upcomingTournamentCount || 0;
  console.log(user)
  // Extract parent - prefer primary, otherwise fallback
  const parentObj = playerProfile?.parents;
  const mother = parentObj?.mother;
  const father = parentObj?.father;
  const parent = mother?.isPrimary ? mother : (father || mother);

  const profile: MyProfile = {
    name: user?.name || "N/A",
    userId: playerProfile?.membershipId || user?._id || "N/A",
    gender: playerProfile?.gender || "N/A",
    school: playerProfile?.school || "N/A",
    city: playerProfile?.city || "N/A",
    dateOfBirth: playerProfile?.dob
      ? new Date(playerProfile.dob).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
      : "N/A",
    email: user?.email || "N/A",
    division: playerProfile?.division || "N/A",
    grade: playerProfile?.grade || "N/A",
    avatarUrl:
      user?.profileImage ||
      "/images/images.png",
    currentRating: playerProfile?.rating || 0,
    enrolledTournaments: upcomingCount,
    historyScore: `${playerProfile?.totalWins || 0}/${playerProfile?.totalTournaments || 0}`,
    parent: {
      name: parent?.name || "N/A",
      email: parent?.email || "N/A",
      phone: parent?.phone || "N/A",
    },
  };

  function openEditProfile() {
    setIsEditOpen(true);
  }

  function closeEditProfile() {
    setIsEditOpen(false);
  }

  const { mutateAsync: updateProfile, isPending: isMutationPending } = useUpdateProfileMutation();
  const [isUploading, setIsUploading] = useState(false);

  const isUpdating = isMutationPending || isUploading;

  async function saveProfile(values: EditProfileFields) {
    try {
      let profileImageUrl = undefined;

      if (values.profileImage && values.profileImage instanceof File) {
        setIsUploading(true);
        const presignedResponse = await getPresignedUrl({
          fileName: values.profileImage.name || "avatar.png",
          contentType: values.profileImage.type || "image/png",
          folder: "profiles",
        });

        profileImageUrl = presignedResponse.fileUrl;
      }

      const response = await updateProfile({
        name: values.fullName,
        division: values.division,
        grade: values.grade,
        parentName: values.parentFullName,
        parentNumber: values.parentPhone,
        ...(profileImageUrl ? { profileImage: profileImageUrl } : {}),
      });
      showApiSuccessToast(response, "Profile updated successfully");
      setIsEditOpen(false);
    } catch (error: any) {
      showApiErrorToast(error, "Failed to update profile");
    } finally {
      setIsUploading(false);
    }
  }

  return {
    profile,
    isPending,
    isUpdating,
    isEditOpen,
    openEditProfile,
    closeEditProfile,
    saveProfile,
  };
}

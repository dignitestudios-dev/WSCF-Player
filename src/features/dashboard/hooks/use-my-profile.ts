"use client";

import { useState } from "react";
import { useAuthUserQuery, useUpdateProfileMutation } from "@/features/auth/api/auth.queries";
import { uploadProfileImage } from "@/features/auth/api/auth.service";
import { useUpdateChildMutation } from "@/features/players/api/children.queries";
import { showApiSuccessToast, showApiErrorToast } from "@/lib/api-toast";

export function useMyProfile() {
  const { data, isPending } = useAuthUserQuery();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // The account is the parent's; `playerProfile` is the child the app is
  // currently showing. Which of the two a field comes from matters: the name
  // and grade are the child's, the address and contact details are the
  // household's.
  const user = data?.data?.user;
  const playerProfile = data?.data?.playerProfile;
  const upcomingCount = data?.data?.upcomingTournamentCount || 0;

  // Guardians live on the account. Prefer the primary, otherwise whichever
  // one was given.
  const parentObj = user?.parents;
  const mother = parentObj?.mother;
  const father = parentObj?.father;
  const parent = mother?.isPrimary ? mother : (father || mother);

  const profile: MyProfile = {
    name: playerProfile?.name || "N/A",
    // The stored halves, not the joined string. `name` is only for display.
    firstName: playerProfile?.firstName || "",
    lastName: playerProfile?.lastName || "",
    userId: playerProfile?.membershipId || playerProfile?._id || "N/A",
    gender: playerProfile?.gender || "N/A",
    // /user/me returns a team object, or null when the player is on no team.
    team: playerProfile?.team?.name || "N/A",
    city: user?.address?.city || "N/A",
    dateOfBirth: playerProfile?.dob
      ? new Date(playerProfile.dob).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
      : "N/A",
    // The account email: a child has none of their own.
    email: user?.email || "N/A",
    division: playerProfile?.division || "N/A",
    grade: playerProfile?.grade || "N/A",
    avatarUrl:
      user?.profileImage ||
      "/images/images.png",
    currentRating: playerProfile?.rating || 0,
    ratingStatus: playerProfile?.ratingStatus,
    enrolledTournaments: upcomingCount,
    historyScore: `${playerProfile?.totalWins || 0}/${playerProfile?.totalTournaments || 0}`,
    parent: {
      name: parent?.name || user?.name || "N/A",
      email: parent?.email || user?.email || "N/A",
      phone: parent?.phone || user?.phone || "N/A",
    },
    // Kept apart, so the edit form can put each guardian in their own row.
    parents: {
      ...(father
        ? {
            father: {
              name: father.name || "",
              email: father.email || "",
              phone: father.phone || "",
            },
          }
        : {}),
      ...(mother
        ? {
            mother: {
              name: mother.name || "",
              email: mother.email || "",
              phone: mother.phone || "",
            },
          }
        : {}),
    },
  };

  function openEditProfile() {
    setIsEditOpen(true);
  }

  function closeEditProfile() {
    setIsEditOpen(false);
  }

  const { mutateAsync: updateProfile, isPending: isMutationPending } = useUpdateProfileMutation();
  const { mutateAsync: updateChild, isPending: isChildPending } =
    useUpdateChildMutation();
  const [isUploading, setIsUploading] = useState(false);

  const isUpdating = isMutationPending || isChildPending || isUploading;

  async function saveProfile(values: EditProfileFields) {
    try {
      let profileImageUrl = undefined;

      if (values.profileImage && values.profileImage instanceof File) {
        setIsUploading(true);
        const uploadResponse = await uploadProfileImage(values.profileImage);
        profileImageUrl = uploadResponse.url;
      }

      // The edit form spans both records, so the save is split to match.
      // Sending a child's name or grade to the account endpoint would rename
      // the parent and drop the grade on the floor.
      if (playerProfile?._id) {
        await updateChild({
          childId: playerProfile._id,
          payload: {
            firstName: values.firstName,
            lastName: values.lastName,
            grade: values.grade,
            ...(values.gender ? { gender: values.gender } : {}),
          },
        });
      }

      // Both guardians are sent under their own key. Collapsing them into a
      // single `parentName` meant whichever row the admin typed in was written
      // to whichever guardian happened to be primary -- so editing the father
      // could rewrite the mother, and edits to the second row were dropped
      // entirely. `isPrimary` is not sent: the server keeps its own.
      const response = await updateProfile({
        city: values.city ?? "",
        parents: {
          father: {
            name: values.fatherName || "",
            phone: values.fatherPhone || "",
            email: values.fatherEmail || "",
          },
          mother: {
            name: values.motherName || "",
            phone: values.motherPhone || "",
            email: values.motherEmail || "",
          },
        },
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

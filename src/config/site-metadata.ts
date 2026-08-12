import type { Metadata } from "next";

export const SITE_NAME = "Wisconsin Scholastic Chess Federation";
export const SITE_SHORT_NAME = "WSCF";

export const DEFAULT_DESCRIPTION =
  "Wisconsin Scholastic Chess Federation helps students, parents, and coaches register for tournaments, look up player ratings, manage memberships, and stay connected with scholastic chess across Wisconsin.";

export const rootMetadata: Metadata = {
  title: {
    default: `${SITE_SHORT_NAME} | ${SITE_NAME}`,
    template: `%s | ${SITE_SHORT_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_SHORT_NAME,
  keywords: [
    "Wisconsin Scholastic Chess Federation",
    "WSCF",
    "scholastic chess",
    "chess tournaments",
    "player ratings",
    "chess membership",
  ],
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

type PageMetadataEntry = {
  title: string;
  description: string;
};

export const pageMetadata = {
  login: {
    title: "Login",
    description:
      "Sign in to WSCF to access member login, player ratings, tournament registration, team tools, and more.",
  },
  memberLogin: {
    title: "Member Login",
    description:
      "Log in to your Wisconsin Scholastic Chess Federation member account to manage your profile and chess activity.",
  },
  register: {
    title: "Become a Member",
    description:
      "Create your WSCF membership to register for tournaments, track ratings, and join Wisconsin scholastic chess programs.",
  },
  forgotPassword: {
    title: "Forgot Password",
    description:
      "Reset your WSCF account password and regain access to your member dashboard and tournament tools.",
  },
  verifyOtp: {
    title: "Verify OTP",
    description:
      "Verify your one-time password to continue your WSCF account registration or password reset securely.",
  },
  setNewPassword: {
    title: "Set New Password",
    description:
      "Create a new password for your Wisconsin Scholastic Chess Federation account.",
  },
  emailVerified: {
    title: "Email Verified",
    description:
      "Your email has been verified successfully. Continue setting up your WSCF member account.",
  },
  membershipValidation: {
    title: "Membership Validation",
    description:
      "Review your WSCF membership summary and proceed to payment to activate your scholastic chess membership.",
  },
  membershipSuccess: {
    title: "Membership Payment Success",
    description:
      "Your WSCF membership payment was completed successfully. Continue to member login.",
  },
  membershipSelectProfile: {
    title: "Select Your Profile",
    description:
      "Link your historical WSCF data to your new membership account.",
  },
  membershipCancel: {
    title: "Membership Payment Cancelled",
    description:
      "Your WSCF membership payment was cancelled. Return to membership validation to try again.",
  },
  playersRatingLookup: {
    title: "Players Rating Lookup",
    description:
      "Search Wisconsin Scholastic Chess Federation players by name or user ID and view current ratings.",
  },
  tournamentParticipants: {
    title: "Tournament Participants",
    description:
      "Browse current tournament participants, ratings, teams, and divisions across WSCF events.",
  },
  playerProfile: {
    title: "Player Profile",
    description:
      "View player profile details, ratings, and tournament history within the Wisconsin Scholastic Chess Federation.",
  },
  dashboard: {
    title: "Dashboard",
    description:
      "Your WSCF dashboard for membership status, ratings, upcoming tournaments, and account activity.",
  },
  myProfile: {
    title: "My Profile",
    description:
      "Manage your WSCF player profile, parent information, tournament history, and current rating.",
  },
  settings: {
    title: "Settings",
    description:
      "Update your WSCF account settings, password, notifications, policies, and membership preferences.",
  },
  changePassword: {
    title: "Change Password",
    description:
      "Update your Wisconsin Scholastic Chess Federation account password securely.",
  },
  registeredTournaments: {
    title: "Registered Tournaments",
    description:
      "View the tournaments you have registered for with the Wisconsin Scholastic Chess Federation.",
  },
  tournaments: {
    title: "Tournaments",
    description:
      "Browse all upcoming WSCF tournaments, search by title or location, and register in a few clicks.",
  },
  myHistory: {
    title: "My History",
    description:
      "Review your tournament history, ratings, and performance records with WSCF.",
  },
  tournamentDetails: {
    title: "Tournament Details",
    description:
      "See tournament information and registered players for a Wisconsin Scholastic Chess Federation event.",
  },
  registeredPlayers: {
    title: "Registered Players",
    description:
      "View the full list of players registered for a WSCF tournament, including ratings and profiles.",
  },
  products: {
    title: "Products",
    description:
      "Explore WSCF products and offerings for scholastic chess players, parents, and schools.",
  },
} satisfies Record<string, PageMetadataEntry>;

export function createPageMetadata(page: keyof typeof pageMetadata): Metadata {
  const { title, description } = pageMetadata[page];

  return {
    title,
    description,
  };
}

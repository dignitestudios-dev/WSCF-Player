import axiosInstance from "@/lib/axios";

/**
 * The children on the signed-in parent's account, and the master players file
 * lookup each of them has to go through once.
 */

export interface ChildPayload {
  firstName: string;
  lastName: string;
  gender?: string;
  grade?: string;
  dob?: string;
}

export interface MasterFileMatch {
  _id: string;
  rawName?: string;
  firstName: string;
  lastName: string;
  localRating: number;
  grade?: string;
  team?: string;
  uscfId?: string;
}

export async function getChildren(): Promise<{
  children: PlayerChild[];
  needsMembershipPayment: boolean;
  needsMasterFileCheck: boolean;
}> {
  const { data } = await axiosInstance.get("/player/children");
  return data.data;
}

/** Adds one or several players in a single request, the way signup does. */
export async function createChild(
  payload: ChildPayload | { children: ChildPayload[] },
) {
  const { data } = await axiosInstance.post("/player/children", payload);
  return data;
}

/**
 * Throws away players added but never paid for.
 *
 * Called when the parent backs out of checkout — those players were never
 * really added, so they must not linger on the account.
 */
export async function discardUnpaidChildren() {
  const { data } = await axiosInstance.delete("/player/children/unpaid");
  return data;
}

export async function updateChild(childId: string, payload: ChildPayload) {
  const { data } = await axiosInstance.patch(
    `/player/children/${childId}`,
    payload,
  );
  return data;
}

export async function getChildMatches(childId: string): Promise<{
  child: {
    _id: string;
    firstName: string;
    lastName: string;
    grade?: string;
    masterFileChecked: boolean;
  };
  matches: MasterFileMatch[];
}> {
  const { data } = await axiosInstance.get(
    `/player/children/${childId}/match-suggestions`,
  );
  return data.data;
}

/**
 * Records the parent's answer for one child. A null id means "none of these" —
 * still an answer, and still marks the child checked.
 */
export async function resolveChildMasterFile(
  childId: string,
  masterPlayerId: string | null,
) {
  const { data } = await axiosInstance.post(
    `/player/children/${childId}/master-file`,
    { masterPlayerId },
  );
  return data;
}

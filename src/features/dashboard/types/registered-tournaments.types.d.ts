interface RegisteredTournament {
  id: string;
  title: string;
  location: string;
  date: string;
  paymentStatus?: string;
  divisionLabel?: string;
  entryFee?: number;
  payOnSite?: boolean;
  coupon?: {
    _id?: string;
    code: string;
    organizationName?: string;
  } | null;
}

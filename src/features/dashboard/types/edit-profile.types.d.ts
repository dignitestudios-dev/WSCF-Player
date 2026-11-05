interface EditProfileFields {
  firstName: string;
  lastName: string;
  gender: string;
  /** The child's birth date as "YYYY-MM-DD". Empty when none is stored. */
  dob?: string;
  sigma?: string;
  email: string;
  grade: string;
  city?: string;
  fatherName?: string;
  motherName?: string;
  fatherPhone?: string;
  motherPhone?: string;
  fatherEmail?: string;
  motherEmail?: string;
  profileImage?: any;
}

export type TUserProfile = {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string // YYYY-MM-DD format
  preferences: string[] // Array of categories
}

export type TUpdateUserProfileInput = Partial<Omit<TUserProfile, "_id" | "email">>

export type TUpdateUserPreferencesInput = {
  preferences: string[]
}

export type TChangePasswordInput = {
  user?:string,
  currentPassword?: string // Optional if not required by backend for first password set
  newPassword: string
  confirmNewPassword: string
}

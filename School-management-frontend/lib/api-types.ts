// Shared API payload / response types for the frontend

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface CreateStudentPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  classId: string
  section: string
  rollNumber: string
  admissionDate: string
  parentName: string
  parentPhone: string
  parentEmail: string
  addressStreet: string
  addressCity: string
  addressState: string
  addressZip: string
  emergencyName: string
  emergencyPhone: string

  admissionNumber?: string
  bloodGroup?: string
}

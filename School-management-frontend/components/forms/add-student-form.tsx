"use client"

import * as React from "react"
import { WizardStepper } from "@/components/feedback/wizard-stepper"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/forms/form-input"
import { FormSelect } from "@/components/forms/form-select"
import { FormDatePicker } from "@/components/forms/form-date-picker"
import { MOCK_CLASSES } from "@/lib/constants"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Types
type EmergencyContact = {
  name: string;
  phone: string;
  relationship: string;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  gender: string;
  bloodGroup?: string;
  email: string;
  phone: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  class: string;
  rollNumber: string;
  admissionNumber?: string;
  parentName: string;
  parentContact: string;
  parentEmail: string;
  admissionDate: Date | undefined;
  emergencyContact: EmergencyContact;
}

interface AddStudentFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (student: StudentFormData) => void;
  mode?: 'modal' | 'page';
  initialData?: Partial<StudentFormData>;
  isEditing?: boolean;
}

interface StepComponentProps {
  initialData?: Partial<StudentFormData>
  onNext: (data: Partial<StudentFormData>) => void
  onBack: () => void
  isLastStep: boolean
  isFirstStep: boolean
}

const Step1Personal: React.FC<StepComponentProps> = ({ initialData = {}, onNext, isFirstStep }) => {
  const [firstName, setFirstName] = React.useState(initialData.firstName || "")
  const [lastName, setLastName] = React.useState(initialData.lastName || "")
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | undefined>(initialData.dateOfBirth)
  const [gender, setGender] = React.useState(initialData.gender || "")
  const [bloodGroup, setBloodGroup] = React.useState(initialData.bloodGroup || "")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!firstName) newErrors.firstName = "First name is required."
    if (!lastName) newErrors.lastName = "Last name is required."
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required."
    if (!gender) newErrors.gender = "Gender is required."
    if (!bloodGroup) newErrors.bloodGroup = "Blood group is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext({ firstName, lastName, dateOfBirth, gender, bloodGroup })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
          <Input id="firstName" value={firstName} onChange={(e) => { setFirstName(e.target.value); setErrors((prev) => ({ ...prev, firstName: "" })) }} className={errors.firstName ? "border-destructive" : ""} required />
          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
          <Input id="lastName" value={lastName} onChange={(e) => { setLastName(e.target.value); setErrors((prev) => ({ ...prev, lastName: "" })) }} className={errors.lastName ? "border-destructive" : ""} required />
          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
          <Input id="dateOfBirth" type="date" value={dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : ''} onChange={(e) => { setDateOfBirth(e.target.value ? new Date(e.target.value) : undefined); setErrors((prev) => ({ ...prev, dateOfBirth: "" })) }} className={errors.dateOfBirth ? "border-destructive" : ""} required />
          {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
          <select id="gender" value={gender} onChange={(e) => { setGender(e.target.value); setErrors((prev) => ({ ...prev, gender: "" })) }} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.gender ? "border-destructive" : ""}`} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bloodGroup">Blood Group <span className="text-red-500">*</span></Label>
        <select id="bloodGroup" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.bloodGroup ? "border-destructive" : ""}`} required>
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
        {errors.bloodGroup && <p className="text-sm text-destructive">{errors.bloodGroup}</p>}
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <Button type="submit" className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition">Next</Button>
      </div>
    </form>
  )
}

const Step2Contact: React.FC<StepComponentProps> = ({ initialData = {}, onNext, onBack }) => {
  const [email, setEmail] = React.useState(initialData.email || "")
  const [phone, setPhone] = React.useState(initialData.phone || "")
  const [addressStreet, setAddressStreet] = React.useState(initialData.addressStreet || "")
  const [addressCity, setAddressCity] = React.useState(initialData.addressCity || "")
  const [addressState, setAddressState] = React.useState(initialData.addressState || "")
  const [addressZip, setAddressZip] = React.useState(initialData.addressZip || "")
  const [emergencyName, setEmergencyName] = React.useState(initialData.emergencyContact?.name || "")
  const [emergencyPhone, setEmergencyPhone] = React.useState(initialData.emergencyContact?.phone || "")
  const [emergencyRelationship, setEmergencyRelationship] = React.useState(initialData.emergencyContact?.relationship || "")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!email) newErrors.email = "Email is required."
    if (!phone) newErrors.phone = "Phone number is required."
    if (!addressStreet) newErrors.addressStreet = "Street is required."
    if (!addressCity) newErrors.addressCity = "City is required."
    if (!addressState) newErrors.addressState = "State is required."
    if (!addressZip) newErrors.addressZip = "Zip/Postal code is required."
    if (!emergencyName) newErrors.emergencyName = "Emergency contact name is required."
    if (!emergencyPhone) newErrors.emergencyPhone = "Emergency contact phone is required."
    if (!emergencyRelationship) newErrors.emergencyRelationship = "Relationship is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext({
        email,
        phone,
        addressStreet,
        addressCity,
        addressState,
        addressZip,
        emergencyContact: { name: emergencyName, phone: emergencyPhone, relationship: emergencyRelationship },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
          <Input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: "" })) }} className={errors.email ? "border-destructive" : ""} required />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: "" })) }} className={errors.phone ? "border-destructive" : ""} required />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="addressStreet">Street Address <span className="text-red-500">*</span></Label>
          <Input id="addressStreet" value={addressStreet} onChange={(e) => { setAddressStreet(e.target.value); setErrors((prev) => ({ ...prev, addressStreet: "" })) }} className={errors.addressStreet ? "border-destructive" : ""} required />
          {errors.addressStreet && <p className="text-sm text-destructive">{errors.addressStreet}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="addressCity">City <span className="text-red-500">*</span></Label>
          <Input id="addressCity" value={addressCity} onChange={(e) => { setAddressCity(e.target.value); setErrors((prev) => ({ ...prev, addressCity: "" })) }} className={errors.addressCity ? "border-destructive" : ""} required />
          {errors.addressCity && <p className="text-sm text-destructive">{errors.addressCity}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="addressState">State <span className="text-red-500">*</span></Label>
          <Input id="addressState" value={addressState} onChange={(e) => { setAddressState(e.target.value); setErrors((prev) => ({ ...prev, addressState: "" })) }} className={errors.addressState ? "border-destructive" : ""} required />
          {errors.addressState && <p className="text-sm text-destructive">{errors.addressState}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="addressZip">Zip/Postal Code <span className="text-red-500">*</span></Label>
          <Input id="addressZip" value={addressZip} onChange={(e) => { setAddressZip(e.target.value); setErrors((prev) => ({ ...prev, addressZip: "" })) }} className={errors.addressZip ? "border-destructive" : ""} required />
          {errors.addressZip && <p className="text-sm text-destructive">{errors.addressZip}</p>}
        </div>
      </div>
      <div className="border-t pt-4 mt-2 rounded-xl bg-blue-50/50 p-4">
        <div className="font-semibold mb-2">Emergency Contact <span className="text-muted-foreground text-xs">(in case parent/guardian is unreachable)</span></div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="emergencyName">Name <span className="text-red-500">*</span></Label>
            <Input id="emergencyName" value={emergencyName} onChange={(e) => { setEmergencyName(e.target.value); setErrors((prev) => ({ ...prev, emergencyName: "" })) }} className={errors.emergencyName ? "border-destructive" : ""} required />
            {errors.emergencyName && <p className="text-sm text-destructive">{errors.emergencyName}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emergencyPhone">Phone Number <span className="text-red-500">*</span></Label>
            <Input id="emergencyPhone" value={emergencyPhone} onChange={(e) => { setEmergencyPhone(e.target.value); setErrors((prev) => ({ ...prev, emergencyPhone: "" })) }} className={errors.emergencyPhone ? "border-destructive" : ""} required />
            {errors.emergencyPhone && <p className="text-sm text-destructive">{errors.emergencyPhone}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emergencyRelationship">Relationship <span className="text-red-500">*</span></Label>
            <Input id="emergencyRelationship" value={emergencyRelationship} onChange={(e) => { setEmergencyRelationship(e.target.value); setErrors((prev) => ({ ...prev, emergencyRelationship: "" })) }} className={errors.emergencyRelationship ? "border-destructive" : ""} required />
            {errors.emergencyRelationship && <p className="text-sm text-destructive">{errors.emergencyRelationship}</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4 gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-full md:w-auto">Back</Button>
        <Button type="submit" className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition">Next</Button>
      </div>
    </form>
  )
}

const Step3Academic: React.FC<StepComponentProps> = ({ initialData = {}, onNext, onBack }) => {
  const [cls, setCls] = React.useState(initialData.class || "")
  const [rollNumber, setRollNumber] = React.useState(initialData.rollNumber || "")
  const [admissionNumber, setAdmissionNumber] = React.useState(initialData.admissionNumber || "")
  const [admissionDate, setAdmissionDate] = React.useState<Date | undefined>(initialData.admissionDate)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const classOptions = MOCK_CLASSES.map((c) => ({ value: c.name, label: c.name }))

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!cls) newErrors.class = "Class is required."
    if (!rollNumber) newErrors.rollNumber = "Roll Number is required."
    if (!admissionDate) newErrors.admissionDate = "Admission Date is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext({ class: cls, rollNumber, admissionNumber, admissionDate })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="class">Assign Class <span className="text-red-500">*</span></Label>
          <select id="class" value={cls} onChange={(e) => { setCls(e.target.value); setErrors((prev) => ({ ...prev, class: "" })) }} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.class ? "border-destructive" : ""}`} required>
            <option value="">Select a class</option>
            {classOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.class && <p className="text-sm text-destructive">{errors.class}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rollNumber">Roll Number <span className="text-red-500">*</span></Label>
          <Input id="rollNumber" value={rollNumber} onChange={(e) => { setRollNumber(e.target.value); setErrors((prev) => ({ ...prev, rollNumber: "" })) }} className={errors.rollNumber ? "border-destructive" : ""} required />
          {errors.rollNumber && <p className="text-sm text-destructive">{errors.rollNumber}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="admissionNumber">Admission Number</Label>
          <Input id="admissionNumber" value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} placeholder="Auto-generated if left blank" />
          <p className="text-xs text-muted-foreground">Leave empty to auto-generate</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="admissionDate">Admission Date <span className="text-red-500">*</span></Label>
          <Input id="admissionDate" type="date" value={admissionDate ? admissionDate.toISOString().split('T')[0] : ''} onChange={(e) => { setAdmissionDate(e.target.value ? new Date(e.target.value) : undefined); setErrors((prev) => ({ ...prev, admissionDate: "" })) }} className={errors.admissionDate ? "border-destructive" : ""} required />
          {errors.admissionDate && <p className="text-sm text-destructive">{errors.admissionDate}</p>}
        </div>
      </div>
      <div className="flex justify-between mt-4 gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-full md:w-auto">Back</Button>
        <Button type="submit" className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition">Next</Button>
      </div>
    </form>
  )
}

const Step4Parent: React.FC<StepComponentProps> = ({ initialData = {}, onNext, onBack, isLastStep }) => {
  const [parentName, setParentName] = React.useState(initialData.parentName || "")
  const [parentContact, setParentContact] = React.useState(initialData.parentContact || "")
  const [parentEmail, setParentEmail] = React.useState(initialData.parentEmail || "")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!parentName) newErrors.parentName = "Parent Name is required."
    if (!parentContact) newErrors.parentContact = "Parent Contact is required."
    if (!parentEmail) newErrors.parentEmail = "Parent Email is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext({ parentName, parentContact, parentEmail })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="parentName">Parent/Guardian Name <span className="text-red-500">*</span></Label>
          <Input id="parentName" value={parentName} onChange={(e) => { setParentName(e.target.value); setErrors((prev) => ({ ...prev, parentName: "" })) }} className={errors.parentName ? "border-destructive" : ""} required />
          {errors.parentName && <p className="text-sm text-destructive">{errors.parentName}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="parentContact">Parent/Guardian Contact <span className="text-red-500">*</span></Label>
          <Input id="parentContact" type="tel" value={parentContact} onChange={(e) => { setParentContact(e.target.value); setErrors((prev) => ({ ...prev, parentContact: "" })) }} className={errors.parentContact ? "border-destructive" : ""} required />
          {errors.parentContact && <p className="text-sm text-destructive">{errors.parentContact}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="parentEmail">Parent/Guardian Email <span className="text-red-500">*</span></Label>
          <Input id="parentEmail" type="email" value={parentEmail} onChange={(e) => { setParentEmail(e.target.value); setErrors((prev) => ({ ...prev, parentEmail: "" })) }} className={errors.parentEmail ? "border-destructive" : ""} required />
          {errors.parentEmail && <p className="text-sm text-destructive">{errors.parentEmail}</p>}
        </div>
      </div>
      <div className="flex justify-between mt-4 gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-full md:w-auto">Back</Button>
        <Button type="submit" className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition">{isLastStep ? "Finish" : "Next"}</Button>
      </div>
    </form>
  )
}

export function AddStudentForm({ isOpen = true, onClose, onSuccess, mode = 'page', initialData, isEditing = false }: AddStudentFormProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState<Partial<StudentFormData>>(initialData || {})
  const totalSteps = 4

  const handleFinish = async (data: Partial<StudentFormData>) => {
    // Combine all form data
    const completeData = { ...formData, ...data }
    
    // Type guard: check all required fields
    const requiredFields = [
      "firstName", "lastName", "dateOfBirth", "gender", "email", "phone", 
      "addressStreet", "addressCity", "addressState", "addressZip", 
      "class", "rollNumber", "parentName", "parentContact", "parentEmail", 
      "admissionDate", "emergencyContact"
    ];
    
    for (const field of requiredFields) {
      if (!(field in completeData) || (completeData as any)[field] === undefined || (completeData as any)[field] === "") {
        toast({
          title: "Missing Information",
          description: `Please fill in all required fields. Missing: ${field}`,
          variant: "destructive"
        })
        return
      }
    }

    // All required fields present
    const studentData = completeData as StudentFormData
    
    try {
      // Convert data to match backend API
      const backendData = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        phone: studentData.phone,
        dateOfBirth: studentData.dateOfBirth?.toISOString(),
        gender: studentData.gender,
        classId: studentData.class, // Assuming class name maps to ID or needs conversion
        section: "A", // Default section
        rollNumber: studentData.rollNumber,
        admissionNumber: studentData.admissionNumber,
        admissionDate: studentData.admissionDate?.toISOString(),
        parentName: studentData.parentName,
        parentPhone: studentData.parentContact,
        parentEmail: studentData.parentEmail,
        address: `${studentData.addressStreet}, ${studentData.addressCity}, ${studentData.addressState} ${studentData.addressZip}`,
        addressStreet: studentData.addressStreet,
        addressCity: studentData.addressCity,
        addressState: studentData.addressState,
        addressZip: studentData.addressZip,
        bloodGroup: studentData.bloodGroup,
        emergencyName: studentData.emergencyContact.name,
        emergencyPhone: studentData.emergencyContact.phone,
        emergencyRelationship: studentData.emergencyContact.relationship
      }

      // Call success callback with backend data
      if (onSuccess) {
        onSuccess(backendData)
      }

      toast({
        title: isEditing ? "Student Updated!" : "Student Added!",
        description: isEditing 
          ? `${studentData.firstName} ${studentData.lastName} has been updated successfully.`
          : `${studentData.firstName} ${studentData.lastName} has been added successfully.`,
      })

      // Close modal if in modal mode
      if (mode === 'modal' && onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Failed to create student:', error)
      toast({
        title: "Error",
        description: "Failed to save student data. Please try again.",
        variant: "destructive"
      })
    }
  }



  const steps = [
    {
      stepKey: "personal",
      title: "Personal Information",
      description: "Provide the student's basic personal details.",
      component: Step1Personal,
    },
    {
      stepKey: "contact",
      title: "Contact Information",
      description: "Enter the student's contact details.",
      component: Step2Contact,
    },
    {
      stepKey: "academic",
      title: "Academic Details",
      description: "Assign class, roll number, and admission date.",
      component: Step3Academic,
    },
    {
      stepKey: "parent",
      title: "Parent/Guardian Details",
      description: "Provide contact information for the student's parent or guardian.",
      component: Step4Parent,
    },
  ]

  // Progress bar percentage
  const progress = ((currentStep + 1) / totalSteps) * 100

  const content = (
    <div className={`${mode === 'modal' ? 'p-6' : 'rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 md:p-10 shadow-2xl backdrop-blur-md'}`}>
      {mode !== 'modal' && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            {isEditing ? 'Edit Student' : 'Add New Student'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? 'Update the student information below. All fields marked with * are mandatory.'
              : 'Fill in all required details to add a new student to the school database. All fields marked with * are mandatory.'
            }
          </p>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="mb-4">
        <Progress value={progress} className="h-2 bg-blue-100" />
      </div>
      
      {/* Stepper */}
      <div className="mb-8">
        <WizardStepper 
          steps={steps} 
          onFinish={handleFinish}
          initialData={formData}
        />
      </div>
    </div>
  )

  if (mode === 'modal') {
    return content
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-fade-in">
      {content}
    </div>
  )
} 
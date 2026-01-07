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
        <FormInput id="firstName" label="First Name" value={firstName} onChange={(e) => { setFirstName(e.target.value); setErrors((prev) => ({ ...prev, firstName: "" })) }} error={errors.firstName} required aria-label="First Name" />
        <FormInput id="lastName" label="Last Name" value={lastName} onChange={(e) => { setLastName(e.target.value); setErrors((prev) => ({ ...prev, lastName: "" })) }} error={errors.lastName} required aria-label="Last Name" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <FormDatePicker id="dateOfBirth" label="Date of Birth" selectedDate={dateOfBirth} onSelectDate={(date) => { setDateOfBirth(date); setErrors((prev) => ({ ...prev, dateOfBirth: "" })) }} error={errors.dateOfBirth} aria-label="Date of Birth" />
        <FormSelect id="gender" label="Gender" value={gender} onValueChange={(value) => { setGender(value); setErrors((prev) => ({ ...prev, gender: "" })) }} options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} error={errors.gender} required aria-label="Gender" />
      </div>
      <FormSelect id="bloodGroup" label="Blood Group" value={bloodGroup} onValueChange={setBloodGroup} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => ({ value: bg, label: bg }))} error={errors.bloodGroup} required aria-label="Blood Group" />
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
        <FormInput id="email" label="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: "" })) }} error={errors.email} required aria-label="Email" />
        <FormInput id="phone" label="Phone Number" type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: "" })) }} error={errors.phone} required aria-label="Phone Number" />
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <FormInput id="addressStreet" label="Street Address" value={addressStreet} onChange={(e) => { setAddressStreet(e.target.value); setErrors((prev) => ({ ...prev, addressStreet: "" })) }} error={errors.addressStreet} required aria-label="Street Address" />
        <FormInput id="addressCity" label="City" value={addressCity} onChange={(e) => { setAddressCity(e.target.value); setErrors((prev) => ({ ...prev, addressCity: "" })) }} error={errors.addressCity} required aria-label="City" />
        <FormInput id="addressState" label="State" value={addressState} onChange={(e) => { setAddressState(e.target.value); setErrors((prev) => ({ ...prev, addressState: "" })) }} error={errors.addressState} required aria-label="State" />
        <FormInput id="addressZip" label="Zip/Postal Code" value={addressZip} onChange={(e) => { setAddressZip(e.target.value); setErrors((prev) => ({ ...prev, addressZip: "" })) }} error={errors.addressZip} required aria-label="Zip/Postal Code" />
      </div>
      <div className="border-t pt-4 mt-2 rounded-xl bg-blue-50/50 p-4">
        <div className="font-semibold mb-2">Emergency Contact <span className="text-muted-foreground text-xs">(in case parent/guardian is unreachable)</span></div>
        <div className="grid md:grid-cols-3 gap-4">
          <FormInput id="emergencyName" label="Name" value={emergencyName} onChange={(e) => { setEmergencyName(e.target.value); setErrors((prev) => ({ ...prev, emergencyName: "" })) }} error={errors.emergencyName} required aria-label="Emergency Contact Name" />
          <FormInput id="emergencyPhone" label="Phone Number" value={emergencyPhone} onChange={(e) => { setEmergencyPhone(e.target.value); setErrors((prev) => ({ ...prev, emergencyPhone: "" })) }} error={errors.emergencyPhone} required aria-label="Emergency Contact Phone" />
          <FormInput id="emergencyRelationship" label="Relationship" value={emergencyRelationship} onChange={(e) => { setEmergencyRelationship(e.target.value); setErrors((prev) => ({ ...prev, emergencyRelationship: "" })) }} error={errors.emergencyRelationship} required aria-label="Emergency Contact Relationship" />
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
      onNext({ class: cls, rollNumber, admissionDate })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-4">
        <FormSelect id="class" label="Assign Class" value={cls} onValueChange={(value) => { setCls(value); setErrors((prev) => ({ ...prev, class: "" })) }} options={classOptions} placeholder="Select a class" error={errors.class} required aria-label="Class" />
        <FormInput id="rollNumber" label="Roll Number" value={rollNumber} onChange={(e) => { setRollNumber(e.target.value); setErrors((prev) => ({ ...prev, rollNumber: "" })) }} error={errors.rollNumber} required aria-label="Roll Number" />
        <FormDatePicker id="admissionDate" label="Admission Date" selectedDate={admissionDate} onSelectDate={(date) => { setAdmissionDate(date); setErrors((prev) => ({ ...prev, admissionDate: "" })) }} error={errors.admissionDate} aria-label="Admission Date" />
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
        <FormInput id="parentName" label="Parent/Guardian Name" value={parentName} onChange={(e) => { setParentName(e.target.value); setErrors((prev) => ({ ...prev, parentName: "" })) }} error={errors.parentName} required aria-label="Parent/Guardian Name" />
        <FormInput id="parentContact" label="Parent/Guardian Contact" type="tel" value={parentContact} onChange={(e) => { setParentContact(e.target.value); setErrors((prev) => ({ ...prev, parentContact: "" })) }} error={errors.parentContact} required aria-label="Parent/Guardian Contact" />
        <FormInput id="parentEmail" label="Parent/Guardian Email" type="email" value={parentEmail} onChange={(e) => { setParentEmail(e.target.value); setErrors((prev) => ({ ...prev, parentEmail: "" })) }} error={errors.parentEmail} required aria-label="Parent/Guardian Email" />
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

  const handleFinish = (data: Partial<StudentFormData>) => {
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
    console.log(isEditing ? "Student Updated:" : "Student Added:", studentData)
    
    toast({
      title: isEditing ? "Student Updated!" : "Student Added!",
      description: isEditing 
        ? `${studentData.firstName} ${studentData.lastName} has been updated successfully.`
        : `${studentData.firstName} ${studentData.lastName} has been added successfully.`,
    })

    // Call success callback
    if (onSuccess) {
      onSuccess(studentData)
    }

    // Close modal if in modal mode
    if (mode === 'modal' && onClose) {
      onClose()
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
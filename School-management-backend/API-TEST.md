# API Testing Guide

## Backend is Running! 🎉

Server: http://localhost:5000

## Test with Thunder Client or Postman

### 1. Health Check
```
GET http://localhost:5000/health
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@demo.com",
  "password": "admin123"
}
```

Response will include a `token` - copy this for next requests.

### 3. Get Current User
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Get All Students
```
GET http://localhost:5000/api/students
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Create a Student
```
POST http://localhost:5000/api/students
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "rollNumber": "001",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2010-01-15T00:00:00.000Z",
  "gender": "MALE",
  "email": "john.doe@student.com",
  "phone": "1234567890",
  "classId": "YOUR_CLASS_ID_FROM_DATABASE",
  "section": "A",
  "admissionDate": "2024-04-01T00:00:00.000Z",
  "admissionNumber": "ADM001",
  "addressStreet": "123 Student St",
  "addressCity": "City",
  "addressState": "State",
  "addressZip": "12345",
  "parentName": "Parent Name",
  "parentPhone": "9876543210",
  "parentEmail": "parent@email.com",
  "emergencyName": "Emergency Contact",
  "emergencyPhone": "5555555555"
}
```

### 6. Get Dashboard Stats
```
GET http://localhost:5000/api/dashboard
Authorization: Bearer YOUR_TOKEN_HERE
```

## Login Credentials

**Email:** admin@demo.com  
**Password:** admin123

## Next Steps

1. Test all endpoints with Thunder Client/Postman
2. Connect frontend to this backend
3. Update frontend API calls to use http://localhost:5000

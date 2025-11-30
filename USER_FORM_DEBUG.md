# User Form Debug Guide

## Issue
Create User button không trigger event khi click

## Possible Causes

### 1. Form Validation Errors
Form có thể fail validation trước khi submit. Check:
- Required fields: first_name, last_name, email, password, role_ids
- Password minimum 6 characters
- At least 1 role selected

### 2. Console Errors
Check browser console (F12) for:
- JavaScript errors
- Network errors
- Validation errors

### 3. Debug Steps

#### Step 1: Open Browser Console
1. Press F12
2. Go to Console tab
3. Clear console
4. Try to submit form
5. Check for errors

#### Step 2: Check Form State
Add this temporarily to see form errors:

```tsx
// Add after form definition
console.log("Form errors:", form.formState.errors);
console.log("Form values:", form.getValues());
console.log("Is valid:", form.formState.isValid);
```

#### Step 3: Test Submit Handler
The form already has console.logs:
- "Form submitted with data:" - Should appear if validation passes
- "Sending payload:" - Should appear before API call
- "Create user result:" - Should appear after success

### 4. Common Issues

#### Password Field
- Must be at least 6 characters
- Cannot be empty for new users
- Schema: `.min(6, "Password must be at least 6 characters")`

#### Role Selection
- Must select at least 1 role
- Schema: `.min(1, "Select at least one role")`

#### Email
- Must be valid email format
- Schema: `.email("Invalid email address")`

### 5. Quick Test

Fill form with:
- First Name: Test
- Last Name: User
- Email: test@example.com
- Password: 123456 (minimum 6 chars)
- Status: Active (default)
- Roles: Check at least 1 role
- Phone: (optional)
- Department: (optional)
- Position: (optional)

Then click "Create User" and check console.

### 6. Expected Console Output

If working correctly:
```
Form submitted with data: {
  first_name: "Test",
  last_name: "User",
  email: "test@example.com",
  password: "123456",
  role_ids: ["role-id-here"],
  status: "active",
  ...
}
Sending payload: { ... }
Create user result: { ... }
```

If validation fails:
- No console output
- Red error messages under fields
- Form doesn't submit

### 7. Fix Validation Errors

Check each field for red error text:
- First Name: Required
- Last Name: Required
- Email: Required, must be valid
- Password: Required, min 6 chars
- Roles: Must select at least 1

### 8. Network Tab

If form submits but no API call:
1. Open Network tab (F12)
2. Filter by "Fetch/XHR"
3. Submit form
4. Look for POST request to `/api/v1/users`
5. Check request/response

## Solution Checklist

- [ ] All required fields filled
- [ ] Password at least 6 characters
- [ ] At least 1 role selected
- [ ] Email is valid format
- [ ] No console errors
- [ ] Console shows "Form submitted with data:"
- [ ] Network shows POST request
- [ ] API returns success response

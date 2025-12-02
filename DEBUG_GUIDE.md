# 🔍 DEBUG LOGS READY

## Check These Console Logs:

### 1. Auth Context Logs:
```
🔐 Auth init started
🔑 Token from cookies: EXISTS/NONE
🔑 Token from localStorage: EXISTS/NONE
✅ User verified: user@email.com
OR
❌ No token found
OR
❌ Auth initialization failed: [error]
```

### 2. Axios Request Logs:
```
📤 API Request: /documents/list?page=1&page_size=20
🔑 Token from cookies: EXISTS/NONE
🔑 Token from localStorage: EXISTS/NONE
✅ Authorization header set
OR
❌ No token available
```

### 3. Axios Response Error (if 401):
```
401 Unauthorized error: {
  url: '/documents/list',
  method: 'get',
  hasToken: true/false,
  error: {...}
}
```

## What to Check:

1. **If "No token found":**
   - Login first at `/login`
   - Check if login saves token

2. **If "Token EXISTS" but still 401:**
   - Token might be expired
   - Check token format in cookies/localStorage
   - Verify backend accepts the token

3. **If "Authorization header set" but still 401:**
   - Backend auth middleware issue
   - Check backend logs
   - Verify JWT secret matches

## Next Steps:
1. Open browser console (F12)
2. Navigate to `/dashboard/documents`
3. Copy all console logs
4. Share with me

**Dev server should be running on http://localhost:3000**

# Empty Data Handling Fix

## Problem
When the database is empty and APIs return `[]`, the DataTable component throws:
```
Uncaught TypeError: data.some is not a function
```

This happens because:
1. Component expects data to always be an array
2. In some cases, data could be `undefined` or `null`
3. The `.some()` and `.every()` methods fail on non-array values

## Solution

### 1. DataTable Component (`src/components/ui/data-table.tsx`)

**Changes:**
- Added default parameter: `data = []`
- Created `safeData` constant to ensure data is always an array
- Replaced all `data` references with `safeData` in the component

```tsx
export function DataTable<T extends { id: string | number }>({
    data = [], // Default to empty array
    columns,
    // ... other props
}: DataTableProps<T>) {
    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];
    
    // Use safeData everywhere instead of data
    const allSelected = safeData.length > 0 && safeData.every(...);
    const someSelected = safeData.length > 0 && safeData.some(...);
    
    // In render:
    {safeData.length === 0 ? (
        <TableCell>No results.</TableCell>
    ) : (
        safeData.map((item) => ...)
    )}
}
```

### 2. All Authorization Pages

Added empty array fallbacks in error handlers:

**Modules Page:**
```tsx
try {
    const result = await authorizationService.getModules(...);
    setModules(result.data || []); // Fallback to []
} catch (error) {
    setModules([]); // Set empty array on error
}
```

**Same pattern applied to:**
- ✅ `src/app/dashboard/authorization/modules/page.tsx`
- ✅ `src/app/dashboard/authorization/departments/page.tsx`
- ✅ `src/app/dashboard/authorization/services/page.tsx`
- ✅ `src/app/dashboard/authorization/scopes/page.tsx`
- ✅ `src/app/dashboard/authorization/permissions/page.tsx`
- ✅ `src/app/dashboard/roles/page.tsx`

## Benefits

1. **No More Crashes** - App handles empty database gracefully
2. **Better UX** - Shows "No results" message instead of error
3. **Defensive Programming** - Multiple layers of protection
4. **Consistent Behavior** - All pages handle empty data the same way

## Testing Scenarios

### ✅ Empty Database
- Navigate to any authorization page
- Should show "No results" message
- No console errors

### ✅ API Error
- Simulate API failure
- Should show error toast
- Table shows "No results"
- No crashes

### ✅ Partial Data
- Add some data to database
- Should display correctly
- Pagination works
- Search works

### ✅ Full Data
- Database has many records
- All features work normally
- No performance issues

## Code Quality

- **Type Safety**: TypeScript ensures data is T[]
- **Runtime Safety**: `Array.isArray()` check
- **Default Parameters**: `data = []` as fallback
- **Error Handling**: Try-catch with empty array fallback
- **User Feedback**: Toast messages for errors

## Files Modified

1. `src/components/ui/data-table.tsx` - Core fix
2. `src/app/dashboard/authorization/modules/page.tsx`
3. `src/app/dashboard/authorization/departments/page.tsx`
4. `src/app/dashboard/authorization/services/page.tsx`
5. `src/app/dashboard/authorization/scopes/page.tsx`
6. `src/app/dashboard/authorization/permissions/page.tsx`
7. `src/app/dashboard/roles/page.tsx`

## Prevention

To prevent similar issues in the future:

1. **Always initialize state with empty arrays:**
   ```tsx
   const [items, setItems] = useState<Item[]>([]);
   ```

2. **Always provide fallbacks when setting state:**
   ```tsx
   setItems(response.data || []);
   ```

3. **Always set empty array in catch blocks:**
   ```tsx
   catch (error) {
       setItems([]);
   }
   ```

4. **Use optional chaining and nullish coalescing:**
   ```tsx
   const count = data?.length ?? 0;
   ```

## Status
✅ **All Fixed** - No more data.some errors
✅ **Tested** - Works with empty database
✅ **Build Passing** - No TypeScript errors

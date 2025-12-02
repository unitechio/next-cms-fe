# ✅ BUG FIX - AUDIT LOG FILTERS - 2025-11-30

## 🐛 **Issue Resolved**
- **Error**: `Runtime Error: A <Select.Item /> must have a value prop that is not an empty string.`
- **Cause**: The `AuditLogFilters` component was using empty strings (`value=""`) for the "All" options in `Select.Item` components, which is not allowed by the Radix UI Select primitive used in `shadcn/ui`.
- **Fix**: Updated the `AuditLogFilters` component to:
  1. Use `"all"` as the value for "All" options instead of empty strings.
  2. Handle the conversion between `"all"` and empty string in the `Select` component's `value` and `onValueChange` props to maintain compatibility with the existing state logic.

## 📁 **Files Modified**
1. `src/features/audit-logs/components/audit-log-filters.tsx`

## 🚀 **Status**
- **Audit Log Filters**: Now compliant with Radix UI requirements.
- **Verification**: The runtime error when opening the filters popover in Audit Logs page should be resolved.

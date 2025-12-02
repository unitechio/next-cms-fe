# Pagination Component Documentation

## Overview
Reusable Pagination component với nhiều tính năng nâng cao cho các trang quản lý.

## Location
`src/components/ui/pagination.tsx`

## Features

### ✨ Core Features
- ✅ **Page Numbers** - Hiển thị số trang với ellipsis (...)
- ✅ **First/Last Buttons** - Nút đi đến trang đầu/cuối
- ✅ **Previous/Next Buttons** - Nút trang trước/sau
- ✅ **Page Size Selector** - Cho phép chọn số items mỗi trang
- ✅ **Smart Page Display** - Tự động ẩn/hiện page numbers
- ✅ **Disabled States** - Disable buttons khi không thể navigate
- ✅ **Responsive** - Hoạt động tốt trên mobile và desktop

## Props

```typescript
interface PaginationProps {
    currentPage: number;          // Trang hiện tại (required)
    totalPages: number;            // Tổng số trang (required)
    onPageChange: (page: number) => void;  // Callback khi đổi trang (required)
    
    // Optional props
    pageSize?: number;             // Số items mỗi trang (default: 10)
    onPageSizeChange?: (size: number) => void;  // Callback khi đổi page size
    pageSizeOptions?: number[];    // Options cho page size (default: [10, 20, 50, 100])
    showPageSize?: boolean;        // Hiển thị page size selector (default: false)
    showFirstLast?: boolean;       // Hiển thị first/last buttons (default: true)
}
```

## Usage Examples

### Basic Usage
```tsx
import { Pagination } from "@/components/ui/pagination";

function MyPage() {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);

    return (
        <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
        />
    );
}
```

### With Page Size Selector
```tsx
import { Pagination } from "@/components/ui/pagination";

function MyPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(10);

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(1); // Reset to first page
    };

    return (
        <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            showPageSize={true}
            pageSizeOptions={[10, 20, 50, 100]}
        />
    );
}
```

### Full Example (Audit Logs)
```tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Pagination } from "@/components/ui/pagination";
import { parseApiResponse } from "@/lib/api-utils";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await auditLogService.getAuditLogs({
                page,
                limit: pageSize,
            });
            const { data, totalPages: pages } = parseApiResponse(response);
            setLogs(data);
            setTotalPages(pages);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(1); // Reset to first page
    };

    return (
        <div>
            {/* Your table/list here */}
            <DataTable data={logs} isLoading={isLoading} />

            {/* Pagination */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                showPageSize={true}
                showFirstLast={true}
            />
        </div>
    );
}
```

## Page Number Display Logic

### Small Total Pages (≤ 5)
```
[1] [2] [3] [4] [5]
```

### Large Total Pages with Current in Middle
```
[1] [...] [5] [6] [7] [...] [20]
```

### Large Total Pages with Current Near Start
```
[1] [2] [3] [...] [20]
```

### Large Total Pages with Current Near End
```
[1] [...] [18] [19] [20]
```

## Styling

Component sử dụng shadcn/ui components:
- `Button` - Cho tất cả navigation buttons
- `Select` - Cho page size selector
- Tailwind CSS classes cho spacing và layout

### Customization
Bạn có thể customize bằng cách:
1. Thay đổi `className` trong component
2. Override Tailwind classes
3. Modify button variants

## Migration Guide

### From DataTable Built-in Pagination

**Before:**
```tsx
<DataTable
    data={items}
    pagination={{
        currentPage: page,
        totalPages: totalPages,
        onPageChange: setPage,
    }}
/>
```

**After:**
```tsx
<DataTable data={items} />

<Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={setPage}
    showPageSize={true}
    onPageSizeChange={handlePageSizeChange}
/>
```

## Best Practices

### 1. Always Reset Page on Filter/Search Change
```tsx
const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page
};
```

### 2. Reset Page on Page Size Change
```tsx
const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Important!
};
```

### 3. Include Page Size in Fetch Dependencies
```tsx
const fetchData = useCallback(async () => {
    // fetch logic
}, [page, pageSize]); // Include both!
```

### 4. Handle Empty States
```tsx
{totalPages === 0 ? (
    <div>No data</div>
) : (
    <Pagination
        currentPage={page}
        totalPages={Math.max(1, totalPages)} // Ensure at least 1
        onPageChange={setPage}
    />
)}
```

## Accessibility

- ✅ Screen reader support với `sr-only` labels
- ✅ Keyboard navigation
- ✅ Proper ARIA attributes
- ✅ Focus states
- ✅ Disabled states

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance

- Memoized page number calculations
- Efficient re-renders
- No unnecessary DOM updates
- Optimized for large page counts

## Examples in Codebase

### Pages Using Pagination Component
1. ✅ **Audit Logs** - Full featured with page size selector
2. 🔄 **Users** - Can migrate
3. 🔄 **Posts** - Can migrate
4. 🔄 **Roles** - Can migrate
5. 🔄 **Modules** - Can migrate

## Future Enhancements

### Planned Features
- [ ] Jump to page input
- [ ] Show total items count
- [ ] Compact mode for mobile
- [ ] Custom page number ranges
- [ ] Keyboard shortcuts (Ctrl+Left/Right)
- [ ] URL sync (query params)

## Troubleshooting

### Pagination not showing
- Check if `totalPages > 0`
- Verify `currentPage` and `totalPages` are numbers
- Check console for errors

### Page size not working
- Ensure `onPageSizeChange` is provided
- Check if `showPageSize={true}`
- Verify API supports limit parameter

### Page numbers wrong
- Check `parseApiResponse` calculation
- Verify API returns correct `total` and `limit`
- Log response to debug

## Support

For issues or questions:
1. Check this documentation
2. Review example implementations
3. Check component source code
4. Test with minimal example

## Version History

- **v1.0** - Initial release with core features
  - Page numbers with ellipsis
  - First/Last buttons
  - Page size selector
  - Full accessibility support

# Quick Test Guide

1.  **Reload Page**: Refresh lại trang `/dashboard/users/new` để đảm bảo code mới nhất được load.
2.  **Open Console**: Nhấn F12 -> Console.
3.  **Fill Form**:
    *   First Name: Test
    *   Last Name: User
    *   Email: test.user@example.com
    *   Password: password123
    *   Status: Active
    *   Roles: Check 1 role
    *   Department: (Leave empty or select one)
4.  **Submit**: Click "Create User".
5.  **Check Logs**:
    *   Nếu thành công: Thấy "✅ Create user result".
    *   Nếu thất bại: Thấy "❌ Failed to save user" và "Error Response Data".
    *   Nếu lỗi 400: Chụp lại phần "Error Response Data" để tôi xem backend báo gì.

**Note**: Tôi đã revert `role_ids` về dạng số (ví dụ `[4]`) và bỏ các trường optional rỗng. Điều này sẽ giúp tránh lỗi validation từ phía backend nếu backend validation quá chặt chẽ.

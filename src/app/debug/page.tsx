"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/axios";

interface TokenInfo {
    exists: boolean;
    value: string;
    length: number;
}

interface ApiTestResult {
    success: boolean;
    data?: unknown;
    status?: number;
    message?: unknown;
    hasToken?: boolean;
}

export default function DebugPage() {
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
    const [apiTest, setApiTest] = useState<ApiTestResult | null>(null);
    const [cookieString, setCookieString] = useState<string>("");

    useEffect(() => {
        // Check token
        const token = Cookies.get("token");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTokenInfo({
            exists: !!token,
            value: token ? `${token.substring(0, 30)}...` : "No token",
            length: token?.length || 0,
        });
        setCookieString(document.cookie || "No cookies");

        // Test API
        const testAPI = async () => {
            try {
                const response = await apiClient.get("/auth/me");
                setApiTest({ success: true, data: response.data });
            } catch (error: any) {
                setApiTest({
                    success: false,
                    status: error.response?.status,
                    message: error.response?.data,
                    hasToken: !!Cookies.get("token"),
                });
            }
        };

        if (token) {
            testAPI();
        }
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Debug Information</h1>

            <div className="space-y-4">
                <div className="border p-4 rounded">
                    <h2 className="font-bold mb-2">Token Info:</h2>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                        {JSON.stringify(tokenInfo, null, 2)}
                    </pre>
                </div>

                <div className="border p-4 rounded">
                    <h2 className="font-bold mb-2">API Test (/auth/me):</h2>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                        {JSON.stringify(apiTest, null, 2)}
                    </pre>
                </div>

                <div className="border p-4 rounded">
                    <h2 className="font-bold mb-2">All Cookies:</h2>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                        {cookieString}
                    </pre>
                </div>
            </div>
        </div>
    );
}

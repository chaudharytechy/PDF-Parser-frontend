import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import AuthLayout from '../layouts/AuthLayout.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import SignIn from '../pages/auth/SignIn.jsx'
import SignUp from '../pages/auth/SignUp.jsx'

import UserDashboard from '../pages/dashboard/UserDashboard.jsx'
import MyFiles from '../pages/dashboard/MyFiles.jsx'
import UploadPdf from '../pages/dashboard/UploadPdf.jsx'
import PdfDetails from '../pages/dashboard/PdfDetails.jsx'
import Settings from '../pages/dashboard/Settings.jsx'

// V2 / V3 / V4 — additional AI dashboards alongside the existing RAG (V1) flow.
import AgentDashboard from '../pages/dashboard/ai/AgentDashboard.jsx'
import McpDashboard from '../pages/dashboard/ai/McpDashboard.jsx'
import McpFinetunedDashboard from '../pages/dashboard/ai/McpFinetunedDashboard.jsx'

import NotFound from '../pages/NotFound.jsx'

// Note: /forgot-password and /reset-password routes were removed — the
// backend (userRoute.js) doesn't expose those endpoints yet. Add
// POST /user/forgot-password and POST /user/reset-password on the backend,
// then reinstate pages/auth/ForgotPassword.jsx and ResetPassword.jsx here.
export default function AppRoutes() {
  return (
    <Routes>
      {/* Default landing → redirect to dashboard (ProtectedRoute sends to /signin if not authed) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="files" element={<MyFiles />} />
        <Route path="upload" element={<UploadPdf />} />
        <Route path="files/:id" element={<PdfDetails />} />

        {/* V2 — AI Agent */}
        <Route path="ai/agent" element={<AgentDashboard />} />
        {/* V3 — MCP Agent */}
        <Route path="ai/mcp" element={<McpDashboard />} />
        {/* V4 — MCP + Fine-tuned LLM */}
        <Route path="ai/mcp-finetuned" element={<McpFinetunedDashboard />} />

        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

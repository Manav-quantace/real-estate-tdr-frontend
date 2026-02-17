//app/authority/participants/page.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Shield, UserPlus, Loader2 } from "lucide-react"

const ROLES = [
  { value: "SLUM_DWELLER", label: "Slum Dweller" },
  { value: "DEVELOPER", label: "Developer" },
  { value: "AFFORDABLE_HOUSING_DEV", label: "Affordable Housing Developer" },
  { value: "BUYER", label: "Buyer" },
  { value: "GOV_AUTHORITY", label: "Government Authority" },
  { value: "AUDITOR", label: "Auditor" },
]

const WORKFLOWS = [
  { value: "saleable", label: "Saleable Redevelopment" },
  { value: "slum", label: "Slum Redevelopment" },
  { value: "clearland", label: "Clear Land" },
  { value: "subsidized", label: "Subsidized / MHADA" },
]

export default function AuthorityParticipantsPage() {
  const [form, setForm] = useState({
    workflow: "",
    username: "",
    password: "",
    role: "",
    display_name: "",
  })

  const [loading, setLoading] = useState(false)

  function update(key: string, value: string) {
    setForm({ ...form, [key]: value })
  }

  function validate() {
    if (!form.workflow) return "Workflow is required"
    if (!form.username) return "Username is required"
    if (form.username.length < 3) return "Username must be at least 3 characters"
    if (!form.password) return "Password is required"
    if (form.password.length < 6) return "Password must be at least 6 characters"
    if (!form.display_name) return "Display name is required"
    if (!form.role) return "Role must be selected"
    return null
  }

  async function submit() {
    const error = validate()
    if (error) {
      toast.error("Validation Error", { description: error })
      return
    }

    setLoading(true)
    try {
      await api.createParticipant(form)
      toast.success("Participant Created", {
        description: `${form.display_name} registered as ${form.role.replace(/_/g, " ")}`,
      })
      setForm({
        workflow: "",
        username: "",
        password: "",
        role: "",
        display_name: "",
      })
    } catch (err: any) {
      toast.error("Creation Failed", {
        description:
          err?.detail ||
          err?.message ||
          "Participant already exists or permission denied",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-emerald-50 to-slate-100 p-6"
    >
      <Card className="w-full max-w-xl shadow-xl border-emerald-200">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <Shield className="h-5 w-5" />
            <span className="text-xs font-semibold tracking-wide">AUTHORITY CONTROL</span>
          </div>
          <CardTitle className="text-2xl">Register Participant</CardTitle>
          <CardDescription>
            Create system identities for stakeholders across workflows.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Workflow */}
          <div className="space-y-1">
            <Label>Workflow</Label>
            <Select value={form.workflow} onValueChange={(v) => update("workflow", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select workflow" />
              </SelectTrigger>
              <SelectContent>
                {WORKFLOWS.map(w => (
                  <SelectItem key={w.value} value={w.value}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <Label>Username</Label>
            <Input
              placeholder="unique_login_id"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>

          {/* Display Name */}
          <div className="space-y-1">
            <Label>Display Name</Label>
            <Input
              placeholder="Shown in UI (e.g. Dharavi Society)"
              value={form.display_name}
              onChange={(e) => update("display_name", e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => update("role", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(r => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={submit}
            disabled={loading}
            className="w-full gap-2 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Register Participant
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
